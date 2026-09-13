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

function ConsentDocument() {
  return (
    <div className="consent-copy">
      <h3>Consentimiento informado para el uso de chalecos de electroestimulación muscular (EMS)</h3>
      <p><strong>Centro/empresa:</strong> Centro Deportivo Conde Wellness Fitness<br /><strong>Dirección:</strong> Av. Miss Whitney 9/11, CP 21003<br /><strong>NIF/CIF:</strong> B21313150</p>

      <h4>I. Información sobre el tratamiento de electroestimulación muscular (EMS)</h4>
      <p>He sido informado/a por Alexandre Miguel Araujo Romao sobre el tratamiento de electroestimulación muscular (EMS) mediante el uso de un chaleco específico. He comprendido que:</p>
      <ol>
        <li><strong>¿Qué es la Electroestimulación Muscular (EMS)?</strong> La EMS es una técnica que utiliza impulsos eléctricos de baja o media frecuencia para provocar contracciones musculares. Estos impulsos se aplican a través de electrodos colocados en un chaleco y otras zonas del cuerpo, complementando el ejercicio físico voluntario. Se busca optimizar el rendimiento muscular, tonificar, fortalecer y, en algunos casos, contribuir a la recuperación o rehabilitación.</li>
        <li><strong>Objetivos del tratamiento.</strong> Los objetivos específicos pueden ser:<ul><li>Aumento de la fuerza y resistencia muscular.</li><li>Tonificación muscular.</li><li>Mejora de la composición corporal: reducción de grasa y aumento de masa muscular.</li><li>Rehabilitación de lesiones, si es el caso y bajo supervisión médica o fisioterapéutica.</li><li>Otros objetivos específicos que se hayan acordado.</li></ul></li>
        <li><strong>Descripción del procedimiento.</strong> El tratamiento se realizará con un chaleco de electroestimulación y, en su caso, otros electrodos adicionales colocados estratégicamente en el cuerpo. El profesional ajustará los parámetros de intensidad, frecuencia y duración según la tolerancia, condición física y objetivos acordados. La sesión combinará la aplicación de EMS con ejercicios dinámicos y/o estáticos dirigidos por el profesional.</li>
        <li><strong>Beneficios esperados.</strong><ul><li>Aumento de la fuerza, resistencia y potencia muscular.</li><li>Mejora de la tonificación y definición muscular.</li><li>Reducción de la grasa corporal y mejora del metabolismo.</li><li>Optimización del tiempo de entrenamiento.</li><li>Activación de musculatura profunda.</li></ul></li>
      </ol>

      <h4>II. Riesgos potenciales y efectos secundarios</h4>
      <p>La EMS es generalmente segura cuando se aplica correctamente por profesionales cualificados. Como en cualquier actividad física intensa o procedimiento con dispositivos eléctricos, pueden existir riesgos o efectos secundarios:</p>
      <ol>
        <li><strong>Rabdomiólisis:</strong> es un riesgo potencial si la intensidad o duración del estímulo es excesiva o si el usuario no está habituado al ejercicio intenso. Consiste en una ruptura de las fibras musculares que puede liberar sustancias perjudiciales al torrente sanguíneo y, en casos graves, afectar a los riñones. Se manifiesta por dolor muscular intenso y orina oscura.</li>
        <li><strong>Molestias y dolor:</strong> sensación de hormigueo, picor, contracciones musculares intensas o incluso dolor leve durante o después de la sesión, especialmente al inicio o al aumentar la intensidad.</li>
        <li><strong>Fatiga muscular intensa:</strong> es normal sentir una fatiga muscular superior a la de un entrenamiento convencional.</li>
        <li><strong>Agujetas (dolor muscular de aparición tardía):</strong> pueden ser más intensas y prolongadas de lo habitual y durar varios días.</li>
        <li><strong>Irritación cutánea:</strong> enrojecimiento, picor o irritación leve en la zona de los electrodos debido al contacto con la piel o el gel conductor.</li>
        <li><strong>Deshidratación:</strong> es importante mantener una buena hidratación antes, durante y después de la sesión.</li>
        <li><strong>Quemaduras superficiales:</strong> en casos muy raros, si los electrodos están mal colocados o hay fallos técnicos, aunque el equipo utilizado es de alta calidad y se somete a revisiones periódicas.</li>
      </ol>

      <h4>III. Contraindicaciones absolutas y relativas</h4>
      <p><strong>Contraindicaciones absolutas:</strong></p>
      <ul>
        <li>Marcapasos, desfibrilador u otros implantes eléctricos o electrónicos.</li>
        <li>Epilepsia o trastornos convulsivos.</li>
        <li>Embarazo, especialmente en el abdomen.</li>
        <li>Problemas cardíacos graves: arritmias, cardiopatías, insuficiencia cardíaca descompensada, etc.</li>
        <li>Cáncer o tumores activos.</li>
        <li>Trombosis, tromboflebitis activa o riesgo elevado de coágulos.</li>
        <li>Hernias abdominales o inguinales graves no tratadas.</li>
        <li>Enfermedades neurológicas graves, como esclerosis múltiple en fase aguda.</li>
        <li>Enfermedades inflamatorias agudas o procesos infecciosos con fiebre.</li>
        <li>Irritación de la piel, quemaduras, heridas abiertas, eccemas o erupciones cutáneas en las zonas de aplicación.</li>
        <li>Insuficiencia renal o hepática grave.</li>
        <li>Diarreas o vómitos el mismo día de la sesión.</li>
      </ul>
      <p><strong>Contraindicaciones relativas que requieren valoración previa o supervisión especial:</strong></p>
      <ul>
        <li>Diabetes, especialmente si no está controlada.</li>
        <li>Hipertensión arterial, si no está controlada o es grave.</li>
        <li>Enfermedades metabólicas.</li>
        <li>Enfermedades autoinmunes.</li>
        <li>Implantes metálicos: prótesis, clavos, etc.</li>
        <li>Varices muy pronunciadas.</li>
        <li>Problemas circulatorios, como insuficiencia venosa crónica.</li>
        <li>Lesiones musculares o articulares recientes o no diagnosticadas.</li>
        <li>Uso de ciertos medicamentos, como anticoagulantes.</li>
        <li>Estados febriles o procesos víricos o bacterianos en curso.</li>
        <li>Menores de 18 años o personas de edad avanzada, que requieren supervisión y adaptación de la intensidad.</li>
        <li>Sedentarismo extremo o falta de acondicionamiento físico previo.</li>
      </ul>

      <h4>IV. Compromisos del usuario/a</h4>
      <ol>
        <li>Informar con total sinceridad y exactitud sobre mi historial médico, cualquier condición de salud preexistente, medicación que esté tomando o cualquier cambio en mi estado de salud antes y durante el periodo de tratamiento con EMS.</li>
        <li>Comunicar de inmediato al profesional cualquier molestia, dolor inusual o síntoma adverso durante o después de la sesión.</li>
        <li>Seguir rigurosamente las instrucciones del profesional durante toda la sesión, incluyendo la intensidad de los impulsos y la realización de los ejercicios.</li>
        <li>Mantener una hidratación adecuada antes, durante y después de cada sesión.</li>
        <li>No realizar sesiones con una frecuencia o intensidad superior a la recomendada por el profesional.</li>
        <li>Entender que la omisión de información relevante o el incumplimiento de las instrucciones puede aumentar los riesgos para mi salud.</li>
      </ol>

      <h4>V. Revocabilidad y dudas</h4>
      <ul><li>He tenido la oportunidad de hacer todas las preguntas que he considerado oportunas y me han sido respondidas de manera clara y comprensible.</li><li>Comprendo que tengo derecho a revocar este consentimiento en cualquier momento, sin necesidad de justificación y sin que ello afecte a mi derecho a recibir otra atención o asistencia en el futuro. En tal caso, comunicaré mi decisión al profesional o centro.</li></ul>

      <h4>Declaración de consentimiento</h4>
      <p>Por la presente, declaro que he leído y comprendido toda la información proporcionada en este consentimiento informado sobre el uso de chalecos de electroestimulación muscular (EMS), incluyendo los objetivos, la descripción del procedimiento, los beneficios esperados, los riesgos potenciales, los efectos secundarios y las contraindicaciones.</p><p>Confirmo que no presento ninguna de las contraindicaciones absolutas mencionadas y que he informado con veracidad sobre cualquier contraindicación relativa o condición de salud relevante. En consecuencia, y tras haber resuelto todas mis dudas, otorgo mi consentimiento libre y voluntario para someterme a las sesiones de electroestimulación muscular (EMS) con chaleco en Centro Deportivo Conde Wellness Fitness.</p>
      <p><strong>Profesional responsable:</strong> Alexandre Miguel Araujo Romao.</p>
    </div>
  );
}

