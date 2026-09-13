import { getD1, getSession, privateJson } from "@/lib/private-auth";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session) return privateJson({ authenticated: false }, { status: 401 });
    const db = await getD1();
    if (session.role === "professional") {
      const user = await db.prepare("SELECT display_name, must_change_password FROM professionals WHERE id = ?").bind(session.userId).first<{ display_name: string; must_change_password: number }>();
      if (!user) return privateJson({ authenticated: false }, { status: 401 });
      return privateJson({ authenticated: true, role: session.role, name: user.display_name, mustChangePassword: Boolean(user.must_change_password) });
    }
    const user = await db.prepare("SELECT first_name, last_name, must_change_password FROM clients WHERE id = ? AND status = 'active'").bind(session.userId).first<{ first_name: string; last_name: string; must_change_password: number }>();
    if (!user) return privateJson({ authenticated: false }, { status: 401 });
    return privateJson({ authenticated: true, role: session.role, name: `${user.first_name} ${user.last_name}`, mustChangePassword: Boolean(user.must_change_password) });
  } catch (error) {
    console.error("Session check failed", error);
    return privateJson({ authenticated: false }, { status: 401 });
  }
}
