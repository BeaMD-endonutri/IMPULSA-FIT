import {
  Activity, ArrowRight, BadgeCheck, Bolt, Check, Clock3, Dumbbell,
  AtSign, Camera, Clapperboard, ExternalLink, FileSignature, Globe2, Headphones, HeartPulse, LockKeyhole, Mail, MapPin, Menu, Phone, ShieldCheck, Sparkles,
  Shirt, TimerReset, UserRoundCheck, Wifi,
} from "lucide-react";
import { ReviewsSection } from "@/components/reviews-section";

const evidence = [
  { icon: Dumbbell, title: "Fuerza y función muscular", text: "La WB-EMS puede mejorar la fuerza, la potencia y la capacidad funcional cuando se integra en un programa constante, activo y bien supervisado." },
  { icon: Activity, title: "Masa muscular y composición corporal", text: "Combinada con ejercicio y hábitos saludables, puede ayudar a preservar o aumentar masa muscular y favorecer cambios en la composición corporal." },
  { icon: HeartPulse, title: "Menor carga externa", text: "Permite generar un estímulo muscular intenso con cargas externas moderadas, facilitando la adaptación del entrenamiento y reduciendo el estrés mecánico articular." },
  { icon: Clock3, title: "Trabajo global y eficiente", text: "Activa varios grupos musculares a la vez mientras te mueves, concentrando un entrenamiento de cuerpo completo en una sesión breve y planificada." },
];

const profiles = [
  { number: "01", title: "Si empiezas desde cero", text: "Una sesión guiada reduce la complejidad: aprendemos movimientos sencillos y graduamos el estímulo zona a zona." },
  { number: "02", title: "Si vas justo de tiempo", text: "En unos 40 minutos realizas una sesión completa, guiada y adaptada a tu nivel, aprovechando al máximo el tiempo disponible." },
  { number: "03", title: "Si ya entrenas", text: "Puede añadir una sesión complementaria para reforzar el estímulo muscular, trabajar puntos débiles y aportar variedad a tu planificación." },
  { number: "04", title: "Si necesitas adaptar cargas", text: "Permite ajustar la carga externa y la intensidad de cada zona muscular tras valorar tus antecedentes, limitaciones y objetivos." },
];

const studioGallery = [
  { image: "estudio-zona-1.webp", title: "Zona Wiemspro", text: "Equipamiento preparado para cada sesión" },
  { image: "estudio-zona-2.webp", title: "Espacio de entrenamiento", text: "Amplitud, privacidad y atención cercana" },
  { image: "estudio-zona-3.webp", title: "Tecnología integrada", text: "Control inalámbrico durante el ejercicio" },
  { image: "estudio-zona-4.webp", title: "Identidad IMPULSA FIT", text: "Un entorno diseñado para moverte" },
];

const facilityVideos = [
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/video-instalaciones-01.mp4", poster: "video-instalaciones-01-poster.webp", title: "Descubre el estudio", text: "Un recorrido dinámico por IMPULSA FIT" },
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/video-instalaciones-02.mp4", poster: "video-instalaciones-02-poster.webp", title: "Tu zona de entrenamiento", text: "Tecnología y movimiento en un espacio propio" },
];

const condesGallery = [
  { image: "https://condefitness.com/wp-content/uploads/2024/04/RE220809-02.webp", alt: "Exterior de Condes Wellness & Fitness en Huelva" },
  { image: "https://condefitness.com/wp-content/uploads/2024/02/gallery_01_05-240x300.webp", alt: "Instalaciones de Condes Wellness & Fitness" },
  { image: "https://condefitness.com/wp-content/uploads/2024/02/gallery_01_03-240x300.webp", alt: "Zona deportiva de Condes Wellness & Fitness" },
];

