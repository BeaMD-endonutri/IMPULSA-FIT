"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarClock, CalendarDays, Check, History, KeyRound, LogOut, TicketCheck, UserRound } from "lucide-react";
import { PrivateLogin } from "@/components/private-login";

type ClientData = { client: { first_name: string; last_name: string; email: string; phone?: string | null; must_change_password: number }; bonuses: Array<{ id: number; name: string; initial_sessions: number; remaining_sessions: number; expires_at?: number | null; status: string; created_at: number }>; movements: Array<{ id: number; bonus_name: string; delta: number; reason: string; created_at: number }>; appointments: Array<{ id: number; starts_at: number; ends_at: number; status: string; notes?: string | null; bonus_name: string }> };
const formatDate = (value?: number | null) => value ? new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(value)) : "Sin caducidad";
const publicWebsiteUrl = "https://beamd-endonutri.github.io/IMPULSA-FIT/";

export function ClientPortal() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState("");
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [data, setData] = useState<ClientData | null>(null);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() { const response = await fetch("/api/cliente/resumen", { cache: "no-store" }); if (response.status === 401) { setAuthenticated(false); return; } const body = await response.json() as ClientData & { error?: string }; if (response.ok) setData(body); else setNotice(body.error || "No se ha podido cargar tu información."); }

  useEffect(() => {
    if (window.location.hostname.endsWith("github.io")) { window.location.replace("https://impulsa-fit-huelva.bea-md.chatgpt.site/cliente"); return; }
    fetch("/api/privado/sesion", { cache: "no-store" }).then(async (response) => {
      const session = await response.json() as { authenticated?: boolean; role?: string; name?: string; mustChangePassword?: boolean };
      if (response.ok && session.authenticated && session.role === "client") { setAuthenticated(true); setName(session.name || ""); setMustChangePassword(Boolean(session.mustChangePassword)); void load(); }
    }).catch(() => undefined).finally(() => setChecking(false));
  }, []);
  async function logout() { await fetch("/api/privado/logout", { method: "POST" }); setAuthenticated(false); setData(null); }
  async function changePassword(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setNotice(""); const form = event.currentTarget; const values = new FormData(form); const response = await fetch("/api/privado/contrasena", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "client", currentPassword: values.get("currentPassword"), newPassword: values.get("newPassword") }) }); const body = await response.json() as { error?: string }; if (response.ok) { setMustChangePassword(false); setNotice("Contraseña actualizada correctamente."); form.reset(); } else setNotice(body.error || "No se ha podido cambiar la contraseña."); setBusy(false); }
  const total = useMemo(() => data?.bonuses.reduce((sum, bonus) => sum + Number(bonus.remaining_sessions), 0) ?? 0, [data]);

  if (checking) return <main className="private-loading"><img src="/logo-impulsa-fit-transparent.webp" alt="IMPULSA FIT" /><span>Cargando tu área…</span></main>;
  if (!authenticated) return <PrivateLogin role="client" onSuccess={(session) => { setAuthenticated(true); setName(session.name); setMustChangePassword(session.mustChangePassword); void load(); }} />;

  return <main className="client-app">
    <header className="client-topbar"><Link href={publicWebsiteUrl}><ArrowLeft size={18} /> Web pública</Link><img src="/logo-impulsa-fit-transparent.webp" alt="IMPULSA FIT" /><button onClick={logout}><LogOut size={17} /> Salir</button></header>
    <div className="client-shell">
      <section className="client-welcome"><div><p>MI ÁREA PRIVADA</p><h1>Hola, <span>{name.split(" ")[0]}.</span></h1><small>Aquí puedes consultar tus bonos y el historial de sesiones.</small></div><div className="client-total"><TicketCheck size={28} /><strong>{total}</strong><span>sesiones disponibles</span></div></section>
      {notice && <div className="private-notice"><Check size={18} /> {notice}<button onClick={() => setNotice("")}>×</button></div>}
      {mustChangePassword && <section className="password-change-panel client-password"><div><KeyRound size={25} /><div><strong>Crea tu contraseña personal</strong><p>La clave recibida es temporal. Cámbiala para proteger tu cuenta.</p></div></div><form onSubmit={changePassword}><input name="currentPassword" type="password" placeholder="Contraseña temporal" required /><input name="newPassword" type="password" placeholder="Nueva contraseña (mín. 10 caracteres)" minLength={10} required /><button disabled={busy}>Guardar contraseña</button></form></section>}
      <section className="client-bonus-section"><div className="client-section-title"><TicketCheck size={22} /><div><h2>Mis bonos</h2><p>Saldo actualizado por el equipo de IMPULSA FIT.</p></div></div><div className="client-bonus-grid">{data?.bonuses.length ? data.bonuses.map((bonus) => <article key={bonus.id}><div className="client-bonus-top"><span>{bonus.status === "active" ? "ACTIVO" : "INACTIVO"}</span><CalendarClock size={20} /></div><h3>{bonus.name}</h3><div className="client-bonus-number"><strong>{bonus.remaining_sessions}</strong><span>de {bonus.initial_sessions}<br />sesiones</span></div><div className="client-progress"><span style={{ width: `${Math.max(0, Math.min(100, Number(bonus.remaining_sessions) / bonus.initial_sessions * 100))}%` }} /></div><p>Caducidad: <b>{formatDate(bonus.expires_at)}</b></p></article>) : <div className="private-empty">Todavía no tienes ningún bono asociado.</div>}</div></section>
      <section className="client-history client-appointments"><div className="client-section-title"><CalendarDays size={22} /><div><h2>Mis sesiones</h2><p>Citas programadas y sesiones ya realizadas.</p></div></div><div>{data?.appointments?.length ? data.appointments.map((appointment) => <article key={appointment.id}><span className={appointment.status === "completed" ? "positive" : appointment.status === "cancelled" ? "negative" : "scheduled"}><CalendarClock size={18} /></span><div><strong>{new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(appointment.starts_at))}</strong><p>{appointment.bonus_name}{appointment.notes ? ` · ${appointment.notes}` : ""}</p></div><time>{appointment.status === "completed" ? "Realizada" : appointment.status === "cancelled" ? "Cancelada" : "Programada"}</time></article>) : <div className="private-empty">Aún no tienes citas agendadas.</div>}</div></section>
      <section className="client-history"><div className="client-section-title"><History size={22} /><div><h2>Historial</h2><p>Altas, sesiones consumidas y ajustes de tus bonos.</p></div></div><div>{data?.movements.length ? data.movements.map((movement) => <article key={movement.id}><span className={movement.delta > 0 ? "positive" : "negative"}>{movement.delta > 0 ? `+${movement.delta}` : movement.delta}</span><div><strong>{movement.bonus_name}</strong><p>{movement.reason}</p></div><time>{formatDate(movement.created_at)}</time></article>) : <div className="private-empty">Aún no hay movimientos.</div>}</div></section>
      <aside className="client-help"><UserRound size={24} /><div><strong>¿Ves algún dato que no coincide?</strong><p>Coméntaselo al profesional en tu próxima sesión para que pueda revisar el historial y corregirlo.</p></div></aside>
    </div>
  </main>;
}
