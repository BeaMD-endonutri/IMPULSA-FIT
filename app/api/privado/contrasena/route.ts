import { cleanText, getD1, hashPassword, privateJson, requireRole, verifyPassword } from "@/lib/private-auth";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const role = body.role === "client" ? "client" : body.role === "professional" ? "professional" : null;
    if (!role) return privateJson({ error: "Perfil no válido." }, { status: 400 });
    const session = await requireRole(request, role);
    if (session instanceof Response) return session;
    const currentPassword = String(body.currentPassword ?? "");
    const newPassword = cleanText(body.newPassword, 100);
    if (newPassword.length < 10) return privateJson({ error: "La nueva contraseña debe tener al menos 10 caracteres." }, { status: 400 });
    const db = await getD1();
    const table = role === "professional" ? "professionals" : "clients";
    const account = await db.prepare(`SELECT password_hash, password_salt FROM ${table} WHERE id = ?`).bind(session.userId).first<{ password_hash: string; password_salt: string }>();
    if (!account || !(await verifyPassword(currentPassword, account.password_salt, account.password_hash))) return privateJson({ error: "La contraseña actual no es correcta." }, { status: 400 });
    const credentials = await hashPassword(newPassword);
    await db.prepare(`UPDATE ${table} SET password_hash = ?, password_salt = ?, must_change_password = 0, updated_at = ? WHERE id = ?`)
      .bind(credentials.hash, credentials.salt, Date.now(), session.userId).run();
    return privateJson({ ok: true });
  } catch (error) {
    console.error("Password change failed", error);
    return privateJson({ error: "No se ha podido cambiar la contraseña." }, { status: 500 });
  }
}
