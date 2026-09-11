import {
  Activity, ArrowRight, BadgeCheck, Bolt, Check, Clock3, Dumbbell,
  AtSign, HeartPulse, Mail, Menu, ShieldCheck, Sparkles,
  TimerReset, UserRoundCheck, X,
} from "lucide-react";

const evidence = [
  { icon: Dumbbell, title: "Fuerza y función muscular", text: "Los estudios muestran mejoras de fuerza y capacidad funcional frente a no entrenar. La respuesta depende del programa, la intensidad y la constancia." },
  { icon: Activity, title: "Masa muscular y composición corporal", text: "La evidencia es favorable, sobre todo en personas sedentarias o con poca afinidad por el gimnasio. No sustituye una alimentación adecuada ni garantiza perder grasa." },
  { icon: HeartPulse, title: "Bajo impacto articular", text: "Permite generar estímulo muscular con poca carga externa. Puede ser una opción útil cuando el tiempo, la tolerancia a las cargas o la motivación son una barrera." },
];

const profiles = [
  { number: "01", title: "Si empiezas desde cero", text: "Una sesión guiada reduce la complejidad: aprendemos movimientos sencillos y graduamos el estímulo zona a zona." },
  { number: "02", title: "Si vas justo de tiempo", text: "La WB-EMS concentra un estímulo global en sesiones cortas. Es eficiencia de tiempo, no un atajo sin esfuerzo." },
  { number: "03", title: "Si ya entrenas", text: "Puede sumar un estímulo complementario y específico. No reemplaza por sí sola la técnica, las cargas, el cardio ni tu práctica deportiva." },
  { number: "04", title: "Si necesitas adaptar cargas", text: "Puede reducir la carga externa, siempre tras valorar antecedentes, limitaciones y objetivos. Las patologías requieren criterio sanitario." },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="IMPULSA FIT, inicio">
          <span className="pulse-mark" aria-hidden="true"><svg viewBox="0 0 64 28"><path d="M2 15h12l5-9 8 19 8-23 8 18 5-9 5 4h9" /></svg></span>
          <span>IMPULSA<span>FIT</span></span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#que-es">Qué es</a><a href="#evidencia">Evidencia</a><a href="#para-quien">Para quién</a><a href="#seguridad">Seguridad</a>
        </nav>
        <a className="header-cta" href="#contacto">Quiero probarlo <ArrowRight size={17} /></a>
        <details className="mobile-menu">
          <summary aria-label="Abrir menú"><Menu size={24} /></summary>
          <div><a href="#que-es">Qué es</a><a href="#evidencia">Evidencia</a><a href="#para-quien">Para quién</a><a href="#seguridad">Seguridad</a><a href="#contacto">Contacto</a></div>
        </details>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-media" aria-hidden="true" /><div className="hero-shade" aria-hidden="true" />
        <div className="hero-content wrap">
          <p className="eyebrow"><span /> EMS PERFORMANCE STUDIO · HUELVA</p>
          <h1>Entrena todo tu cuerpo.<br /><em>Impulsa tu tiempo.</em></h1>
          <p className="hero-copy">Entrenamiento WB-EMS personalizado, activo y siempre supervisado. Un estímulo global en sesiones cortas, explicado sin mitos y con la evidencia por delante.</p>
          <div className="hero-actions">
            <a className="button primary" href="#contacto">Solicitar valoración <ArrowRight size={19} /></a>
            <a className="button ghost" href="#evidencia">Ver qué dice la ciencia</a>
          </div>
          <div className="hero-points" aria-label="Características principales">
            <span><UserRoundCheck size={18} /> Supervisión cercana</span><span><TimerReset size={18} /> Sesiones progresivas</span><span><ShieldCheck size={18} /> Valoración previa</span>
          </div>
        </div>
      </section>

      <section className="intro wrap" id="que-es">
        <div className="section-kicker"><Bolt size={18} /> ENTENDER LA EMS</div>
        <div className="intro-grid">
          <div><h2>Tu movimiento.<br /><span>Nuestro impulso.</span></h2></div>
          <div className="intro-copy">
            <p>La electroestimulación de cuerpo completo —WB-EMS— aplica impulsos eléctricos controlados a varios grupos musculares mientras realizas ejercicios voluntarios.</p>
            <p>El chaleco no entrena por ti: la combinación de movimiento, intensidad individualizada, progresión y acompañamiento profesional es lo que convierte la sesión en entrenamiento.</p>
          </div>
        </div>
        <div className="process" aria-label="Cómo es una sesión">
          <div><span>01</span><strong>Valoramos</strong><p>Objetivos, experiencia y posibles contraindicaciones.</p></div>
          <div><span>02</span><strong>Ajustamos</strong><p>El chaleco y la intensidad de cada zona muscular.</p></div>
          <div><span>03</span><strong>Entrenamos</strong><p>Movimientos activos con corrección y feedback continuo.</p></div>
          <div><span>04</span><strong>Progresamos</strong><p>Sin prisas: el cuerpo necesita una fase de adaptación.</p></div>
        </div>
      </section>

      <section className="science" id="evidencia">
        <div className="wrap">
          <div className="section-heading">
            <div><div className="section-kicker"><BadgeCheck size={18} /> LO QUE SÍ RESPALDA LA CIENCIA</div><h2>Beneficios reales.<br /><span>Promesas honestas.</span></h2></div>
            <p>La WB-EMS puede ser eficaz y eficiente, sobre todo si la alternativa real es no hacer fuerza. La literatura todavía es menor y más heterogénea que la del entrenamiento convencional.</p>
          </div>
          <div className="evidence-grid">
            {evidence.map(({ icon: Icon, title, text }) => <article className="evidence-card" key={title}><Icon size={27} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
          <div className="time-fact">
            <div className="time-number"><span>20</span><small>minutos</small></div>
            <div><p className="eyebrow">¿EQUIVALE A DOS HORAS DE GIMNASIO?</p><h3>Es una comparación prometedora, no una ley universal.</h3><p>Un estudio de 2025 en solo 20 mujeres jóvenes sedentarias observó mejoras similares en tres pruebas tras 10 semanas con 20 min/semana de WB-EMS frente a 2 ± 1 sesiones convencionales de 60–90 min. Pero no fue aleatorizado, las participantes eligieron grupo y no permite afirmar que 20 minutos sustituyan cualquier entrenamiento.</p></div>
            <Clock3 className="time-icon" size={56} />
          </div>
          <div className="truth-grid">
            <div><Check size={20} /><p><strong>Sí:</strong> concentra trabajo de varios grupos musculares y puede ahorrar tiempo.</p></div>
            <div><X size={20} /><p><strong>No:</strong> no replica todas las adaptaciones del cardio, la técnica deportiva o las cargas específicas.</p></div>
            <div><Check size={20} /><p><strong>Sí:</strong> puede complementar tu rutina o ser una puerta de entrada al entrenamiento.</p></div>
            <div><X size={20} /><p><strong>No:</strong> no adelgaza por sí sola ni compensa hábitos inactivos fuera de la sesión.</p></div>
          </div>
        </div>
      </section>

      <section className="profiles wrap" id="para-quien">
        <div className="section-heading compact">
          <div><div className="section-kicker"><Sparkles size={18} /> UNA HERRAMIENTA, DISTINTOS PUNTOS DE PARTIDA</div><h2>¿Cuándo puede<br /><span>encajarte mejor?</span></h2></div>
          <p>No existe un perfil único. La sesión cambia según tu nivel y lo que ya haces durante la semana.</p>
        </div>
        <div className="profile-list">{profiles.map((profile) => <article key={profile.number}><span>{profile.number}</span><h3>{profile.title}</h3><p>{profile.text}</p><ArrowRight size={20} /></article>)}</div>
      </section>

      <section className="safety" id="seguridad">
        <div className="wrap safety-grid">
          <div>
            <div className="section-kicker"><ShieldCheck size={18} /> SEGURIDAD ANTES QUE INTENSIDAD</div>
            <h2>Sentir más no siempre<br /><span>significa entrenar mejor.</span></h2>
            <p>Las guías internacionales desaconsejan la WB-EMS sin supervisión. En principiantes, la intensidad y el volumen deben subir poco a poco durante 8–10 semanas; al inicio no se debe llegar al agotamiento.</p>
            <a className="button primary" href="#contacto">Hacer valoración previa <ArrowRight size={19} /></a>
          </div>
          <div className="safety-panel">
            <h3>Antes de tu primera sesión</h3>
            <ul>
              <li><Check size={18} /> Revisamos antecedentes, medicación, lesiones y cirugías recientes.</li>
              <li><Check size={18} /> Si hay una contraindicación relativa, pedimos autorización médica.</li>
              <li><Check size={18} /> Evitamos entrenar con fiebre, enfermedad aguda, deshidratación o tras consumir alcohol/drogas.</li>
              <li><Check size={18} /> Dispositivos electrónicos implantados, embarazo y ciertas enfermedades requieren especial precaución o exclusión.</li>
            </ul>
            <p className="notice">Esta web informa; no sustituye una valoración sanitaria individual.</p>
          </div>
        </div>
      </section>

      <section className="contact wrap" id="contacto">
        <div className="contact-card">
          <div className="contact-copy">
            <div className="section-kicker"><Mail size={18} /> CONTACTO</div>
            <h2>¿Te gustaría<br /><span>probar una sesión?</span></h2>
            <p>Estamos preparando un formulario de valoración online para conocer tu experiencia, objetivos y antecedentes antes de contactar contigo.</p>
            <div className="pending"><Bolt size={18} /><span><strong>Siguiente paso</strong> Añadiremos aquí tus preguntas y el correo receptor cuando nos los facilites.</span></div>
          </div>
          <form className="preview-form" aria-label="Vista previa del futuro formulario">
            <label>Nombre y apellidos<input type="text" placeholder="Tu nombre" disabled /></label>
            <div className="form-row"><label>Teléfono<input type="tel" placeholder="600 000 000" disabled /></label><label>Objetivo<select disabled defaultValue=""><option value="" disabled>Selecciona</option></select></label></div>
            <label>Cuéntanos brevemente<textarea placeholder="¿Qué buscas con el entrenamiento EMS?" disabled /></label>
            <button type="button" disabled>Formulario disponible próximamente <ArrowRight size={18} /></button>
            <small>No se envía ni almacena información en esta versión.</small>
          </form>
        </div>
      </section>

      <section className="sources wrap" aria-labelledby="fuentes-title">
        <div><p className="eyebrow">TRANSPARENCIA</p><h2 id="fuentes-title">Fuentes principales</h2></div>
        <ol>
          <li><a href="https://doi.org/10.3389/fphys.2023.1174103" target="_blank" rel="noreferrer">Guía internacional de seguridad y aplicación WB-EMS (2023)</a></li>
          <li><a href="https://doi.org/10.3389/fphys.2018.00573" target="_blank" rel="noreferrer">Revisión sistemática en adultos no deportistas</a></li>
          <li><a href="https://doi.org/10.3390/jfmk10030243" target="_blank" rel="noreferrer">WB-EMS frente a entrenamiento de fuerza: estudio comparativo (2025)</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/27034699/" target="_blank" rel="noreferrer">WB-EMS frente a entrenamiento HIT en hombres de mediana edad</a></li>
        </ol>
      </section>

      <footer><div className="wrap footer-inner"><a className="brand" href="#inicio"><span>IMPULSA<span>FIT</span></span></a><p>EMS Performance Studio · Huelva</p><a href="https://www.instagram.com/impulsafit_huelva/" target="_blank" rel="noreferrer" aria-label="Instagram de IMPULSA FIT"><AtSign size={20} /> @impulsafit_huelva</a></div></footer>
    </main>
  );
}
