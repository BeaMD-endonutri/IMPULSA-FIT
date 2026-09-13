export const runtime = "edge";

export type PrivateRole = "professional" | "client";
export type PrivateSession = { role: PrivateRole; userId: number; expiresAt: number };

const COOKIE_NAME = "impulsa_private_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();

export async function getD1(): Promise<D1Database> {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) throw new Error("D1 binding DB is unavailable");
  return env.DB;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function randomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
}

export function randomPassword(length = 14): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%";
  const bytes = randomBytes(length);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const saltBytes = salt ? base64ToBytes(salt) : randomBytes(16);
  const key = await crypto.subtle.importKey("raw", toArrayBuffer(encoder.encode(password)), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: toArrayBuffer(saltBytes), iterations: 120_000 }, key, 256);
  return { hash: bytesToBase64(new Uint8Array(bits)), salt: bytesToBase64(saltBytes) };
}

export async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt);
  if (hash.length !== expectedHash.length) return false;
  let difference = 0;
  for (let index = 0; index < hash.length; index += 1) difference |= hash.charCodeAt(index) ^ expectedHash.charCodeAt(index);
  return difference === 0;
}

async function sha256(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", toArrayBuffer(encoder.encode(value)));
  return bytesToBase64(new Uint8Array(digest));
}

function readCookie(request: Request, name: string): string | null {
  const cookies = request.headers.get("cookie") ?? "";
  for (const part of cookies.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}

export async function createSession(role: PrivateRole, userId: number): Promise<{ token: string; expiresAt: number }> {
  const token = bytesToBase64(randomBytes(32)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const tokenHash = await sha256(token);
  const now = Date.now();
  const expiresAt = now + SESSION_SECONDS * 1000;
  const db = await getD1();
  await db.prepare("DELETE FROM private_sessions WHERE expires_at < ?").bind(now).run();
  await db.prepare("INSERT INTO private_sessions (token_hash, role, user_id, expires_at, created_at) VALUES (?, ?, ?, ?, ?)")
    .bind(tokenHash, role, userId, expiresAt, now).run();
  return { token, expiresAt };
}

export function sessionCookie(token: string): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_SECONDS}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function getSession(request: Request): Promise<PrivateSession | null> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return null;
  const tokenHash = await sha256(token);
  const row = await (await getD1()).prepare("SELECT role, user_id, expires_at FROM private_sessions WHERE token_hash = ? LIMIT 1")
    .bind(tokenHash).first<{ role: string; user_id: number; expires_at: number }>();
  if (!row || row.expires_at <= Date.now() || (row.role !== "professional" && row.role !== "client")) return null;
  return { role: row.role, userId: row.user_id, expiresAt: row.expires_at };
}

export async function requireRole(request: Request, role: PrivateRole): Promise<PrivateSession | Response> {
  const session = await getSession(request);
  if (!session || session.role !== role) return Response.json({ error: "No autorizado." }, { status: 401 });
  return session;
}

export async function destroySession(request: Request): Promise<void> {
  const token = readCookie(request, COOKIE_NAME);
  if (!token) return;
  await (await getD1()).prepare("DELETE FROM private_sessions WHERE token_hash = ?").bind(await sha256(token)).run();
}

export function privateJson(data: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("Content-Type", "application/json");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function cleanText(value: unknown, max: number): string {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, max);
}

export function cleanMultiline(value: unknown, max: number): string {
  return String(value ?? "").trim().replace(/\r/g, "").slice(0, max);
}
