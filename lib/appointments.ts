import { getD1 } from "@/lib/private-auth";

/** Idempotently converts every due appointment into one bonus movement. */
export async function settleDueAppointments(now = Date.now()): Promise<number> {
  const db = await getD1();
  const due = await db.prepare(`
    SELECT a.id, a.bonus_id, a.starts_at, c.first_name, c.last_name
    FROM appointments a
    JOIN clients c ON c.id = a.client_id
    WHERE a.status = 'scheduled' AND a.deducted_at IS NULL AND a.starts_at <= ?
    ORDER BY a.starts_at ASC LIMIT 100
  `).bind(now).all<{ id: number; bonus_id: number; starts_at: number; first_name: string; last_name: string }>();

  let settled = 0;
  for (const appointment of due.results ?? []) {
    const reason = `Sesión agendada · ${appointment.first_name} ${appointment.last_name}`;
    const inserted = await db.prepare(`
      INSERT OR IGNORE INTO bonus_movements (bonus_id, delta, reason, appointment_id, created_by, created_at)
      VALUES (?, -1, ?, ?, 0, ?)
    `).bind(appointment.bonus_id, reason, appointment.id, appointment.starts_at).run();
    await db.prepare(`
      UPDATE appointments SET status = 'completed', deducted_at = ?, updated_at = ?
      WHERE id = ? AND status = 'scheduled' AND EXISTS (
        SELECT 1 FROM bonus_movements WHERE appointment_id = appointments.id
      )
    `).bind(now, now, appointment.id).run();
    if (inserted.meta.changes) settled += 1;
  }
  return settled;
}
