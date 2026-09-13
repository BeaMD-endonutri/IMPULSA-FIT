import { getD1, privateJson, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function GET(request: Request) {
  const session = await requireRole(request, "client");
  if (session instanceof Response) return session;
  try {
    const db = await getD1();
    const client = await db.prepare("SELECT id, first_name, last_name, email, phone, must_change_password FROM clients WHERE id = ? AND status = 'active'")
      .bind(session.userId).first();
    if (!client) return privateJson({ error: "Cuenta no disponible." }, { status: 404 });
    const bonuses = await db.prepare(`
      SELECT b.id, b.name, b.initial_sessions, b.expires_at, b.status, b.created_at, COALESCE(SUM(m.delta), 0) AS remaining_sessions
      FROM bonuses b LEFT JOIN bonus_movements m ON m.bonus_id = b.id
      WHERE b.client_id = ? GROUP BY b.id ORDER BY b.created_at DESC
    `).bind(session.userId).all();
    const movements = await db.prepare(`
      SELECT m.id, b.name AS bonus_name, m.delta, m.reason, m.created_at
      FROM bonus_movements m JOIN bonuses b ON b.id = m.bonus_id
      WHERE b.client_id = ? ORDER BY m.created_at DESC LIMIT 50
    `).bind(session.userId).all();
    return privateJson({ client, bonuses: bonuses.results ?? [], movements: movements.results ?? [] });
  } catch (error) {
    console.error("Could not load client area", error);
    return privateJson({ error: "No se ha podido cargar tu área privada." }, { status: 500 });
  }
}
