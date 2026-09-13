import {
  Activity, ArrowRight, BadgeCheck, Bolt, Check, Clock3, Dumbbell,
  AtSign, Camera, FileSignature, HeartPulse, Mail, Menu, ShieldCheck, Sparkles,
  TimerReset, UserRoundCheck,
} from "lucide-react";
import { ReviewsSection } from "@/components/reviews-section";

const evidence = [
  { icon: Dumbbell, title: "Fuerza y función muscular", text: "La WB-EMS activa simultáneamente grandes grupos musculares y puede favorecer mejoras de fuerza, rendimiento funcional y calidad muscular con una programación constante." },
  { icon: Activity, title: "Masa muscular y composición corporal", text: "Combinada con ejercicio activo y hábitos saludables, puede contribuir a mejorar la masa muscular y la composición corporal, especialmente al comenzar a entrenar." },
  { icon: HeartPulse, title: "Estímulo global con menor carga externa", text: "Permite trabajar intensamente la musculatura utilizando cargas externas moderadas, una ventaja para personalizar el entrenamiento y reducir el impacto articular." },
];

const profiles = [
  { number: "01", title: "Si empiezas desde cero", text: "Una sesión guiada reduce la complejidad: aprendemos movimientos sencillos y graduamos el estímulo zona a zona." },
  { number: "02", title: "Si vas justo de tiempo", text: "En unos 40 minutos realizas una sesión completa, guiada y adaptada a tu nivel, aprovechando al máximo el tiempo disponible." },
  { number: "03", title: "Si ya entrenas", text: "Puede añadir una sesión complementaria para reforzar el estímulo muscular, trabajar puntos débiles y aportar variedad a tu planificación." },
  { number: "04", title: "Si necesitas adaptar cargas", text: "Permite ajustar la carga externa y la intensidad de cada zona muscular tras valorar tus antecedentes, limitaciones y objetivos." },
];

