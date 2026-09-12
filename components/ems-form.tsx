"use client";

import { useRef, useState } from "react";
import { PDFDocument, PDFTextField, StandardFonts, rgb } from "pdf-lib";
import { ArrowLeft, Check, Eraser, FileSignature, Send, ShieldCheck } from "lucide-react";

type Answers = Record<number, "si" | "no" | "">;

const questions = [
  "¿Tienes un marcapasos o cualquier otro dispositivo electrónico implantado (desfibrilador, implante coclear, etc.)?",
  "¿Estás embarazada o sospechas que podrías estarlo?",
  "¿Sufres epilepsia o has tenido convulsiones?",
  "¿Tienes alguna enfermedad cardíaca (arritmias, insuficiencia cardíaca, etc.) o has sufrido un infarto?",
  "¿Sufres cáncer o estás recibiendo tratamiento oncológico activo?",
  "¿Tienes trombosis, tromboflebitis o riesgo de formación de coágulos sanguíneos?",
  "¿Tienes problemas graves de circulación o enfermedades vasculares?",
  "¿Tienes hernias abdominales o inguinales significativas?",
  "¿Tienes alguna infección aguda o fiebre?",
  "¿Tienes lesiones cutáneas abiertas, heridas, quemaduras o irritaciones graves en las zonas donde se colocarán los electrodos?",
  "¿Sufres diabetes y tienes problemas de sensibilidad (neuropatía) o úlceras en la piel?",
  "¿Tienes alguna enfermedad neurológica (esclerosis múltiple, Parkinson) o muscular (miopatías) que pueda verse afectada?",
  "¿Estás bajo los efectos del alcohol o drogas?",
  "¿Conoces alguna otra razón por la cual no deberías realizar entrenamiento con electroestimulación?",
];

function SignaturePad({ label, onChange }: { label: string; onChange: (value: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  const point = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * (event.currentTarget.width / rect.width), y: (event.clientY - rect.top) * (event.currentTarget.height / rect.height) };
  };

  const start = (event: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    last.current = point(event);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const move = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const canvas = event.currentTarget;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const next = point(event);
    ctx.strokeStyle = "#071016";
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(next.x, next.y);
    ctx.stroke();
    last.current = next;
  };

  const finish = () => {
    if (!drawing.current || !canvasRef.current) return;
    drawing.current = false;
    onChange(canvasRef.current.toDataURL("image/png"));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    onChange("");
  };

  return (
    <div className="signature-box">
      <div className="signature-label"><span>{label}</span><button type="button" onClick={clear}><Eraser size={16} /> Borrar</button></div>
      <canvas ref={canvasRef} width={720} height={190} aria-label={label} onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} />
      <small>Firma con el dedo o con el ratón dentro del recuadro.</small>
    </div>
  );
}

function assetPath(file: string) {
  if (typeof window !== "undefined" && window.location.pathname.startsWith("/IMPULSA-FIT")) return `/IMPULSA-FIT/documentos/${file}`;
  return `/documentos/${file}`;
}

