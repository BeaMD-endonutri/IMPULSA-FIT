import { cleanMultiline, cleanText, getD1, privateJson, requireRole } from "@/lib/private-auth";
import { settleDueAppointments } from "@/lib/appointments";

export const runtime = "edge";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return privateJson({ error: "Cliente no válido." }, { status: 400 });
  try {
    await settleDueAppointments();
    const db = await getD1();
    const client = await db.prepare("SELECT id, first_name, last_name, email, phone, notes, status, created_at FROM clients WHERE id = ?").bind(id).first();
    if (!client) return privateJson({ error: "Cliente no encontrado." }, { status: 404 });
    const bonuses = await db.prepare(`
      SELECT b.id, b.name, b.initial_sessions, b.expires_at, b.status, b.created_at, COALESCE(SUM(m.delta), 0) AS remaining_sessions
      FROM bonuses b LEFT JOIN bonus_movements m ON m.bonus_id = b.id
      WHERE b.client_id = ? GROUP BY b.id ORDER BY b.created_at DESC
    `).bind(id).all();
    const movements = await db.prepare(`
      SELECT m.id, m.bonus_id, b.name AS bonus_name, m.delta, m.reason, m.created_at, p.display_name AS professional_name
      FROM bonus_movements m JOIN bonuses b ON b.id = m.bonus_id
      LEFT JOIN professionals p ON p.id = m.created_by
      WHERE b.client_id = ? ORDER BY m.created_at DESC LIMIT 100
    `).bind(id).all();
    const appointments = await db.prepare(`
      SELECT a.id, a.starts_at, a.ends_at, a.status, a.notes, a.deducted_at, b.name AS bonus_name
      FROM appointments a JOIN bonuses b ON b.id = a.bonus_id
      WHERE a.client_id = ? ORDER BY a.starts_at DESC LIMIT 100
    `).bind(id).all();
    return privateJson({ client, bonuses: bonuses.results ?? [], movements: movements.results ?? [], appointments: appointments.results ?? [] });
  } catch (error) {
    console.error("Could not load client", error);
    return privateJson({ error: "No se ha podido cargar la ficha." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  const id = Number((await context.params).id);
  try {
    const body = await request.json() as Record<string, unknown>;
    const firstName = cleanText(body.firstName, 60);
    const lastName = cleanText(body.lastName, 100);
    const email = cleanText(body.email, 140).toLowerCase();
    const phone = cleanText(body.phone, 30);
    const notes = cleanMultiline(body.notes, 1500);
    const status = body.status === "inactive" ? "inactive" : "active";
    if (!Number.isInteger(id) || firstName.length < 2 || lastName.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) return privateJson({ error: "Revisa los datos de la ficha." }, { status: 400 });
    await (await getD1()).prepare("UPDATE clients SET first_name = ?, last_name = ?, email = ?, phone = ?, notes = ?, status = ?, updated_at = ? WHERE id = ?")
      .bind(firstName, lastName, email, phone || null, notes || null, status, Date.now(), id).run();
    return privateJson({ ok: true });
  } catch (error) {
    console.error("Could not update client", error);
    return privateJson({ error: "No se ha podido actualizar la ficha." }, { status: 500 });
  }
}
