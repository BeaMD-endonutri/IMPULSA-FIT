"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, CalendarClock, Check, ChevronRight, CircleUserRound, KeyRound, LayoutDashboard, LogOut, Minus, PackagePlus, Pencil, Plus, Search, ShieldCheck, Star, TicketCheck, Trash2, UserPlus, UsersRound } from "lucide-react";
import { PrivateLogin } from "@/components/private-login";

type ClientSummary = { id: number; first_name: string; last_name: string; email: string; phone?: string | null; notes?: string | null; status: string; created_at: number; bonus_count: number; remaining_sessions: number; next_expiry?: number | null };
type Bonus = { id: number; name: string; initial_sessions: number; remaining_sessions: number; expires_at?: number | null; status: string; created_at: number };
type Movement = { id: number; bonus_id: number; bonus_name: string; delta: number; reason: string; created_at: number; professional_name?: string };
type ClientDetail = { client: ClientSummary; bonuses: Bonus[]; movements: Movement[] };
type Review = { id: number; first_name: string; last_name: string; rating: number; comment: string; created_at: number };
type Tab = "overview" | "clients" | "reviews";

const formatDate = (value?: number | null) => value ? new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "Sin caducidad";

export function ProfessionalPortal() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selected, setSelected] = useState<ClientDetail | null>(null);
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (window.location.hostname.endsWith("github.io")) { window.location.replace("https://impulsa-fit-huelva.bea-md.chatgpt.site/profesional"); return; }
    fetch("/api/privado/sesion", { cache: "no-store" }).then(async (response) => {
      const data = await response.json() as { authenticated?: boolean; role?: string; name?: string; mustChangePassword?: boolean };
      if (response.ok && data.authenticated && data.role === "professional") {
        setAuthenticated(true); setName(data.name || "Profesional"); setMustChangePassword(Boolean(data.mustChangePassword));
      }
    }).catch(() => undefined).finally(() => setChecking(false));
  }, []);

  useEffect(() => { if (authenticated) void loadAll(); }, [authenticated]);

  async function loadAll() {
    const [clientsResponse, reviewsResponse] = await Promise.all([fetch("/api/profesional/clientes", { cache: "no-store" }), fetch("/api/profesional/resenas", { cache: "no-store" })]);
    if (clientsResponse.status === 401) { setAuthenticated(false); return; }
    const clientsData = await clientsResponse.json() as { clients?: ClientSummary[] };
    const reviewsData = await reviewsResponse.json() as { reviews?: Review[] };
    setClients(clientsData.clients ?? []); setReviews(reviewsData.reviews ?? []);
  }

  async function openClient(id: number) {
    setBusy(true); setNotice("");
    const response = await fetch(`/api/profesional/clientes/${id}`, { cache: "no-store" });
    const data = await response.json() as ClientDetail & { error?: string };
    if (response.ok) { setSelected(data); setTab("clients"); } else setNotice(data.error || "No se ha podido abrir la ficha.");
    setBusy(false);
  }

  async function createClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice("");
    const form = event.currentTarget; const data = new FormData(form);
    const response = await fetch("/api/profesional/clientes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
    const body = await response.json() as { client?: ClientSummary; temporaryPassword?: string; error?: string };
    if (response.ok && body.client && body.temporaryPassword) {
      setCredentials({ email: body.client.email, password: body.temporaryPassword }); form.reset(); setShowCreate(false); await loadAll(); await openClient(body.client.id);
    } else setNotice(body.error || "No se ha podido crear el cliente.");
    setBusy(false);
  }

  async function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selected) return; setBusy(true); setNotice("");
    const data = new FormData(event.currentTarget);
    const response = await fetch(`/api/profesional/clientes/${selected.client.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
    const body = await response.json() as { error?: string };
    if (response.ok) { setNotice("Ficha actualizada correctamente."); await loadAll(); await openClient(selected.client.id); } else setNotice(body.error || "No se ha podido guardar.");
    setBusy(false);
  }

  async function createBonus(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selected) return; setBusy(true); setNotice("");
    const form = event.currentTarget; const data = new FormData(form);
    const response = await fetch(`/api/profesional/clientes/${selected.client.id}/bonos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(data)) });
    const body = await response.json() as { error?: string };
    if (response.ok) { form.reset(); setNotice("Bono añadido a la ficha."); await loadAll(); await openClient(selected.client.id); } else setNotice(body.error || "No se ha podido añadir el bono.");
    setBusy(false);
  }

  async function addMovement(bonusId: number, delta: number, reason: string) {
    if (!selected) return; setBusy(true); setNotice("");
    const response = await fetch(`/api/profesional/bonos/${bonusId}/movimientos`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ delta, reason }) });
    const body = await response.json() as { error?: string };
    if (response.ok) { setNotice(delta < 0 ? "Sesión descontada y registrada." : "Sesión añadida y registrada."); await loadAll(); await openClient(selected.client.id); } else setNotice(body.error || "No se ha podido registrar el movimiento.");
    setBusy(false);
  }

  async function customMovement(event: FormEvent<HTMLFormElement>, bonusId: number) {
    event.preventDefault(); const form = event.currentTarget; const data = new FormData(form);
    await addMovement(bonusId, Number(data.get("delta")), String(data.get("reason"))); form.reset();
  }

  async function resetClientPassword() {
    if (!selected) return; setBusy(true);
    const response = await fetch(`/api/profesional/clientes/${selected.client.id}/restablecer-clave`, { method: "POST" });
    const body = await response.json() as { temporaryPassword?: string; error?: string };
    if (response.ok && body.temporaryPassword) setCredentials({ email: selected.client.email, password: body.temporaryPassword }); else setNotice(body.error || "No se ha podido restablecer la contraseña.");
    setBusy(false);
  }

  async function deleteReview(id: number) {
    if (!window.confirm("¿Eliminar esta reseña de forma permanente?")) return;
    const response = await fetch(`/api/profesional/resenas/${id}`, { method: "DELETE" });
    if (response.ok) { setReviews((current) => current.filter((review) => review.id !== id)); setNotice("Reseña eliminada."); } else setNotice("No se ha podido eliminar la reseña.");
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); const form = event.currentTarget; const data = new FormData(form);
    const response = await fetch("/api/privado/contrasena", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "professional", currentPassword: data.get("currentPassword"), newPassword: data.get("newPassword") }) });
    const body = await response.json() as { error?: string };
    if (response.ok) { setMustChangePassword(false); form.reset(); setNotice("Contraseña profesional actualizada."); } else setNotice(body.error || "No se ha podido cambiar la contraseña."); setBusy(false);
  }

  async function logout() { await fetch("/api/privado/logout", { method: "POST" }); setAuthenticated(false); setSelected(null); }

  const filteredClients = useMemo(() => { const query = search.toLowerCase(); return clients.filter((client) => `${client.first_name} ${client.last_name} ${client.email} ${client.phone ?? ""}`.toLowerCase().includes(query)); }, [clients, search]);
  const stats = useMemo(() => ({ active: clients.filter((client) => client.status === "active").length, sessions: clients.reduce((sum, client) => sum + Number(client.remaining_sessions || 0), 0), low: clients.filter((client) => Number(client.remaining_sessions) > 0 && Number(client.remaining_sessions) <= 2).length, expiring: clients.filter((client) => client.next_expiry && client.next_expiry < Date.now() + 30 * 86400000).length }), [clients]);

  if (checking) return <main className="private-loading"><img src="/logo-impulsa-fit.png" alt="IMPULSA FIT" /><span>Cargando acceso seguro…</span></main>;
  if (!authenticated) return <PrivateLogin role="professional" onSuccess={(data) => { setAuthenticated(true); setName(data.name); setMustChangePassword(data.mustChangePassword); }} />;

  return <main className="private-app">
    <header className="private-topbar"><Link href="/"><ArrowLeft size={18} /> Web pública</Link><img src="/logo-impulsa-fit.png" alt="IMPULSA FIT" /><div><span><ShieldCheck size={17} /> {name}</span><button onClick={logout}><LogOut size={17} /> Salir</button></div></header>
    <div className="private-shell">
      <aside className="private-sidebar"><p>GESTIÓN</p><button className={tab === "overview" ? "active" : ""} onClick={() => { setTab("overview"); setSelected(null); }}><LayoutDashboard size={19} /> Resumen</button><button className={tab === "clients" ? "active" : ""} onClick={() => setTab("clients")}><UsersRound size={19} /> Clientes <b>{clients.length}</b></button><button className={tab === "reviews" ? "active" : ""} onClick={() => { setTab("reviews"); setSelected(null); }}><Star size={19} /> Reseñas <b>{reviews.length}</b></button><div className="private-sidebar-note"><TicketCheck size={21} /><strong>Tarifas pendientes</strong><span>Podrás incorporarlas después sin modificar las fichas ni el historial.</span></div></aside>
      <section className="private-content">
        {notice && <div className="private-notice"><Check size={18} /> {notice}<button onClick={() => setNotice("")}>×</button></div>}
        {mustChangePassword && <section className="password-change-panel"><div><KeyRound size={25} /><div><strong>Protege tu cuenta</strong><p>Cambia la contraseña temporal antes de comenzar a gestionar clientes.</p></div></div><form onSubmit={changePassword}><input name="currentPassword" type="password" placeholder="Contraseña temporal" required /><input name="newPassword" type="password" placeholder="Nueva contraseña (mín. 10 caracteres)" minLength={10} required /><button disabled={busy}>Cambiar contraseña</button></form></section>}
        {credentials && <section className="credentials-panel"><div><KeyRound size={23} /><div><strong>Credenciales temporales del cliente</strong><p>Guárdalas y entrégaselas de forma privada. Esta contraseña solo se muestra ahora.</p></div></div><dl><div><dt>Usuario</dt><dd>{credentials.email}</dd></div><div><dt>Contraseña</dt><dd>{credentials.password}</dd></div></dl><button onClick={() => navigator.clipboard.writeText(`Usuario: ${credentials.email}\nContraseña temporal: ${credentials.password}`)}>Copiar credenciales</button><button className="subtle" onClick={() => setCredentials(null)}>Cerrar</button></section>}

        {tab === "overview" && <><div className="private-heading"><div><p>ÁREA PROFESIONAL</p><h1>Todo tu estudio,<br /><span>de un vistazo.</span></h1></div><button className="private-primary-button compact" onClick={() => { setTab("clients"); setShowCreate(true); }}><UserPlus size={18} /> Nuevo cliente</button></div><div className="dashboard-stats"><article><UsersRound /><span>Clientes activos</span><strong>{stats.active}</strong></article><article><TicketCheck /><span>Sesiones disponibles</span><strong>{stats.sessions}</strong></article><article><AlertTriangle /><span>Con 1–2 sesiones</span><strong>{stats.low}</strong></article><article><CalendarClock /><span>Caducan en 30 días</span><strong>{stats.expiring}</strong></article></div><section className="dashboard-panel"><div className="panel-title"><div><h2>Clientes recientes</h2><p>Accede rápidamente a cualquier ficha.</p></div><button onClick={() => setTab("clients")}>Ver todos <ChevronRight size={17} /></button></div><ClientTable clients={clients.slice(0, 6)} onOpen={openClient} /></section></>}

        {tab === "clients" && !selected && <><div className="private-heading"><div><p>BASE DE CLIENTES</p><h1>Fichas y bonos.</h1></div><button className="private-primary-button compact" onClick={() => setShowCreate((value) => !value)}><UserPlus size={18} /> Nuevo cliente</button></div>{showCreate && <form className="create-client-form" onSubmit={createClient}><h2>Crear ficha y acceso</h2><div className="private-form-grid"><label>Nombre<input name="firstName" required /></label><label>Apellidos<input name="lastName" required /></label><label>Correo electrónico<input name="email" type="email" required /></label><label>Teléfono<input name="phone" /></label><label className="wide">Notas internas<textarea name="notes" rows={3} placeholder="Objetivos, preferencias o información administrativa…" /></label></div><div className="form-actions"><button type="button" onClick={() => setShowCreate(false)}>Cancelar</button><button className="private-primary-button compact" disabled={busy}>Crear cliente y contraseña</button></div></form>}<div className="client-tools"><label><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, correo o teléfono" /></label><span>{filteredClients.length} clientes</span></div><section className="dashboard-panel"><ClientTable clients={filteredClients} onOpen={openClient} /></section></>}

        {tab === "clients" && selected && <ClientRecord detail={selected} busy={busy} onBack={() => setSelected(null)} onSave={saveClient} onCreateBonus={createBonus} onQuickMovement={addMovement} onCustomMovement={customMovement} onResetPassword={resetClientPassword} />}

        {tab === "reviews" && <><div className="private-heading"><div><p>MODERACIÓN</p><h1>Reseñas publicadas.</h1></div></div><p className="moderation-help">Elimina únicamente contenido falso, ofensivo, spam o datos personales. Una valoración negativa legítima puede aportar información útil para mejorar.</p><div className="moderation-grid">{reviews.length ? reviews.map((review) => <article key={review.id}><div><div className="review-admin-stars">{[1,2,3,4,5].map((star) => <Star key={star} size={16} fill={star <= review.rating ? "currentColor" : "none"} />)}</div><strong>{review.first_name} {review.last_name}</strong><small>{formatDate(review.created_at)}</small></div><p>“{review.comment}”</p><button onClick={() => deleteReview(review.id)}><Trash2 size={17} /> Eliminar reseña</button></article>) : <div className="private-empty">No hay reseñas publicadas.</div>}</div></>}
      </section>
    </div>
  </main>;
}