const clientVideos = [
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/cliente-01.mp4", poster: "cliente-01-poster.webp", title: "Fuerza en movimiento", text: "Entrenamiento activo con tecnología Wiemspro" },
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/cliente-02.mp4", poster: "cliente-02-poster.webp", title: "Progresión guiada", text: "Cada ejercicio se adapta al nivel de la persona" },
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/cliente-03.mp4", poster: "cliente-03-poster.webp", title: "Trabajo específico", text: "Estímulo muscular y movimiento en una misma sesión" },
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/cliente-04.mp4", poster: "cliente-04-poster.webp", title: "Energía IMPULSA FIT", text: "Acompañamiento cercano durante todo el entrenamiento" },
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/cliente-05.mp4", poster: "cliente-05-poster.webp", title: "Constancia y actitud", text: "Una sesión completa, activa y ajustada a cada objetivo" },
];

const wiemsproVideos = [
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/video-chaleco-arcoiris.mp4", poster: "video-chaleco-arcoiris-poster.webp", title: "Activa tu mejor versión", text: "Tecnología, precisión y diseño Wiemspro" },
  { video: "https://impulsa-fit-huelva.bea-md.chatgpt.site/video-chaleco.mp4", poster: "video-chaleco-poster.webp", title: "El impulso toma forma", text: "El traje que acompaña cada movimiento" },
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="IMPULSA FIT, inicio">
          <img className="brand-logo" src="logo-impulsa-fit-transparent.webp" alt="IMPULSA FIT · EMS Performance Studio" />
        </a>
        <nav aria-label="Navegación principal">
          <a href="#que-es">Tecnología Wiemspro</a><a href="#instalaciones">Instalaciones</a><a href="#donde-estamos">Dónde estamos</a><a href="#clientes">Nuestros clientes</a><a href="#resenas">Reseñas</a>
        </nav>
        <div className="header-private-access" aria-label="Accesos privados">
          <a href="cliente"><LockKeyhole size={15} /> Área clientes</a>
          <a href="profesional"><ShieldCheck size={15} /> Área profesional</a>
        </div>
        <a className="header-cta" href="#contacto">Quiero probarlo <ArrowRight size={17} /></a>
        <details className="mobile-menu">
          <summary aria-label="Abrir menú"><Menu size={24} /></summary>
          <div className="mobile-menu-panel"><div className="mobile-private-access"><a href="cliente"><LockKeyhole size={17} /> Área clientes</a><a href="profesional"><ShieldCheck size={17} /> Área profesional</a></div><div className="mobile-public-links"><a href="#que-es">Tecnología Wiemspro</a><a href="#para-quien">Para quién</a><a href="#instalaciones">Instalaciones</a><a href="#donde-estamos">Dónde estamos</a><a href="#clientes">Nuestros clientes</a><a href="#seguridad">Seguridad</a><a href="#resenas">Reseñas</a><a href="#contacto">Contacto</a></div></div>
        </details>
      </header>

      <section className="brand-opener" aria-label="Presentación de IMPULSA FIT">
        <div className="brand-opener-aura" aria-hidden="true" />
        <video className="brand-opener-video" autoPlay muted loop playsInline preload="metadata" poster="video-logo-poster.webp" aria-label="Animación del logo de IMPULSA FIT">
          <source src="https://impulsa-fit-huelva.bea-md.chatgpt.site/video-logo.mp4" type="video/mp4" />
        </video>
        <div className="brand-opener-fade" aria-hidden="true" />
        <a className="brand-opener-scroll" href="#inicio"><span>Descubre IMPULSA FIT</span><ArrowRight size={18} /></a>
      </section>

      <section className="hero" id="inicio">
        <div className="hero-media" style={{ backgroundImage: "url('hero-ems-power.webp')" }} aria-hidden="true" /><div className="hero-shade" aria-hidden="true" /><div className="hero-grid" aria-hidden="true" />
        <div className="hero-content wrap">
          <p className="eyebrow"><span /> EMS PERFORMANCE STUDIO · HUELVA</p>
          <h1>Entrena todo tu cuerpo.<br /><em>Impulsa tu tiempo.</em></h1>
          <p className="hero-copy">Entrenamiento WB-EMS personalizado, activo y siempre supervisado. Una sesión completa de unos 40 minutos para trabajar todo el cuerpo de forma eficiente.</p>
          <div className="hero-actions">
            <a className="button primary" href="#contacto">Solicitar valoración <ArrowRight size={19} /></a>
            <a className="button ghost" href="#que-es">Conocer la tecnología</a>
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
            <figure className="power-image power-image-main"><img src="ems-setup.webp" alt="Entrenadora ajustando el traje Wiemspro Revolution Pro antes del entrenamiento" /><figcaption><span>01</span> Ajuste Wiemspro</figcaption></figure>
            <figure className="power-image power-image-float"><img src="ems-training.webp" alt="Mujer entrenando con chaleco EMS bajo supervisión profesional" /><figcaption><span>02</span> Movimiento activo</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="technology-combined" id="que-es">
        <div className="wrap">
          <div className="section-kicker"><Wifi size={18} /> TECNOLOGÍA WIEMSPRO · WB-EMS INALÁMBRICA</div>
          <div className="intro-grid">
            <div><h2>Tu movimiento.<br /><span>Nuestro impulso.</span></h2></div>
            <div className="intro-copy">
              <p>La electroestimulación de cuerpo completo —WB-EMS— aplica impulsos eléctricos controlados a varios grupos musculares mientras realizas ejercicios voluntarios.</p>
              <p>El chaleco no entrena por ti: el resultado depende del movimiento, la intensidad individualizada, una progresión adecuada y la supervisión profesional.</p>
            </div>
          </div>

          <div className="wiemspro-feature">
            <div className="wiemspro-copy">
              <p className="eyebrow">SISTEMA WIEMSFIT</p>
              <h3>Precisión muscular.<br /><span>Libertad para moverte.</span></h3>
              <p>En IMPULSA FIT trabajamos con <strong>Wiemspro</strong>, un sistema profesional de electroestimulación inalámbrica. Su traje Revolution Pro incorpora diez pares de electrodos colocados estratégicamente para trabajar hasta diez grupos musculares de forma simultánea.</p>
              <p>Desde la tablet, el profesional adapta el impulso de cada zona a tu sensibilidad y objetivo. El diseño ergonómico, las correas regulables y los tejidos flexibles mantienen los electrodos en contacto mientras haces sentadillas, zancadas, empujes, tracciones y otros ejercicios activos sin depender de cables.</p>
              <div className="wiemspro-points">
                <span><Wifi size={18} /><b>Wireless</b> Movimiento sin cables</span>
                <span><Activity size={18} /><b>10 zonas</b> Intensidad individualizada</span>
                <span><ShieldCheck size={18} /><b>Ergonómico</b> Ajuste estable y cómodo</span>
              </div>
              <div className="clothing-note">
                <Shirt size={27} />
                <div><strong>Ropa técnica para empezar</strong><p>Al contratar tu primer bono, el personal de IMPULSA FIT te proporcionará la ropa técnica necesaria para comenzar: una <b>camiseta negra ceñida de manga corta o media manga</b> y unas <b>mallas negras largas y ajustadas</b>. Después deberás adquirir tu propio conjunto para las siguientes sesiones. Estas prendas son transpirables y no llevan cremalleras, botones ni elementos metálicos bajo el traje, favoreciendo el contacto uniforme, la libertad de movimiento y la higiene.</p></div>
              </div>
            </div>
            <figure className="wiemspro-visual"><img src="tecnologia-wiemspro.webp" alt="Traje profesional Wiemspro y sus principales características" loading="lazy" /><figcaption>Tecnología Wiemspro utilizada en IMPULSA FIT</figcaption></figure>
          </div>

          <div className="wiemspro-video-showcase">
            <div className="wiemspro-video-intro"><p className="eyebrow">WIEMSPRO EN ACCIÓN</p><h3>Conoce el equipo.<br /><span>Descubre el impulso.</span></h3><p>Dos miradas al sistema con el que personalizamos cada sesión en IMPULSA FIT.</p></div>
            <div className="wiemspro-video-grid">
              {wiemsproVideos.map((item, index) => (
                <figure className="wiemspro-video-card" key={item.video}>
                  <video controls playsInline preload="metadata" poster={item.poster} aria-label={item.title}>
                    <source src={item.video} type="video/mp4" />
                    Tu navegador no puede reproducir este vídeo.
                  </video>
                  <figcaption><span>0{index + 1}</span><div><strong>{item.title}</strong><small>{item.text}</small></div></figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="process" aria-label="Cómo es una sesión">
            <div><span>01</span><strong>Valoramos</strong><p>Objetivos, experiencia y posibles contraindicaciones.</p></div>
            <div><span>02</span><strong>Ajustamos</strong><p>El traje Wiemspro y la intensidad de cada zona.</p></div>
            <div><span>03</span><strong>Entrenamos</strong><p>Movimientos activos con corrección y feedback continuo.</p></div>
            <div><span>04</span><strong>Progresamos</strong><p>Sin prisas: el cuerpo necesita una fase de adaptación.</p></div>
          </div>

          <div className="benefits-block" id="beneficios">
          <div className="section-heading">
            <div><div className="section-kicker"><BadgeCheck size={18} /> BENEFICIOS CON RESPALDO CIENTÍFICO</div><h2>Más estímulo.<br /><span>Tiempo bien aprovechado.</span></h2></div>
            <p>La WB-EMS combina contracciones voluntarias e impulsos individualizados. Puede ser una herramienta eficaz para ganar fuerza, mantener masa muscular y mejorar la función física, siempre dentro de un programa supervisado.</p>
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
            <div><Check size={20} /><p><strong>Eficiente:</strong> trabaja de forma simultánea piernas, glúteos, abdomen, espalda, pecho y brazos.</p></div>
            <div><Check size={20} /><p><strong>Personalizada:</strong> regulamos cada grupo muscular de forma independiente según tu percepción y tolerancia.</p></div>
            <div><Check size={20} /><p><strong>Versátil:</strong> puede servir para comenzar, complementar tu entrenamiento o reducir la carga externa.</p></div>
            <div><Check size={20} /><p><strong>Progresiva:</strong> la intensidad aumenta gradualmente; más impulso no significa automáticamente mejores resultados.</p></div>
          </div>
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
              <figure className={`facility-photo facility-photo-${index + 1}`} key={item.title}>
                <img src={item.image} alt={`${item.title} en IMPULSA FIT Huelva`} loading="lazy" />
                <span className="facility-glow" aria-hidden="true" />
                <figcaption className="facility-caption"><small>0{index + 1} · IMPULSA FIT HUELVA</small><strong>{item.title}</strong><em>{item.text}</em></figcaption>
              </figure>
            ))}
          </div>
          <div className="facility-video-section">
            <div className="facility-video-heading"><p className="eyebrow">EL ESTUDIO EN MOVIMIENTO</p><h3>Entra en<br /><span>IMPULSA FIT.</span></h3></div>
            <div className="facility-video-grid">
              {facilityVideos.map((item, index) => (
                <figure className="facility-video-card" key={item.video}>
                  <video controls playsInline preload="metadata" poster={item.poster} aria-label={item.title}>
                    <source src={item.video} type="video/mp4" />
                    Tu navegador no puede reproducir este vídeo.
                  </video>
                  <figcaption><span>0{index + 1}</span><div><strong>{item.title}</strong><small>{item.text}</small></div></figcaption>
                </figure>
              ))}
            </div>
          </div>
          <aside className="relaxation-feature">
            <div className="relaxation-icon"><Headphones size={34} /></div>
            <div><p className="eyebrow">EL ÚLTIMO IMPULSO ES PARAR</p><h3>Finalizamos con una fase de relajación.</h3><p>Al terminar el entrenamiento bajamos el ritmo y reservamos unos minutos para cerrar la sesión con calma. Incorporamos <strong>cascos con cancelación de ruido</strong> para favorecer un mayor bienestar, aislamiento del entorno y conexión con ese momento de recuperación.</p></div>
          </aside>
          <a className="instagram-link" href="https://www.instagram.com/impulsafit_huelva/" target="_blank" rel="noreferrer"><AtSign size={18} /> Ver más en Instagram <ArrowRight size={18} /></a>
        </div>
      </section>

      <section className="location-section" id="donde-estamos">
        <div className="wrap location-shell">
          <div className="location-copy">
            <div className="section-kicker"><MapPin size={18} /> DÓNDE NOS ENCONTRAMOS</div>
            <h2>Tu espacio EMS,<br /><span>en pleno Huelva.</span></h2>
            <p>IMPULSA FIT se encuentra dentro de <strong>Condes Wellness &amp; Fitness</strong>, un entorno deportivo amplio y cuidado en el que podrás realizar tus sesiones con comodidad.</p>
            <a className="location-address" href="https://www.google.com/maps/place//data=!4m2!3m1!1s0xd11d1d2443dd84d:0xc09dc2ca9aca6448?sa=X&ved=1t:8290&ictx=111" target="_blank" rel="noreferrer">
              <MapPin size={24} /><span><small>ABRIR EN GOOGLE MAPS</small>Av. Escultora Miss Whitney, 9<br />21003 Huelva</span><ExternalLink size={18} />
            </a>
            <div className="location-links">
              <a href="tel:+34601639931"><Phone size={19} /><span><small>TELÉFONO</small>601 63 99 31</span></a>
              <a href="https://condefitness.com/" target="_blank" rel="noreferrer"><Globe2 size={19} /><span><small>WEB</small>condefitness.com</span></a>
              <a href="https://www.instagram.com/condeswellness_fitness/" target="_blank" rel="noreferrer"><AtSign size={19} /><span><small>INSTAGRAM</small>@condeswellness_fitness</span></a>
            </div>
          </div>
          <div className="location-visuals">
            <div className="condes-brand-card"><span>ESTAMOS DENTRO DE</span><img src="https://condefitness.com/wp-content/uploads/2024/02/logo_white.webp" alt="Condes Wellness & Fitness" loading="lazy" referrerPolicy="no-referrer" /></div>
            <div className="condes-gallery">
              {condesGallery.map((item, index) => <figure key={item.image} className={`condes-photo condes-photo-${index + 1}`}><img src={item.image} alt={item.alt} loading="lazy" referrerPolicy="no-referrer" /></figure>)}
            </div>
            <a className="condes-credit" href="https://condefitness.com/" target="_blank" rel="noreferrer">Imágenes oficiales de Condes Wellness &amp; Fitness <ExternalLink size={14} /></a>
          </div>
        </div>
      </section>

      <section className="clients" id="clientes">
        <div className="wrap">
          <div className="section-heading compact clients-heading">
            <div><div className="section-kicker"><Clapperboard size={18} /> ENTRENAMIENTO REAL</div><h2>Nuestros<br /><span>clientes.</span></h2></div>
            <p>Personas reales, objetivos diferentes y una misma forma de entrenar: sesiones activas, personalizadas y acompañadas de principio a fin.</p>
          </div>
          <div className="client-video-grid" aria-label="Vídeos de clientes entrenando en IMPULSA FIT">
            {clientVideos.map((item, index) => (
              <figure className="client-video-card" key={item.video}>
                <div className="client-video-shell">
                  <video controls playsInline preload="metadata" poster={item.poster} aria-label={`${item.title} en IMPULSA FIT`}>
                    <source src={item.video} type="video/mp4" />
                    Tu navegador no puede reproducir este vídeo.
                  </video>
                  <span className="client-video-number">0{index + 1}</span>
                </div>
                <figcaption><strong>{item.title}</strong><span>{item.text}</span></figcaption>
              </figure>
            ))}
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
          <li><a href="https://wiemspro.com/en/electrostimulation-suit/" target="_blank" rel="noreferrer">Características y recomendaciones del traje Wiemspro</a></li>
        </ol>
      </section>

      <footer><div className="wrap footer-inner"><a className="brand footer-brand" href="#inicio"><img className="brand-logo" src="logo-impulsa-fit-transparent.webp" alt="IMPULSA FIT" /></a><p>EMS Performance Studio · Huelva</p><div className="footer-private-links"><a href="cliente"><LockKeyhole size={17} /> Área clientes</a><a href="profesional"><ShieldCheck size={17} /> Área profesional</a></div><a href="https://www.instagram.com/impulsafit_huelva/" target="_blank" rel="noreferrer" aria-label="Instagram de IMPULSA FIT"><AtSign size={20} /> @impulsafit_huelva</a></div></footer>
    </main>
  );
}
