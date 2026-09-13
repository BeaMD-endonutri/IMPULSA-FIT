import { cleanText, getD1, privateJson, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  const bonusId = Number((await context.params).id);
  try {
    const body = await request.json() as Record<string, unknown>;
    const delta = Number(body.delta);
    const reason = cleanText(body.reason, 180);
    if (!Number.isInteger(bonusId) || !Number.isInteger(delta) || delta === 0 || Math.abs(delta) > 500 || reason.length < 3) return privateJson({ error: "Indica una cantidad y un motivo válidos." }, { status: 400 });
    const db = await getD1();
    const balance = await db.prepare("SELECT COALESCE(SUM(delta), 0) AS remaining FROM bonus_movements WHERE bonus_id = ?").bind(bonusId).first<{ remaining: number }>();
    if (Number(balance?.remaining ?? 0) + delta < 0) return privateJson({ error: "El bono no puede quedar con sesiones negativas." }, { status: 400 });
    const inserted = await db.prepare(`
      INSERT INTO bonus_movements (bonus_id, delta, reason, created_by, created_at)
      SELECT ?, ?, ?, ?, ?
      WHERE EXISTS (SELECT 1 FROM bonuses WHERE id = ?)
        AND (? > 0 OR COALESCE((SELECT SUM(delta) FROM bonus_movements WHERE bonus_id = ?), 0) + ? >= 0)
      RETURNING id
    `).bind(bonusId, delta, reason, session.userId, Date.now(), bonusId, delta, bonusId, delta).first<{ id: number }>();
    if (!inserted) return privateJson({ error: "El bono ha cambiado y no admite ese descuento. Actualiza la ficha e inténtalo de nuevo." }, { status: 409 });
    await db.prepare("UPDATE bonuses SET updated_at = ? WHERE id = ?").bind(Date.now(), bonusId).run();
    return privateJson({ ok: true });
  } catch (error) {
    console.error("Could not add movement", error);
    return privateJson({ error: "No se ha podido registrar el movimiento." }, { status: 500 });
  }
}
