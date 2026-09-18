import { settleDueAppointments } from "@/lib/appointments";

export const runtime = "edge";

/**
 * Background hook used by the scheduled GitHub workflow.
 * It is intentionally idempotent: each appointment can create only one
 * movement, so retries never deduct the same session twice.
 */
export async function POST() {
  try {
    await settleDueAppointments();
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Could not settle scheduled appointments", error);
    return new Response(null, { status: 500 });
  }
}