export default function EmsForm() {
  const [answers, setAnswers] = useState<Answers>(Object.fromEntries(questions.map((_, index) => [index, ""])));
  const [consentSignature, setConsentSignature] = useState("");
  const [anamnesisSignature, setAnamnesisSignature] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  const buildPdf = async (formData: FormData) => {
    const consentBytes = await fetch(assetPath("Consentimiento_Informado_EMS.pdf")).then((response) => response.arrayBuffer());
    const consent = await PDFDocument.load(consentBytes);
    const font = await consent.embedFont(StandardFonts.Helvetica);
    const boldFont = await consent.embedFont(StandardFonts.HelveticaBold);
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

    const answersPage = consent.addPage([595.28, 841.89]);
    answersPage.drawText("CUESTIONARIO DE PREPARACIÓN - RESUMEN", { x: 45, y: 800, size: 16, font: boldFont, color: rgb(0, .3, .38) });
    answersPage.drawText(`Persona: ${fullName}`, { x: 45, y: 776, size: 9, font: boldFont, color: rgb(.1, .14, .16) });
    answersPage.drawText(`DNI/NIE: ${String(formData.get("dni") || "")}`, { x: 45, y: 761, size: 9, font, color: rgb(.2, .25, .28) });
    answersPage.drawText(`Fecha: ${String(formData.get("fecha") || "")}`, { x: 330, y: 761, size: 9, font, color: rgb(.2, .25, .28) });
    questions.forEach((question, index) => {
      const rowTop = 733 - (index * 42);
      if (index % 2 === 0) answersPage.drawRectangle({ x: 40, y: rowTop - 31, width: 515, height: 37, color: rgb(.95, .98, .985) });
      answersPage.drawText(`${index + 1}.`, { x: 48, y: rowTop - 8, size: 9, font: boldFont, color: rgb(0, .3, .38) });
      const words = question.split(/\s+/);
      const wrapped: string[] = [];
      let current = "";
      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (font.widthOfTextAtSize(candidate, 8.2) <= 395) current = candidate;
        else { if (current) wrapped.push(current); current = word; }
      }
      if (current) wrapped.push(current);
      wrapped.slice(0, 2).forEach((line, lineIndex) => answersPage.drawText(line, { x: 70, y: rowTop - 7 - (lineIndex * 11), size: 8.2, font, color: rgb(.1, .14, .16) }));
      const selectedYes = answers[index] === "si";
      answersPage.drawRectangle({ x: 498, y: rowTop - 20, width: 48, height: 22, color: selectedYes ? rgb(0, .47, .58) : rgb(.22, .3, .34) });
      answersPage.drawText(selectedYes ? "SI" : "NO", { x: selectedYes ? 516 : 513, y: rowTop - 14, size: 9, font: boldFont, color: rgb(1, 1, 1) });
    });
    answersPage.drawText("Firma de la anamnesis", { x: 45, y: 127, size: 8, font: boldFont, color: rgb(.1, .14, .16) });
    const anamnesisPng = await consent.embedPng(anamnesisSignature);
    answersPage.drawImage(anamnesisPng, { x: 45, y: 68, width: 210, height: 52 });
    answersPage.drawLine({ start: { x: 45, y: 65 }, end: { x: 255, y: 65 }, thickness: .8, color: rgb(.3, .36, .38) });
    answersPage.drawText(`Firmado online: ${new Date().toLocaleString("es-ES")}`, { x: 45, y: 50, size: 7, font, color: rgb(.25, .25, .25) });

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
    const form = event.currentTarget;
    setStatus("");
    if (Object.values(answers).some((answer) => !answer)) return setStatus("Responde las 14 preguntas de preparación.");
    if (!accepted || !consentSignature || !anamnesisSignature) return setStatus("Debes aceptar el consentimiento y firmar los dos documentos.");
    setBusy(true);
    try {
      const data = new FormData(form);
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
      form.reset();
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

          <fieldset><legend>3. Consentimiento informado</legend><div className="consent-summary"><h2>Uso de chalecos de electroestimulación muscular (EMS)</h2><p>Declaro que he recibido y comprendido la información sobre el procedimiento, sus objetivos, beneficios esperados, riesgos, posibles efectos secundarios, contraindicaciones y compromisos del usuario.</p><p>Confirmo que he facilitado información veraz sobre mi salud y que podré comunicar cualquier cambio o molestia al profesional. Sé que puedo revocar este consentimiento en cualquier momento.</p><details className="consent-document"><summary>Leer aquí el consentimiento completo</summary><ConsentDocument /></details><div className="consent-actions"><a href={assetPath("Consentimiento_Informado_EMS.pdf")}>Abrir PDF</a><a href={assetPath("Consentimiento_Informado_EMS.pdf")} download>Descargar PDF</a></div></div><label className="acceptance"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} /> <span>He leído y comprendido el consentimiento informado completo y acepto continuar con la firma.</span></label></fieldset>

          <fieldset><legend>4. Firmas online</legend><div className="signature-grid"><SignaturePad label="Firma de la anamnesis" onChange={setAnamnesisSignature} /><SignaturePad label="Firma del consentimiento informado" onChange={setConsentSignature} /></div></fieldset>

          <div className="submission-box"><div><h2>Enviar documentos firmados</h2><p>Se generará un único PDF con la anamnesis, el consentimiento y la información adicional, todo cumplimentado y firmado, y se enviará de forma segura a nuestro equipo.</p><p className="test-mode">Destino: <strong>nutri.bea.md@gmail.com</strong>. No almacenamos una copia adicional en esta web.</p></div><button type="submit" disabled={busy}>{busy ? "Enviando…" : "Firmar y enviar formulario"} <Send size={19} /></button></div>
          {status && <p className="form-status" role="status"><Check size={18} /> {status}</p>}
        </form>
      </div>
    </main>
  );
}