const studioGallery = [
  { image: "instagram/impulsa-01.webp", title: "Estamos en Huelva", text: "Alameda Sundheim, 14", href: "https://www.instagram.com/p/DThr8GEjKSe/" },
  { image: "instagram/impulsa-02.webp", title: "EMS Performance Studio", text: "Un espacio con identidad propia", href: "https://www.instagram.com/p/DcgwOpgEewv/" },
  { image: "instagram/impulsa-03.webp", title: "Activación global", text: "Hasta 300 músculos a la vez", href: "https://www.instagram.com/p/DaOJMmGAs95/?img_index=3" },
  { image: "instagram/impulsa-04.webp", title: "Tecnología EMS", text: "Fitness inteligente en Huelva", href: "https://www.instagram.com/p/DZnhR0tiK7r/" },
  { image: "instagram/impulsa-05.webp", title: "Entrenamiento personalizado", text: "Cada sesión, adaptada a ti", href: "https://www.instagram.com/p/DZE9ozkCvUV/" },
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
          <a href="#que-es">Qué es</a><a href="#beneficios">Beneficios</a><a href="#para-quien">Para quién</a><a href="#instalaciones">Instalaciones</a><a href="#resenas">Reseñas</a>
        </nav>
        <a className="header-cta" href="#contacto">Quiero probarlo <ArrowRight size={17} /></a>
        <details className="mobile-menu">
          <summary aria-label="Abrir menú"><Menu size={24} /></summary>
          <div><a href="#que-es">Qué es</a><a href="#beneficios">Beneficios</a><a href="#para-quien">Para quién</a><a href="#instalaciones">Instalaciones</a><a href="#seguridad">Seguridad</a><a href="#resenas">Reseñas</a><a href="#contacto">Contacto</a></div>
        </details>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-media" style={{ backgroundImage: "url('hero-ems-power.webp')" }} aria-hidden="true" /><div className="hero-shade" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" />
        <div className="hero-content wrap">
          <p className="eyebrow"><span /> EMS PERFORMANCE STUDIO · HUELVA</p>
          <h1>Entrena todo tu cuerpo.<br /><em>Impulsa tu tiempo.</em></h1>
          <p className="hero-copy">Entrenamiento WB-EMS personalizado, activo y siempre supervisado. Una sesión completa de unos 40 minutos para trabajar todo el cuerpo de forma eficiente.</p>
          <div className="hero-actions">
            <a className="button primary" href="#contacto">Solicitar valoración <ArrowRight size={19} /></a>
            <a className="button ghost" href="#beneficios">Descubrir los beneficios</a>
          </div>
          <div className="hero-points" aria-label="Características principales">
            <span><UserRoundCheck size={18} /> Supervisión cercana</span><span><TimerReset size={18} /> Unos 40 minutos</span><span><ShieldCheck size={18} /> Valoración previa</span>
          </div>
        </div>
      </section>

      <section className="power-showcase" aria-label="Entrenamiento EMS supervisado">
        <div className="wrap power-showcase-grid">
          <div className="power-copy">
            <div className="section-kicker"><Bolt size={18} /> UNA EXPERIENCIA DIFERENTE</div>
            <h2>Tecnología que se adapta.<br /><span>Entrenamiento que se siente.</span></h2>
            <p>Antes de empezar ajustamos el chaleco y cada grupo muscular. Durante la sesión, el monitor guía el movimiento, regula la intensidad y te acompaña en cada repetición.</p>
            <div className="power-stat"><strong>100%</strong><span>guiado, personalizado<br />y en movimiento</span></div>
          </div>
          <div className="power-images">
            <figure className="power-image power-image-main"><img src="ems-setup.webp" alt="Monitor ajustando un chaleco EMS antes del entrenamiento" /><figcaption><span>01</span> Ajuste profesional</figcaption></figure>
            <figure className="power-image power-image-float"><img src="ems-training.webp" alt="Mujer entrenando con chaleco EMS bajo supervisión profesional" /><figcaption><span>02</span> Movimiento activo</figcaption></figure>
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

      <section className="science" id="beneficios">
        <div className="wrap">
          <div className="section-heading">
            <div><div className="section-kicker"><BadgeCheck size={18} /> BENEFICIOS CON RESPALDO CIENTÍFICO</div><h2>Más estímulo.<br /><span>Tiempo bien aprovechado.</span></h2></div>
            <p>La WB-EMS combina contracciones voluntarias con impulsos individualizados para activar varios grupos musculares a la vez. El resultado es un entrenamiento global, intenso y adaptable.</p>
          </div>
          <div className="evidence-grid">
            {evidence.map(({ icon: Icon, title, text }) => <article className="evidence-card" key={title}><Icon size={27} /><h3>{title}</h3><p>{text}</p></article>)}
          </div>
          <div className="time-fact">
            <div className="time-number"><span>40</span><small>minutos</small></div>
            <div><p className="eyebrow">ENTRENAMIENTO COMPLETO Y EFICIENTE</p><h3>Aprovecha cada minuto de la sesión.</h3><p>En unos 40 minutos combinamos preparación, ajuste personalizado del chaleco y trabajo activo de cuerpo completo. La activación simultánea de distintos grupos musculares permite concentrar el estímulo y sacar mucho partido a cada sesión.</p></div>
            <Clock3 className="time-icon" size={56} />
          </div>
          <div className="truth-grid">
            <div><Check size={20} /><p><strong>Eficiente:</strong> trabaja varios grupos musculares de forma simultánea.</p></div>
            <div><Check size={20} /><p><strong>Personalizada:</strong> cada zona se ajusta a tu sensibilidad y nivel.</p></div>
            <div><Check size={20} /><p><strong>Versátil:</strong> encaja tanto al empezar como para complementar otra rutina.</p></div>
            <div><Check size={20} /><p><strong>Progresiva:</strong> el estímulo evoluciona contigo sesión a sesión.</p></div>
          </div>
        </div>
      </section>

      <section className="facilities" id="instalaciones">
        <div className="wrap">
          <div className="section-heading compact">
            <div><div className="section-kicker"><Camera size={18} /> CONOCE NUESTRO ESPACIO</div><h2>Nuestras<br /><span>instalaciones.</span></h2></div>
            <p>Un estudio diseñado para vivir la EMS de otra manera: tecnología, energía y atención personalizada en un mismo espacio.</p>
          </div>
          <div className="facility-gallery" aria-label="Galería de IMPULSA FIT">
            {studioGallery.map((item, index) => (
              <a className={`facility-photo facility-photo-${index + 1}`} href={item.href} target="_blank" rel="noreferrer" key={item.title} aria-label={`${item.title}. Ver publicación en Instagram`}>
                <img src={item.image} alt={`${item.title} en IMPULSA FIT Huelva`} loading="lazy" />
                <span className="facility-glow" aria-hidden="true" />
                <span className="facility-caption"><small>0{index + 1} · @impulsafit_huelva</small><strong>{item.title}</strong><em>{item.text}</em></span>
                <ArrowRight className="facility-arrow" size={22} />
              </a>
            ))}
          </div>
          <a className="instagram-link" href="https://www.instagram.com/impulsafit_huelva/" target="_blank" rel="noreferrer"><AtSign size={18} /> Ver más en Instagram <ArrowRight size={18} /></a>
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

      <ReviewsSection />

      <section className="contact wrap" id="contacto">
        <div className="contact-card">
          <div className="contact-copy">
            <div className="section-kicker"><Mail size={18} /> CONTACTO</div>
            <h2>¿Te gustaría<br /><span>probar una sesión <strong className="free-highlight">GRATIS?</strong></span></h2>
            <p>Completa online el formulario de valoración y el consentimiento informado, firma ambos desde el móvil y envíanos un único PDF con toda la información.</p>
            <div className="pending"><Bolt size={18} /><span><strong>Proceso sencillo</strong> Rellenas, revisas y firmas los dos documentos. Al finalizar, el PDF firmado llega directamente a nuestro equipo.</span></div>
          </div>
          <div className="preview-form contact-actions-panel" aria-label="Contacto y acceso al formulario online">
            <div className="whatsapp-qr">
              <div className="qr-frame"><img src="qr-whatsapp.jpeg" alt="Código QR para contactar con IMPULSA FIT por WhatsApp" /></div>
              <div><strong>Escríbenos por WhatsApp</strong><p>Escanea el QR con la cámara del móvil para abrir directamente la conversación.</p></div>
            </div>
            <a className="form-launch" href="formulario">Abrir formulario y firmar online <ArrowRight size={18} /></a>
            <a className="consent-download" href="documentos/Consentimiento_Informado_EMS.pdf" target="_blank" rel="noreferrer"><FileSignature size={17} /> Leer consentimiento informado (PDF)</a>
            <small>Envío seguro del PDF cumplimentado y firmado.</small>
          </div>
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
