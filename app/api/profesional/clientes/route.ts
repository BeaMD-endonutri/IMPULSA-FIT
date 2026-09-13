import { cleanMultiline, cleanText, getD1, hashPassword, privateJson, randomPassword, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function GET(request: Request) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  try {
    const result = await (await getD1()).prepare(`
      SELECT c.id, c.first_name, c.last_name, c.email, c.phone, c.notes, c.status, c.created_at,
        COUNT(DISTINCT b.id) AS bonus_count,
        COALESCE(SUM(m.delta), 0) AS remaining_sessions,
        MIN(CASE WHEN b.status = 'active' AND b.expires_at IS NOT NULL THEN b.expires_at END) AS next_expiry
      FROM clients c
      LEFT JOIN bonuses b ON b.client_id = c.id
      LEFT JOIN bonus_movements m ON m.bonus_id = b.id
      GROUP BY c.id ORDER BY c.last_name COLLATE NOCASE, c.first_name COLLATE NOCASE
    `).all();
    return privateJson({ clients: result.results ?? [] });
  } catch (error) {
    console.error("Could not list clients", error);
    return privateJson({ error: "No se han podido cargar los clientes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  try {
    const body = await request.json() as Record<string, unknown>;
    const firstName = cleanText(body.firstName, 60);
    const lastName = cleanText(body.lastName, 100);
    const email = cleanText(body.email, 140).toLowerCase();
    const phone = cleanText(body.phone, 30);
    const notes = cleanMultiline(body.notes, 1500);
    if (firstName.length < 2 || lastName.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) return privateJson({ error: "Completa nombre, apellidos y un correo válido." }, { status: 400 });
    const temporaryPassword = randomPassword();
    const credentials = await hashPassword(temporaryPassword);
    const now = Date.now();
    const created = await (await getD1()).prepare(`
      INSERT INTO clients (first_name, last_name, email, phone, notes, status, password_hash, password_salt, must_change_password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'active', ?, ?, 1, ?, ?) RETURNING id
    `).bind(firstName, lastName, email, phone || null, notes || null, credentials.hash, credentials.salt, now, now).first<{ id: number }>();
    return privateJson({ client: { id: created?.id, first_name: firstName, last_name: lastName, email, phone, status: "active" }, temporaryPassword }, { status: 201 });
  } catch (error) {
    console.error("Could not create client", error);
    const message = error instanceof Error && /unique/i.test(error.message) ? "Ya existe un cliente con ese correo." : "No se ha podido crear el cliente.";
    return privateJson({ error: message }, { status: 500 });
  }
}
