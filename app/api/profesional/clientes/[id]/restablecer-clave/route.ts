import { getD1, hashPassword, privateJson, randomPassword, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  const clientId = Number((await context.params).id);
  if (!Number.isInteger(clientId)) return privateJson({ error: "Cliente no válido." }, { status: 400 });
  try {
    const temporaryPassword = randomPassword();
    const credentials = await hashPassword(temporaryPassword);
    const db = await getD1();
    await db.prepare("UPDATE clients SET password_hash = ?, password_salt = ?, must_change_password = 1, updated_at = ? WHERE id = ?")
      .bind(credentials.hash, credentials.salt, Date.now(), clientId).run();
    await db.prepare("DELETE FROM private_sessions WHERE role = 'client' AND user_id = ?").bind(clientId).run();
    return privateJson({ temporaryPassword });
  } catch (error) {
    console.error("Could not reset client password", error);
    return privateJson({ error: "No se ha podido generar una nueva contraseña." }, { status: 500 });
  }
}