function emailEndpoint() {
  if (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) {
    return "https://impulsa-fit-huelva.bea-md.chatgpt.site/api/enviar-formulario";
  }
  return "/api/enviar-formulario";
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

export default function EmsForm() {
  const [answers, setAnswers] = useState<Answers>(Object.fromEntries(questions.map((_, index) => [index, ""])));
  const [consentSignature, setConsentSignature] = useState("");
  const [anamnesisSignature, setAnamnesisSignature] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const buildPdf = async (formData: FormData) => {
    const [consentBytes, anamnesisBytes] = await Promise.all([
      fetch(assetPath("Consentimiento_Informado_EMS.pdf")).then((response) => response.arrayBuffer()),
      fetch(assetPath("anamnesis-ems.pdf")).then((response) => response.arrayBuffer()),
    ]);
    const consent = await PDFDocument.load(consentBytes);
    const anamnesis = await PDFDocument.load(anamnesisBytes);
    const font = await consent.embedFont(StandardFonts.Helvetica);
    const pdfForm = consent.getForm();
    const fullName = `${formData.get("nombre") || ""} ${formData.get("apellidos") || ""}`.trim();
    const date = new Date(String(formData.get("fecha")) + "T12:00:00");
    const fieldValues: Record<string, string> = {
      Nombre: String(formData.get("nombre") || ""), Apellidos: String(formData.get("apellidos") || ""),
      DNI: String(formData.get("dni") || ""), "Fecha Nacimiento": String(formData.get("nacimiento") || ""),
      "Teléfono": String(formData.get("telefono") || ""), Correo: String(formData.get("email") || ""),
      "Nombre completo": fullName, Ciudad: String(formData.get("ciudad") || "Huelva"),
      "Día": String(date.getDate()), Mes: date.toLocaleDateString("es-ES", { month: "long" }), "Año": String(date.getFullYear()).slice(-2),
    };
    for (const field of pdfForm.getFields()) {
      const value = fieldValues[field.getName()];
      if (value !== undefined && field instanceof PDFTextField) field.setText(value);
    }
    pdfForm.updateFieldAppearances(font);
    const consentPng = await consent.embedPng(consentSignature);
    consent.getPages()[3].drawImage(consentPng, { x: 187, y: 230, width: 149, height: 47 });
    consent.getPages()[3].drawText(`Firmado online: ${new Date().toLocaleString("es-ES")}`, { x: 187, y: 217, size: 7, font, color: rgb(.25, .25, .25) });

    const copied = await consent.copyPages(anamnesis, [0, 1]);
    copied.forEach((page) => consent.addPage(page));
    const pages = consent.getPages();
    const first = pages[4];
    const second = pages[5];
    const firstYs = [732.7, 681.6, 630.6, 579.6, 528.6, 477.6, 426.5, 375.5, 324.5, 273.5, 222.4, 171.4];
    const secondYs = [775.2, 724.2];
    questions.forEach((_, index) => {
      const x = answers[index] === "si" ? 91 : 176;
      const page = index < 12 ? first : second;
      const y = index < 12 ? firstYs[index] : secondYs[index - 12];
      page.drawText("X", { x, y, size: 13, font, color: rgb(0, .25, .35) });
    });
    second.drawText(fullName, { x: 174, y: 686, size: 10, font, color: rgb(.05, .08, .1) });
    second.drawText(String(formData.get("fecha") || ""), { x: 103, y: 652, size: 10, font, color: rgb(.05, .08, .1) });
    const anamnesisPng = await consent.embedPng(anamnesisSignature);
    second.drawImage(anamnesisPng, { x: 170, y: 592, width: 280, height: 42 });
    second.drawText(`Firmado online: ${new Date().toLocaleString("es-ES")}`, { x: 170, y: 580, size: 7, font, color: rgb(.25, .25, .25) });

    const additionalInfo = String(formData.get("otraInformacion") || "").trim();
    const additionalPage = consent.addPage([595.28, 841.89]);
    additionalPage.drawText("INFORMACIÓN ADICIONAL", { x: 54, y: 770, size: 18, font, color: rgb(0, .25, .35) });
    additionalPage.drawText(`Persona: ${fullName}`, { x: 54, y: 738, size: 10, font, color: rgb(.2, .25, .28) });
    additionalPage.drawText(`Fecha: ${String(formData.get("fecha") || "")}`, { x: 54, y: 720, size: 10, font, color: rgb(.2, .25, .28) });
    additionalPage.drawText("Otra información que deberíamos saber sobre ti", { x: 54, y: 680, size: 12, font, color: rgb(.05, .08, .1) });
    const text = additionalInfo || "No se ha indicado información adicional.";
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, 10) <= 487) line = candidate;
      else {
        if (line) lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
    lines.slice(0, 42).forEach((item, index) => additionalPage.drawText(item, {
      x: 54, y: 652 - (index * 15), size: 10, font, color: rgb(.12, .16, .18),
    }));
    consent.setTitle(`Anamnesis y consentimiento EMS - ${fullName}`);
    consent.setAuthor("IMPULSA FIT");
    return consent.save();
  };

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("");
    if (Object.values(answers).some((answer) => !answer)) return setStatus("Responde las 14 preguntas de preparación.");
    if (!accepted || !consentSignature || !anamnesisSignature) return setStatus("Debes aceptar el consentimiento y firmar los dos documentos.");
    setBusy(true);
    try {
      const data = new FormData(event.currentTarget);
      const bytes = await buildPdf(data);
      const fullName = `${data.get("nombre") || ""} ${data.get("apellidos") || ""}`.trim();
      const response = await fetch(emailEndpoint(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pdfBase64: bytesToBase64(bytes),
          filename: `IMPULSA_FIT_${fullName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ]+/g, "_")}.pdf`,
          fullName,
          email: String(data.get("email") || ""),
          phone: String(data.get("telefono") || ""),
          otherInfo: String(data.get("otraInformacion") || ""),
        }),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "No se pudo enviar el formulario");
      event.currentTarget.reset();
      setAnswers(Object.fromEntries(questions.map((_, index) => [index, ""])));
      setAccepted(false);
      setConsentSignature("");
      setAnamnesisSignature("");
      setStatus("Formulario enviado correctamente. Hemos recibido el PDF cumplimentado y firmado.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se ha podido enviar el documento. Inténtalo de nuevo.");
    } finally { setBusy(false); }
  };

  return (
    <main className="form-page">
      <header className="form-header"><a href="./"><ArrowLeft size={19} /> Volver a IMPULSA FIT</a><span><FileSignature size={20} /> Valoración y consentimiento EMS</span></header>
      <div className="form-shell">
        <div className="form-intro"><p className="section-kicker"><ShieldCheck size={18} /> PROCESO SEGURO Y GUIADO</p><h1>Prepárate para<br /><em>tu primera sesión.</em></h1><p>Completa la anamnesis, revisa el consentimiento y firma ambos documentos. Recibirás un único PDF con toda la información.</p><div className="form-steps"><span><b>1</b> Datos</span><span><b>2</b> Anamnesis</span><span><b>3</b> Consentimiento</span><span><b>4</b> Firmas</span></div></div>
        <form className="ems-form" onSubmit={submit}>
          <fieldset><legend>1. Datos personales</legend><div className="online-grid"><label>Nombre<input name="nombre" required autoComplete="given-name" /></label><label>Apellidos<input name="apellidos" required autoComplete="family-name" /></label><label>DNI/NIE<input name="dni" required /></label><label>Fecha de nacimiento<input name="nacimiento" type="date" required /></label><label>Teléfono<input name="telefono" type="tel" required autoComplete="tel" /></label><label>Correo electrónico<input name="email" type="email" required autoComplete="email" /></label><label>Ciudad<input name="ciudad" defaultValue="Huelva" required /></label><label>Fecha de firma<input name="fecha" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required /></label></div></fieldset>

          <fieldset><legend>2. Cuestionario de preparación</legend><p className="field-help">Responde con sinceridad. Una respuesta afirmativa servirá para que el profesional valore tu caso antes de entrenar.</p><div className="question-list">{questions.map((question, index) => <div className="online-question" key={question}><p><b>{index + 1}.</b> {question}</p><div role="radiogroup" aria-label={question}><label><input type="radio" name={`q${index + 1}`} value="si" checked={answers[index] === "si"} onChange={() => setAnswers({ ...answers, [index]: "si" })} /> Sí</label><label><input type="radio" name={`q${index + 1}`} value="no" checked={answers[index] === "no"} onChange={() => setAnswers({ ...answers, [index]: "no" })} /> No</label></div></div>)}</div><label className="additional-info">Otra información que deberíamos saber sobre ti<textarea name="otraInformacion" rows={5} maxLength={3000} placeholder="Cuéntanos cualquier dato de salud, lesión, tratamiento o circunstancia que pueda ser relevante (opcional)." /></label></fieldset>

          <fieldset><legend>3. Consentimiento informado</legend><div className="consent-summary"><h2>Uso de chalecos de electroestimulación muscular (EMS)</h2><p>Declaro que he recibido y comprendido la información sobre el procedimiento, sus objetivos, beneficios esperados, riesgos, posibles efectos secundarios, contraindicaciones y compromisos del usuario.</p><p>Confirmo que he facilitado información veraz sobre mi salud y que podré comunicar cualquier cambio o molestia al profesional. Sé que puedo revocar este consentimiento en cualquier momento.</p><a href={assetPath("Consentimiento_Informado_EMS.pdf")} target="_blank" rel="noreferrer">Leer el consentimiento completo en PDF</a></div><label className="acceptance"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /> <span>He leído y comprendido el consentimiento informado completo y acepto continuar con la firma.</span></label></fieldset>

          <fieldset><legend>4. Firmas online</legend><div className="signature-grid"><SignaturePad label="Firma de la anamnesis" onChange={setAnamnesisSignature} /><SignaturePad label="Firma del consentimiento informado" onChange={setConsentSignature} /></div></fieldset>

          <div className="submission-box"><div><h2>Enviar documentos firmados</h2><p>Se generará un único PDF con la anamnesis, el consentimiento y la información adicional, todo cumplimentado y firmado, y se enviará de forma segura a nuestro equipo.</p><p className="test-mode">Destino: <strong>nutri.bea.md@gmail.com</strong>. No almacenamos una copia adicional en esta web.</p></div><button type="submit" disabled={busy}>{busy ? "Enviando…" : "Firmar y enviar formulario"} <Send size={19} /></button></div>
          {status && <p className="form-status" role="status"><Check size={18} /> {status}</p>}
        </form>
      </div>
    </main>
  );
}
