import { settleDueAppointments } from "@/lib/appointments";
import { privateJson, requireRole } from "@/lib/private-auth";

export const runtime = "edge";

export async function POST(request: Request) {
  const session = await requireRole(request, "professional");
  if (session instanceof Response) return session;
  try { return privateJson({ processed: await settleDueAppointments() }); }
  catch (error) { console.error("Could not settle appointments", error); return privateJson({ error: "No se han podido actualizar las sesiones." }, { status: 500 }); }
}
