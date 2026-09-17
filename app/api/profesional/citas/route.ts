import { cleanMultiline, getD1, privateJson, requireRole } from "@/lib/private-auth";
import { settleDueAppointments } from "@/lib/appointments";

export const runtime = "edge";

export async function GET(request: Request) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  try {
    await settleDueAppointments();
    const url = new URL(request.url);
    const from = Number(url.searchParams.get("from")) || Date.now() - 31 * 86400000;
    const to = Number(url.searchParams.get("to")) || Date.now() + 62 * 86400000;
    const db = await getD1();
    const result = await db.prepare(`
      SELECT a.id, a.client_id, a.bonus_id, a.starts_at, a.ends_at, a.status, a.notes,
        a.deducted_at, c.first_name, c.last_name, b.name AS bonus_name
      FROM appointments a
      JOIN clients c ON c.id = a.client_id
      JOIN bonuses b ON b.id = a.bonus_id
      WHERE a.starts_at >= ? AND a.starts_at < ?
      ORDER BY a.starts_at ASC
    `).bind(from, to).all();
    return privateJson({ appointments: result.results ?? [] });
  } catch (error) {
    console.error("Could not list appointments", error);
    return privateJson({ error: "No se ha podido cargar la agenda." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  try {
    const body = await request.json() as Record<string, unknown>;
    const clientId = Number(body.clientId);
    const bonusId = Number(body.bonusId);
    const startsAt = Number(body.startsAt);
    const duration = Math.max(15, Math.min(180, Number(body.duration) || 40));
    const endsAt = startsAt + duration * 60000;
    const notes = cleanMultiline(body.notes, 500);
    if (!Number.isInteger(clientId) || !Number.isInteger(bonusId) || !Number.isFinite(startsAt)) return privateJson({ error: "Selecciona cliente, bono, fecha y hora." }, { status: 400 });
    if (startsAt < Date.now() - 60000) return privateJson({ error: "La cita debe programarse para una hora futura." }, { status: 400 });
    const db = await getD1();
    const bonus = await db.prepare(`
      SELECT b.id, COALESCE(SUM(m.delta), 0) AS remaining
      FROM bonuses b LEFT JOIN bonus_movements m ON m.bonus_id = b.id
      WHERE b.id = ? AND b.client_id = ? AND b.status = 'active' GROUP BY b.id
    `).bind(bonusId, clientId).first<{ id: number; remaining: number }>();
    if (!bonus) return privateJson({ error: "El bono seleccionado no pertenece a este cliente." }, { status: 400 });
    const reserved = await db.prepare("SELECT COUNT(*) AS total FROM appointments WHERE bonus_id = ? AND status = 'scheduled' AND deducted_at IS NULL")
      .bind(bonusId).first<{ total: number }>();
    if (Number(bonus.remaining) - Number(reserved?.total ?? 0) <= 0) return privateJson({ error: "Ese bono no tiene sesiones libres para reservar." }, { status: 409 });
    const overlap = await db.prepare("SELECT id FROM appointments WHERE status = 'scheduled' AND starts_at < ? AND ends_at > ? LIMIT 1")
      .bind(endsAt, startsAt).first();
    if (overlap) return privateJson({ error: "Ese tramo horario ya está ocupado." }, { status: 409 });
    const now = Date.now();
    const created = await db.prepare(`
      INSERT INTO appointments (client_id, bonus_id, starts_at, ends_at, status, notes, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'scheduled', ?, ?, ?, ?) RETURNING id
    `).bind(clientId, bonusId, startsAt, endsAt, notes || null, session.userId, now, now).first<{ id: number }>();
    return privateJson({ id: created?.id }, { status: 201 });
  } catch (error) {
    console.error("Could not create appointment", error);
    return privateJson({ error: "No se ha podido agendar la cita." }, { status: 500 });
  }
}
