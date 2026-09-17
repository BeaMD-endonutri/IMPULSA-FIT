"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, RotateCcw, TicketCheck, X } from "lucide-react";

type Client = { id: number; first_name: string; last_name: string; remaining_sessions: number };
type Bonus = { id: number; name: string; remaining_sessions: number; status: string };
type Appointment = { id: number; client_id: number; bonus_id: number; starts_at: number; ends_at: number; status: string; notes?: string | null; deducted_at?: number | null; first_name: string; last_name: string; bonus_name: string };

const DAY = 86400000;
const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const mondayOf = (source: Date) => { const date = new Date(source); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - ((date.getDay() + 6) % 7)); return date; };
const hours = Array.from({ length: 27 }, (_, index) => { const minutes = 8 * 60 + index * 30; return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; });

export function AppointmentCalendar({ clients, onBalancesChanged }: { clients: Client[]; onBalancesChanged: () => void }) {
  const [weekStart, setWeekStart] = useState(() => mondayOf(new Date()));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDay, setSelectedDay] = useState(() => dayKey(new Date()));
  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const days = useMemo(() => Array.from({ length: 7 }, (_, index) => new Date(weekStart.getTime() + index * DAY)), [weekStart]);

  const load = useCallback(async () => {
    const from = weekStart.getTime(); const to = from + 7 * DAY;
    const response = await fetch(`/api/profesional/citas?from=${from}&to=${to}`, { cache: "no-store" });
    const body = await response.json() as { appointments?: Appointment[]; error?: string };
    if (response.ok) setAppointments(body.appointments ?? []); else setNotice(body.error || "No se ha podido cargar la agenda.");
  }, [weekStart]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(async () => {
      const response = await fetch("/api/profesional/citas/procesar", { method: "POST" });
      if (response.ok) { const body = await response.json() as { processed?: number }; if (body.processed) { await load(); onBalancesChanged(); } }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [load, onBalancesChanged]);

  async function chooseClient(value: string) {
    setClientId(value); setBonuses([]);
    if (!value) return;
    const response = await fetch(`/api/profesional/clientes/${value}`, { cache: "no-store" });
    const body = await response.json() as { bonuses?: Bonus[] };
    if (response.ok) setBonuses((body.bonuses ?? []).filter((bonus) => bonus.status === "active" && Number(bonus.remaining_sessions) > 0));
  }

  async function createAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setNotice("");
    const form = event.currentTarget; const values = new FormData(form);
    const startsAt = new Date(`${values.get("date")}T${values.get("time")}:00`).getTime();
    const response = await fetch("/api/profesional/citas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientId: values.get("clientId"), bonusId: values.get("bonusId"), startsAt, duration: values.get("duration"), notes: values.get("notes") }) });
    const body = await response.json() as { error?: string };
    if (response.ok) { setNotice("Cita agendada. La sesión se descontará automáticamente al comenzar."); setShowForm(false); setClientId(""); setBonuses([]); form.reset(); await load(); }
    else setNotice(body.error || "No se ha podido agendar la cita.");
    setBusy(false);
  }

  async function cancelAppointment(id: number) {
    if (!window.confirm("¿Cancelar esta cita? No se descontará ninguna sesión.")) return;
    const response = await fetch(`/api/profesional/citas/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel" }) });
    const body = await response.json() as { error?: string };
    if (response.ok) { setNotice("Cita cancelada."); await load(); } else setNotice(body.error || "No se ha podido cancelar.");
  }

  return <>
    <div className="private-heading agenda-heading"><div><p>AGENDA DE SESIONES</p><h1>Calendario semanal.</h1></div><button className="private-primary-button compact" onClick={() => setShowForm((value) => !value)}><Plus size={18} /> Agendar cita</button></div>
    {notice && <div className="private-notice"><TicketCheck size={18} /> {notice}<button onClick={() => setNotice("")}>×</button></div>}
    {showForm && <form className="appointment-form" onSubmit={createAppointment}>
      <div className="panel-title"><div><h2>Nueva cita</h2><p>Elige cliente, bono y tramo horario.</p></div><button type="button" onClick={() => setShowForm(false)} aria-label="Cerrar"><X /></button></div>
      <div className="appointment-form-grid">
        <label>Cliente<select name="clientId" required value={clientId} onChange={(event) => void chooseClient(event.target.value)}><option value="">Seleccionar cliente</option>{clients.filter((client) => client.remaining_sessions > 0).map((client) => <option key={client.id} value={client.id}>{client.first_name} {client.last_name} · {client.remaining_sessions} disponibles</option>)}</select></label>
        <label>Bono<select name="bonusId" required disabled={!clientId}><option value="">Seleccionar bono</option>{bonuses.map((bonus) => <option key={bonus.id} value={bonus.id}>{bonus.name} · {bonus.remaining_sessions} sesiones</option>)}</select></label>
        <label>Fecha<input name="date" type="date" min={dayKey(new Date())} defaultValue={selectedDay} required /></label>
        <label>Hora<select name="time" defaultValue="10:00" required>{hours.map((hour) => <option key={hour}>{hour}</option>)}</select></label>
        <label>Duración<select name="duration" defaultValue="40"><option value="30">30 min</option><option value="40">40 min</option><option value="45">45 min</option><option value="60">60 min</option></select></label>
        <label className="wide">Nota interna<input name="notes" placeholder="Opcional: objetivo o recordatorio" /></label>
      </div><button className="private-primary-button compact" disabled={busy}>{busy ? "Guardando…" : "Confirmar cita"}</button>
    </form>}
    <section className="agenda-board">
      <div className="agenda-toolbar"><button onClick={() => setWeekStart(new Date(weekStart.getTime() - 7 * DAY))}><ChevronLeft /> Semana anterior</button><strong>{new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long" }).format(days[0])} — {new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(days[6])}</strong><div><button onClick={() => setWeekStart(mondayOf(new Date()))}><RotateCcw size={16} /> Hoy</button><button onClick={() => setWeekStart(new Date(weekStart.getTime() + 7 * DAY))}>Siguiente <ChevronRight /></button></div></div>
      <div className="week-calendar">{days.map((day) => { const key = dayKey(day); const dayAppointments = appointments.filter((item) => dayKey(new Date(item.starts_at)) === key); const today = key === dayKey(new Date()); return <article key={key} className={today ? "today" : ""}><button className="day-heading" onClick={() => { setSelectedDay(key); setShowForm(true); }}><span>{new Intl.DateTimeFormat("es-ES", { weekday: "short" }).format(day)}</span><strong>{day.getDate()}</strong></button><div className="day-slots">{dayAppointments.length ? dayAppointments.map((item) => <div key={item.id} className={`appointment-card ${item.status}`}><div><Clock3 size={14} /><b>{new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date(item.starts_at))}</b></div><strong>{item.first_name} {item.last_name}</strong><small>{item.bonus_name}</small><span>{item.status === "completed" ? "Realizada · bono descontado" : item.status === "cancelled" ? "Cancelada" : "Programada"}</span>{item.status === "scheduled" && item.starts_at > Date.now() && <button onClick={() => void cancelAppointment(item.id)}>Cancelar</button>}</div>) : <button className="empty-day" onClick={() => { setSelectedDay(key); setShowForm(true); }}><Plus size={16} /> Añadir</button>}</div></article>; })}</div>
      <p className="agenda-legend"><CalendarDays size={17} /> Las citas realizadas permanecen en el calendario y en la ficha de cada cliente.</p>
    </section>
  </>;
}