function ClientTable({ clients, onOpen }: { clients: ClientSummary[]; onOpen: (id: number) => void }) {
  return <div className="private-table-wrap"><table className="private-table"><thead><tr><th>Cliente</th><th>Contacto</th><th>Bonos</th><th>Sesiones</th><th>Próxima caducidad</th><th /></tr></thead><tbody>{clients.length ? clients.map((client) => <tr key={client.id}><td><div className="client-identity"><span>{client.first_name[0]}{client.last_name[0]}</span><div><strong>{client.first_name} {client.last_name}</strong><small className={client.status}>{client.status === "active" ? "Activo" : "Inactivo"}</small></div></div></td><td><strong>{client.email}</strong><small>{client.phone || "Sin teléfono"}</small></td><td>{client.bonus_count}</td><td><b className={Number(client.remaining_sessions) <= 2 ? "low-balance" : ""}>{client.remaining_sessions}</b></td><td>{formatDate(client.next_expiry)}</td><td><button aria-label={`Abrir ficha de ${client.first_name}`} onClick={() => onOpen(client.id)}><ChevronRight size={19} /></button></td></tr>) : <tr><td colSpan={6}><div className="private-empty">Todavía no hay clientes. Crea la primera ficha para comenzar.</div></td></tr>}</tbody></table></div>;
}

