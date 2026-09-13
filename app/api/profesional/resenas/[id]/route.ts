import { getD1, privateJson, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  const id = Number((await context.params).id);
  if (!Number.isInteger(id)) return privateJson({ error: "Reseña no válida." }, { status: 400 });
  try {
    await (await getD1()).prepare("DELETE FROM reviews WHERE id = ?").bind(id).run();
    return privateJson({ ok: true });
  } catch (error) {
    console.error("Could not delete review", error);
    return privateJson({ error: "No se ha podido eliminar la reseña." }, { status: 500 });
  }
}
