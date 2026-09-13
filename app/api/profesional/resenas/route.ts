import { getD1, privateJson, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function GET(request: Request) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  try {
    const result = await (await getD1()).prepare("SELECT id, first_name, last_name, rating, comment, created_at FROM reviews ORDER BY created_at DESC").all();
    return privateJson({ reviews: result.results ?? [] });
  } catch (error) {
    console.error("Could not load review moderation", error);
    return privateJson({ error: "No se han podido cargar las reseñas." }, { status: 500 });
  }
}
