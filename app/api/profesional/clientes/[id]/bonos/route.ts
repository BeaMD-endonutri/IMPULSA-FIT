import { cleanText, getD1, privateJson, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  const clientId = Number((await context.params).id);
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = cleanText(body.name, 100);
    const sessions = Number(body.sessions);
    const expiresAt = body.expiresAt ? new Date(String(body.expiresAt)).getTime() : null;
    if (!Number.isInteger(clientId) || name.length < 2 || !Number.isInteger(sessions) || sessions < 1 || sessions > 500 || (expiresAt !== null && !Number.isFinite(expiresAt))) {
      return privateJson({ error: "Indica un nombre, sesiones válidas y una fecha correcta." }, { status: 400 });
    }
    const db = await getD1();
    const now = Date.now();
    const bonus = await db.prepare("INSERT INTO bonuses (client_id, name, initial_sessions, expires_at, status, created_at, updated_at) VALUES (?, ?, ?, ?, 'active', ?, ?) RETURNING id")
      .bind(clientId, name, sessions, expiresAt, now, now).first<{ id: number }>();
    await db.prepare("INSERT INTO bonus_movements (bonus_id, delta, reason, created_by, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(bonus?.id, sessions, "Alta inicial del bono", session.userId, now).run();
    return privateJson({ ok: true, bonusId: bonus?.id }, { status: 201 });
  } catch (error) {
    console.error("Could not create bonus", error);
    return privateJson({ error: "No se ha podido crear el bono." }, { status: 500 });
  }
}
