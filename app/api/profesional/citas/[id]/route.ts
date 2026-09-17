import { getD1, privateJson, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  const { id } = await context.params;
  try {
    const appointmentId = Number(id);
    const body = await request.json() as { action?: string };
    const db = await getD1();
    if (body.action === "cancel") {
      const result = await db.prepare("UPDATE appointments SET status = 'cancelled', updated_at = ? WHERE id = ? AND status = 'scheduled' AND deducted_at IS NULL")
        .bind(Date.now(), appointmentId).run();
      if (!result.meta.changes) return privateJson({ error: "La cita ya se realizó o fue cancelada." }, { status: 409 });
      return privateJson({ ok: true });
    }
    return privateJson({ error: "Acción no válida." }, { status: 400 });
  } catch (error) {
    console.error("Could not update appointment", error);
    return privateJson({ error: "No se ha podido actualizar la cita." }, { status: 500 });
  }
}
