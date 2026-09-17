"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, LogIn } from "lucide-react";

export type LoginRole = "professional" | "client";
const publicWebsiteUrl = "https://beamd-endonutri.github.io/IMPULSA-FIT/";

export function PrivateLogin({ role, onSuccess }: { role: LoginRole; onSuccess: (data: { name: string; mustChangePassword: boolean }) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/privado/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role, identifier: form.get("identifier"), password: form.get("password") }) });
      const data = await response.json() as { error?: string; name?: string; mustChangePassword?: boolean };
      if (!response.ok) throw new Error(data.error || "No se ha podido iniciar sesión.");
      onSuccess({ name: data.name || "", mustChangePassword: Boolean(data.mustChangePassword) });
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No se ha podido iniciar sesión."); }
    finally { setBusy(false); }
  }

  return <main className="private-login-page">
    <Link className="private-back" href={publicWebsiteUrl}><ArrowLeft size={18} /> Volver a IMPULSA FIT</Link>
    <section className="private-login-card">
      <img src="/logo-impulsa-fit-transparent.webp" alt="IMPULSA FIT" />
      <div className="private-login-icon"><LockKeyhole size={28} /></div>
      <p className="eyebrow">ACCESO SEGURO</p>
      <h1>{role === "professional" ? "Área profesional" : "Área de clientes"}</h1>
      <p>{role === "professional" ? "Gestiona clientes, bonos, movimientos y reseñas desde un único lugar." : "Consulta tus bonos, sesiones disponibles y movimientos."}</p>
      <form onSubmit={submit}>
        <label>{role === "professional" ? "Usuario" : "Correo electrónico"}<input name="identifier" type={role === "client" ? "email" : "text"} autoComplete="username" required /></label>
        <label>Contraseña<div className="private-password-field"><input name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div></label>
        <button className="private-primary-button" disabled={busy}>{busy ? "Accediendo…" : <><LogIn size={18} /> Entrar</>}</button>
        {error && <p className="private-error" role="alert">{error}</p>}
      </form>
      <small>Conexión protegida · Los datos privados no se muestran públicamente</small>
    </section>
  </main>;
}
