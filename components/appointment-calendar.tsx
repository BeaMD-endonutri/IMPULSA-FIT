"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarCheck2, CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, RotateCcw, TicketCheck, X } from "lucide-react";

type Client = { id: number; first_name: string; last_name: string; remaining_sessions: number };
type Bonus = { id: number; name: string; remaining_sessions: number; status: string };
type Appointment = { id: number; client_id: number; bonus_id: number; starts_at: number; ends_at: number; status: string; notes?: string | null; deducted_at?: number | null; first_name: string; last_name: string; bonus_name: string };

const dayKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const startOfDay = (source: Date) => { const date = new Date(source); date.setHours(0, 0, 0, 0); return date; };
const addDays = (source: Date, amount: number) => new Date(source.getFullYear(), source.getMonth(), source.getDate() + amount);
const mondayOf = (source: Date) => { const date = startOfDay(source); return addDays(date, -((date.getDay() + 6) % 7)); };
const firstOfMonth = (source: Date) => new Date(source.getFullYear(), source.getMonth(), 1);
const hours = Array.from({ length: 27 }, (_, index) => { const minutes = 8 * 60 + index * 30; return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`; });
const formatTime = (value: number) => new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(new Date(value));

export function AppointmentCalendar({ clients, onBalancesChanged }: { clients: Client[]; onBalancesChanged: () => void }) {
  const today = startOfDay(new Date());
  const [month, setMonth] = useState(() => firstOfMonth(today));
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDay, setSelectedDay] = useState(() => dayKey(today));
  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState("");
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);

  const calendarDays = useMemo(() => {
    const start = mondayOf(firstOfMonth(month));
    return Array.from({ length: 42 }, (_, index) => addDays(start, index));
  }, [month]);

  const load = useCallback(async () => {
    const from = calendarDays[0].getTime();
    const to = addDays(calendarDays[calendarDays.length - 1], 1).getTime();
    const response = await fetch(`/api/profesional/citas?from=${from}&to=${to}`, { cache: "no-store" });
    const body = await response.json() as { appointments?: Appointment[]; error?: string };
    if (response.ok) setAppointments(body.appointments ?? []);
    else setNotice(body.error || "No se ha podido cargar la agenda.");
  }, [calendarDays]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);
  useEffect(() => {
    const timer = window.setInterval(async () => {
      const response = await fetch("/api/profesional/citas/procesar", { method: "POST" });
      if (response.ok) {
        const body = await response.json() as { processed?: number };
        if (body.processed) { await load(); onBalancesChanged(); }
      }
    }, 30000);
    return () => window.clearInterval(timer);
  }, [load, onBalancesChanged]);

  const appointmentsByDay = useMemo(() => {
    const grouped = new Map<string, Appointment[]>();
    for (const appointment of appointments) {
      const key = dayKey(new Date(appointment.starts_at));
      grouped.set(key, [...(grouped.get(key) ?? []), appointment]);
    }
    return grouped;
  }, [appointments]);

  const selectedAppointments = appointmentsByDay.get(selectedDay) ?? [];
  const selectedDate = new Date(`${selectedDay}T12:00:00`);
  const weekStart = mondayOf(today);
  const weekEnd = addDays(weekStart, 7).getTime();
  const activeAppointments = appointments.filter((item) => item.status !== "cancelled");
  const weekCount = activeAppointments.filter((item) => item.starts_at >= weekStart.getTime() && item.starts_at < weekEnd).length;
  const todayCount = (appointmentsByDay.get(dayKey(today)) ?? []).filter((item) => item.status !== "cancelled").length;
  const lowBonuses = clients.filter((client) => Number(client.remaining_sessions) > 0 && Number(client.remaining_sessions) <= 2).length;

  function changeMonth(offset: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    setMonth(next);
    setSelectedDay(dayKey(next));
  }

  function goToday() {
    const now = startOfDay(new Date());
    setMonth(firstOfMonth(now));
    setSelectedDay(dayKey(now));
  }

  function openAppointmentForm() {
    const chosen = startOfDay(selectedDate) < startOfDay(new Date()) ? startOfDay(new Date()) : selectedDate;
    setSelectedDay(dayKey(chosen));
    setShowForm(true);
  }

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
    if (response.ok) {
      setNotice("Cita agendada. La sesión se descontará automáticamente en los minutos posteriores al inicio, aunque cierres la web.");
      setShowForm(false); setClientId(""); setBonuses([]); form.reset(); await load();
    } else setNotice(body.error || "No se ha podido agendar la cita.");
    setBusy(false);
  }

  async function cancelAppointment(id: number) {
    if (!window.confirm("¿Cancelar esta cita? No se descontará ninguna sesión.")) return;
    const response = await fetch(`/api/profesional/citas/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "cancel" }) });
    const body = await response.json() as { error?: string };
    if (response.ok) { setNotice("Cita cancelada."); await load(); }
    else setNotice(body.error || "No se ha podido cancelar.");
  }

  return <div className="monthly-agenda">
    <header className="monthly-agenda-heading">
      <div><p>AGENDA DE SESIONES</p><h1>Agenda mensual</h1><span>Organiza tus citas y consulta cada día de un vistazo.</span></div>
      <button className="agenda-add-primary" onClick={openAppointmentForm}><Plus size={19} /> Agendar cita</button>
    </header>

    <div className="agenda-summary">
      <article><CalendarDays /><div><strong>{weekCount}</strong><span>citas esta semana</span></div></article>
      <article><CalendarCheck2 /><div><strong>{todayCount}</strong><span>hoy</span></div></article>
      <article className={lowBonuses ? "warning" : ""}><AlertTriangle /><div><strong>{lowBonuses}</strong><span>bonos bajos</span></div></article>
    </div>

    {notice && <div className="private-notice"><TicketCheck size={18} /> {notice}<button onClick={() => setNotice("")}>×</button></div>}

    {showForm && <form className="appointment-form monthly-form" onSubmit={createAppointment}>
      <div className="panel-title"><div><h2>Nueva cita</h2><p>Elige cliente, bono y tramo horario.</p></div><button type="button" onClick={() => setShowForm(false)} aria-label="Cerrar"><X /></button></div>
      <div className="appointment-form-grid">
        <label>Cliente<select name="clientId" required value={clientId} onChange={(event) => void chooseClient(event.target.value)}><option value="">Seleccionar cliente</option>{clients.filter((client) => client.remaining_sessions > 0).map((client) => <option key={client.id} value={client.id}>{client.first_name} {client.last_name} · {client.remaining_sessions} disponibles</option>)}</select></label>
        <label>Bono<select name="bonusId" required disabled={!clientId}><option value="">Seleccionar bono</option>{bonuses.map((bonus) => <option key={bonus.id} value={bonus.id}>{bonus.name} · {bonus.remaining_sessions} sesiones</option>)}</select></label>
        <label>Fecha<input key={selectedDay} name="date" type="date" min={dayKey(new Date())} defaultValue={selectedDay} required /></label>
        <label>Hora<select name="time" defaultValue="10:00" required>{hours.map((hour) => <option key={hour}>{hour}</option>)}</select></label>
        <label>Duración<select name="duration" defaultValue="40"><option value="30">30 min</option><option value="40">40 min</option><option value="45">45 min</option><option value="60">60 min</option></select></label>
        <label className="wide">Nota interna<input name="notes" placeholder="Opcional: objetivo o recordatorio" /></label>
      </div><button className="private-primary-button compact" disabled={busy}>{busy ? "Guardando…" : "Confirmar cita"}</button>
    </form>}

    <div className="monthly-agenda-layout">
      <section className="month-panel">
        <div className="month-toolbar">
          <div className="month-switcher"><button onClick={() => changeMonth(-1)} aria-label="Mes anterior"><ChevronLeft /></button><strong>{new Intl.DateTimeFormat("es-ES", { month: "long", year: "numeric" }).format(month)}</strong><button onClick={() => changeMonth(1)} aria-label="Mes siguiente"><ChevronRight /></button></div>
          <button className="today-button" onClick={goToday}><RotateCcw size={16} /> Hoy</button>
        </div>
        <div className="month-weekdays">{["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => <span key={day}>{day}</span>)}</div>
        <div className="month-grid">
          {calendarDays.map((day) => {
            const key = dayKey(day);
            const items = appointmentsByDay.get(key) ?? [];
            const isToday = key === dayKey(today);
            const isSelected = key === selectedDay;
            const isOutside = day.getMonth() !== month.getMonth();
            return <button type="button" key={key} className={`month-day${isToday ? " today" : ""}${isSelected ? " selected" : ""}${isOutside ? " outside" : ""}`} onClick={() => setSelectedDay(key)} aria-label={`${day.getDate()} de ${new Intl.DateTimeFormat("es-ES", { month: "long" }).format(day)}, ${items.length} citas`}>
              <span className="month-day-number">{day.getDate()}</span>
              <span className="month-day-events">
                {items.slice(0, 3).map((item) => <span key={item.id} className={`month-event tone-${Math.abs(item.client_id) % 4} ${item.status}`}><b>{formatTime(item.starts_at)}</b><em>{item.first_name} {item.last_name.charAt(0)}.</em></span>)}
                {items.length > 3 && <span className="month-more">+{items.length - 3} más</span>}
              </span>
            </button>;
          })}
        </div>
        <div className="month-legend"><span><i className="tone-0" /> Citas EMS</span><span><i className="completed" /> Realizadas</span><span><i className="cancelled" /> Canceladas</span></div>
      </section>

      <aside className="selected-day-panel">
        <div className="selected-day-heading"><div><p>DÍA SELECCIONADO</p><h2>{new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric" }).format(selectedDate)}</h2><span>{new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" }).format(selectedDate)}</span></div><b>{selectedAppointments.filter((item) => item.status !== "cancelled").length}</b></div>
        <div className="selected-day-list">
          {selectedAppointments.length ? selectedAppointments.map((item) => {
            const client = clients.find((entry) => entry.id === item.client_id);
            return <article key={item.id} className={`selected-appointment tone-${Math.abs(item.client_id) % 4} ${item.status}`}>
              <div className="selected-appointment-time"><Clock3 size={16} /><b>{formatTime(item.starts_at)} – {formatTime(item.ends_at)}</b><span>{item.status === "completed" ? "Realizada" : item.status === "cancelled" ? "Cancelada" : "Confirmada"}</span></div>
              <h3>{item.first_name} {item.last_name}</h3>
              <p>{item.bonus_name}</p>
              <small>{client ? `${client.remaining_sessions} sesiones disponibles` : "Bono asociado"}{item.notes ? ` · ${item.notes}` : ""}</small>
              {item.status === "scheduled" && item.starts_at > Date.now() && <button onClick={() => void cancelAppointment(item.id)}>Cancelar cita</button>}
            </article>;
          }) : <div className="selected-day-empty"><CalendarDays /><strong>Sin citas</strong><p>Este día está libre.</p></div>}
        </div>
        {startOfDay(selectedDate) >= startOfDay(new Date()) && <button className="selected-day-add" onClick={openAppointmentForm}><Plus size={18} /> Nueva cita</button>}
        <p className="selected-day-note"><TicketCheck size={17} /> Las sesiones realizadas permanecen en el historial de cada cliente.</p>
      </aside>
    </div>
  </div>;
}
