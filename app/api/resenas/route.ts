export const runtime = "edge";

type ReviewRow = {
  id: number;
  first_name: string;
  last_name: string;
  rating: number;
  comment: string;
  created_at: number;
};

async function getDb() {
  const { env } = await import("cloudflare:workers");
  if (!env.DB) throw new Error("D1 binding DB is unavailable");
  return env.DB;
}

const allowedOrigins = new Set([
  "https://impulsa-fit-huelva.bea-md.chatgpt.site",
  "https://beamd-endonutri.github.io",
]);

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin");
  return origin && allowedOrigins.has(origin)
    ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" }
    : {};
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function GET(request: Request) {
  try {
    const result = await (await getDb()).prepare(
      `SELECT id, first_name, last_name, rating, comment, created_at
       FROM reviews ORDER BY created_at DESC LIMIT 30`
    ).all<ReviewRow>();

    return Response.json({ reviews: result.results ?? [] }, { headers: corsHeaders(request) });
  } catch (error) {
    console.error("Could not load reviews", error);
    return Response.json({ error: "No se han podido cargar las reseñas." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const firstName = String(body.firstName ?? "").trim().replace(/\s+/g, " ").slice(0, 60);
    const lastName = String(body.lastName ?? "").trim().replace(/\s+/g, " ").slice(0, 100);
    const comment = String(body.comment ?? "").trim().replace(/\s+/g, " ").slice(0, 800);
    const rating = Number(body.rating);
    const website = String(body.website ?? "").trim();

    if (website) return Response.json({ ok: true }, { status: 201, headers: corsHeaders(request) });
    if (firstName.length < 2 || lastName.length < 2 || comment.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json({ error: "Completa nombre, apellidos, puntuación y un comentario de al menos 10 caracteres." }, { status: 400, headers: corsHeaders(request) });
    }

    const createdAt = Date.now();
    const result = await (await getDb()).prepare(
      `INSERT INTO reviews (first_name, last_name, rating, comment, created_at)
       VALUES (?, ?, ?, ?, ?) RETURNING id`
    ).bind(firstName, lastName, rating, comment, createdAt).first<{ id: number }>();

    return Response.json({
      review: { id: result?.id, first_name: firstName, last_name: lastName, rating, comment, created_at: createdAt },
    }, { status: 201, headers: corsHeaders(request) });
  } catch (error) {
    console.error("Could not save review", error);
    return Response.json({ error: "No se ha podido publicar la reseña. Inténtalo de nuevo." }, { status: 500, headers: corsHeaders(request) });
  }
}
