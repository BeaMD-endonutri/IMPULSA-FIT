import { clearSessionCookie, destroySession, privateJson } from "@/lib/private-auth";

export const runtime = "edge";

export async function POST(request: Request) {
  await destroySession(request).catch(() => undefined);
  const response = privateJson({ ok: true });
  response.headers.set("Set-Cookie", clearSessionCookie());
  return response;
}