function ClientRecord({ detail, busy, onBack, onSave, onCreateBonus, onQuickMovement, onCustomMovement, onResetPassword }: { detail: ClientDetail; busy: boolean; onBack: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void; onCreateBonus: (event: FormEvent<HTMLFormElement>) => void; onQuickMovement: (id: number, delta: number, reason: string) => void; onCustomMovement: (event: FormEvent<HTMLFormElement>, id: number) => void; onResetPassword: () => void }) {
  const client = detail.client;
  return <><button className="record-back" onClick={onBack}><ArrowLeft size={17} /> Volver a clientes</button><div className="record-header"><div className="record-avatar"><CircleUserRound size={36} /></div><div><p>FICHA DE CLIENTE</p><h1>{client.first_name} {client.last_name}</h1><span className={`status-pill ${client.status}`}>{client.status === "active" ? "Cliente activo" : "Cliente inactivo"}</span></div><button onClick={onResetPassword}><KeyRound size={17} /> Nueva contraseña temporal</button></div><div className="record-layout"><div className="record-main"><section className="dashboard-panel"><div className="panel-title"><div><h2>Bonos y sesiones</h2><p>El saldo se calcula a partir del historial de movimientos.</p></div></div><div className="bonus-list">{detail.bonuses.length ? detail.bonuses.map((bonus) => <article className="bonus-card" key={bonus.id}><div className="bonus-card-top"><div><span>BONO ACTIVO</span><h3>{bonus.name}</h3><small>{formatDate(bonus.expires_at)}</small></div><div className="bonus-balance"><strong>{bonus.remaining_sessions}</strong><span>sesiones</span></div></div><div className="quick-movements"><button disabled={busy || bonus.remaining_sessions <= 0} onClick={() => onQuickMovement(bonus.id, -1, "Sesión realizada")}><Minus size={17} /> Consumir 1</button><button disabled={busy} onClick={() => onQuickMovement(bonus.id, 1, "Ajuste manual: sesión añadida")}><Plus size={17} /> Añadir 1</button></div><form className="custom-movement" onSubmit={(event) => onCustomMovement(event, bonus.id)}><input name="delta" type="number" placeholder="Ej. -2 o 3" required /><input name="reason" placeholder="Motivo del ajuste" minLength={3} required /><button disabled={busy}>Registrar</button></form></article>) : <div className="private-empty">Este cliente todavía no tiene bonos.</div>}</div></section><section className="dashboard-panel"><div className="panel-title"><div><h2>Historial de movimientos</h2><p>Registro completo de altas, consumos y ajustes.</p></div></div><div className="movement-list">{detail.movements.length ? detail.movements.map((movement) => <div key={movement.id}><span className={movement.delta > 0 ? "positive" : "negative"}>{movement.delta > 0 ? `+${movement.delta}` : movement.delta}</span><div><strong>{movement.bonus_name}</strong><p>{movement.reason}</p></div><small>{formatDate(movement.created_at)}</small></div>) : <div className="private-empty">Sin movimientos registrados.</div>}</div></section></div><aside className="record-side"><form className="record-form" onSubmit={onSave}><div className="panel-title"><div><h2>Datos de la ficha</h2><p>Información privada y administrativa.</p></div><Pencil size={18} /></div><label>Nombre<input name="firstName" defaultValue={client.first_name} required /></label><label>Apellidos<input name="lastName" defaultValue={client.last_name} required /></label><label>Correo<input name="email" type="email" defaultValue={client.email} required /></label><label>Teléfono<input name="phone" defaultValue={client.phone || ""} /></label><label>Estado<select name="status" defaultValue={client.status}><option value="active">Activo</option><option value="inactive">Inactivo</option></select></label><label>Notas internas<textarea name="notes" rows={5} defaultValue={client.notes || ""} /></label><button className="private-primary-button compact" disabled={busy}>Guardar ficha</button></form><form className="new-bonus-form" onSubmit={onCreateBonus}><div className="panel-title"><div><h2>Nuevo bono</h2><p>Las tarifas se añadirán más adelante.</p></div><PackagePlus size={20} /></div><label>Nombre del bono<input name="name" placeholder="Ej. Bono entrenamiento" required /></label><label>Número de sesiones<input name="sessions" type="number" min={1} max={500} required /></label><label>Fecha de caducidad<input name="expiresAt" type="date" /></label><button className="private-primary-button compact" disabled={busy}>Añadir bono</button></form></aside></div></>;
}
