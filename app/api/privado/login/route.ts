import { cleanText, createSession, getD1, hashPassword, privateJson, sessionCookie, verifyPassword } from "@/lib/private-auth";

export const runtime = "edge";

type AccountRow = { id: number; display_name?: string; first_name?: string; last_name?: string; password_hash: string; password_salt: string; must_change_password: number };

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const role = body.role === "client" ? "client" : body.role === "professional" ? "professional" : null;
    const identifier = cleanText(body.identifier, 140).toLowerCase();
    const password = String(body.password ?? "");
    if (!role || !identifier || !password) return privateJson({ error: "Completa el usuario y la contraseña." }, { status: 400 });

    const db = await getD1();
    let account: AccountRow | null = null;
    if (role === "professional") {
      account = await db.prepare("SELECT id, display_name, password_hash, password_salt, must_change_password FROM professionals WHERE lower(username) = ? LIMIT 1")
        .bind(identifier).first<AccountRow>();

      if (!account) {
        const { env } = await import("cloudflare:workers");
        const bootstrapUser = String(env.PROFESSIONAL_USERNAME ?? "").toLowerCase();
        const bootstrapPassword = String(env.PROFESSIONAL_TEMP_PASSWORD ?? "");
        if (identifier !== bootstrapUser || password !== bootstrapPassword) return privateJson({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
        const credentials = await hashPassword(password);
        const now = Date.now();
        const result = await db.prepare("INSERT INTO professionals (username, display_name, password_hash, password_salt, must_change_password, created_at, updated_at) VALUES (?, ?, ?, ?, 1, ?, ?) RETURNING id")
          .bind(identifier, "Profesional IMPULSA FIT", credentials.hash, credentials.salt, now, now).first<{ id: number }>();
        account = { id: Number(result?.id), display_name: "Profesional IMPULSA FIT", password_hash: credentials.hash, password_salt: credentials.salt, must_change_password: 1 };
      } else if (!(await verifyPassword(password, account.password_salt, account.password_hash))) {
        return privateJson({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
      }
    } else {
      account = await db.prepare("SELECT id, first_name, last_name, password_hash, password_salt, must_change_password FROM clients WHERE lower(email) = ? AND status = 'active' LIMIT 1")
        .bind(identifier).first<AccountRow>();
      if (!account || !(await verifyPassword(password, account.password_salt, account.password_hash))) {
        return privateJson({ error: "Correo o contraseña incorrectos." }, { status: 401 });
      }
    }

    const session = await createSession(role, account.id);
    const response = privateJson({
      ok: true,
      role,
      name: role === "professional" ? account.display_name : `${account.first_name} ${account.last_name}`,
      mustChangePassword: Boolean(account.must_change_password),
    });
    response.headers.set("Set-Cookie", sessionCookie(session.token));
    return response;
  } catch (error) {
    console.error("Private login failed", error);
    return privateJson({ error: "No se ha podido iniciar sesión." }, { status: 500 });
  }
}
