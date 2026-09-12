export const runtime = "edge";

const allowedOrigins = new Set([
  "https://beamd-endonutri.github.io",
  "https://impulsa-fit-huelva.bea-md.chatgpt.site",
]);

function corsHeaders(origin: string | null) {
  const allowedOrigin = origin && allowedOrigins.has(origin)
    ? origin
    : "https://beamd-endonutri.github.io";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const headers = { ...corsHeaders(origin), "Content-Type": "application/json" };

  if (origin && !allowedOrigins.has(origin)) {
    return Response.json({ error: "Origen no autorizado." }, { status: 403, headers });
  }

  try {
    const body = await request.json() as {
      pdfBase64?: string;
      filename?: string;
      fullName?: string;
      email?: string;
      phone?: string;
      otherInfo?: string;
    };
    const fullName = String(body.fullName || "").trim().slice(0, 140);
    const email = String(body.email || "").trim().slice(0, 180);
    const phone = String(body.phone || "").trim().slice(0, 50);
    const otherInfo = String(body.otherInfo || "").trim().slice(0, 3000);
    const pdfBase64 = String(body.pdfBase64 || "");
    const filename = String(body.filename || "formulario-ems-firmado.pdf").replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_.-]/g, "_").slice(0, 180);

    if (!fullName || !/^\S+@\S+\.\S+$/.test(email) || !pdfBase64.startsWith("JVBERi0") || pdfBase64.length > 18_000_000) {
      return Response.json({ error: "Los datos del formulario están incompletos o el documento es demasiado grande." }, { status: 400, headers });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      return Response.json({ error: "El servicio de correo no está configurado." }, { status: 503, headers });
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "IMPULSA FIT <onboarding@resend.dev>",
        to: ["nutri.bea.md@gmail.com"],
        reply_to: email,
        subject: `Nuevo formulario EMS firmado — ${fullName}`,
        text: `Se ha recibido un nuevo formulario EMS cumplimentado y firmado.\n\nNombre: ${fullName}\nCorreo: ${email}\nTeléfono: ${phone || "No indicado"}\nOtra información: ${otherInfo || "No indicada"}\n\nEl documento conjunto se adjunta en PDF.`,
        html: `<h2>Nuevo formulario EMS firmado</h2><p>Se ha recibido un nuevo formulario cumplimentado y firmado.</p><ul><li><strong>Nombre:</strong> ${escapeHtml(fullName)}</li><li><strong>Correo:</strong> ${escapeHtml(email)}</li><li><strong>Teléfono:</strong> ${escapeHtml(phone || "No indicado")}</li><li><strong>Otra información:</strong> ${escapeHtml(otherInfo || "No indicada")}</li></ul><p>El documento conjunto se adjunta en PDF.</p>`,
        attachments: [{ filename, content: pdfBase64 }],
      }),
    });

    if (!resendResponse.ok) {
      const detail = await resendResponse.text();
      console.error("Resend rejected EMS form delivery", resendResponse.status, detail.slice(0, 300));
      return Response.json({ error: "No se ha podido entregar el correo. Inténtalo de nuevo en unos minutos." }, { status: 502, headers });
    }

    return Response.json({ ok: true }, { headers });
  } catch (error) {
    console.error("EMS form delivery failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "No se ha podido enviar el documento. Inténtalo de nuevo." }, { status: 500, headers });
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[character] || character);
}
