"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { MessageSquareQuote, Send, Star } from "lucide-react";

type Review = {
  id: number;
  first_name: string;
  last_name: string;
  rating: number;
  comment: string;
  created_at: number;
};

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const reviewsApi = typeof window !== "undefined" && window.location.hostname.endsWith("github.io")
    ? "https://impulsa-fit-huelva.bea-md.chatgpt.site/api/resenas"
    : "/api/resenas";

  useEffect(() => {
    fetch(reviewsApi)
      .then(async (response) => {
        if (!response.ok) throw new Error("load failed");
        return response.json() as Promise<{ reviews?: Review[] }>;
      })
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => setStatus("Las reseñas no están disponibles temporalmente."))
      .finally(() => setLoading(false));
  }, [reviewsApi]);

  const average = useMemo(() => {
    if (!reviews.length) return null;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }, [reviews]);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) {
      setStatus("Selecciona de 1 a 5 estrellas.");
      return;
    }
    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitting(true);
    setStatus("");
    try {
      const response = await fetch(reviewsApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          comment: data.get("comment"),
          website: data.get("website"),
          rating,
        }),
      });
      const body = await response.json() as { review?: Review; error?: string };
      if (!response.ok) throw new Error(body.error || "No se ha podido publicar.");
      if (!body.review) throw new Error("No se ha podido recuperar la reseña publicada.");
      setReviews((current) => [body.review as Review, ...current]);
      form.reset();
      setRating(0);
      setStatus("¡Gracias! Tu reseña se ha publicado correctamente.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "No se ha podido publicar la reseña.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="reviews" id="resenas">
      <div className="wrap">
        <div className="section-heading compact reviews-heading">
          <div>
            <div className="section-kicker"><MessageSquareQuote size={18} /> EXPERIENCIAS REALES</div>
            <h2>Tu experiencia<br /><span>también cuenta.</span></h2>
          </div>
          <div className="reviews-summary">
            {average ? <><strong>{average.toFixed(1)}</strong><span className="summary-stars" aria-label={`${average.toFixed(1)} de 5 estrellas`}>{[1,2,3,4,5].map((star) => <Star key={star} size={19} fill={star <= Math.round(average) ? "currentColor" : "none"} />)}</span><small>{reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}</small></> : <p>Sé la primera persona en compartir cómo ha sido su sesión y la atención recibida.</p>}
          </div>
        </div>

        <div className="reviews-layout">
          <form className="review-form" onSubmit={submitReview}>
            <h3>Cuéntanos tu experiencia</h3>
            <div className="review-name-row">
              <label>Nombre <input name="firstName" autoComplete="given-name" maxLength={60} required /></label>
              <label>Apellidos <input name="lastName" autoComplete="family-name" maxLength={100} required /></label>
            </div>
            <fieldset className="star-field">
              <legend>Tu valoración</legend>
              <div className="star-picker" onMouseLeave={() => setHoveredRating(0)}>
                {[1,2,3,4,5].map((star) => (
                  <button key={star} type="button" aria-label={`${star} ${star === 1 ? "estrella" : "estrellas"}`} aria-pressed={rating === star} onMouseEnter={() => setHoveredRating(star)} onFocus={() => setHoveredRating(star)} onBlur={() => setHoveredRating(0)} onClick={() => setRating(star)}>
                    <Star size={31} fill={star <= (hoveredRating || rating) ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
            </fieldset>
            <label>¿Cómo fue tu experiencia y la atención recibida?<textarea name="comment" minLength={10} maxLength={800} rows={5} required placeholder="Cuéntanos qué te pareció la sesión, el chaleco y el acompañamiento recibido…" /></label>
            <label className="review-honeypot" aria-hidden="true">Sitio web<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <button className="review-submit" type="submit" disabled={submitting}>{submitting ? "Publicando…" : <><Send size={18} /> Publicar reseña</>}</button>
            <p className="review-privacy">Tu nombre, apellidos, valoración y comentario serán visibles públicamente en esta página.</p>
            {status && <p className="review-status" role="status">{status}</p>}
          </form>

          <div className="review-list" aria-live="polite">
            {loading ? <div className="review-empty">Cargando experiencias…</div> : reviews.length ? reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card-top"><div className="review-avatar" aria-hidden="true">{review.first_name.charAt(0)}{review.last_name.charAt(0)}</div><div><strong>{review.first_name} {review.last_name}</strong><span>{new Date(review.created_at).toLocaleDateString("es-ES", { month: "long", year: "numeric" })}</span></div><div className="review-stars" aria-label={`${review.rating} de 5 estrellas`}>{[1,2,3,4,5].map((star) => <Star key={star} size={16} fill={star <= review.rating ? "currentColor" : "none"} />)}</div></div>
                <p>“{review.comment}”</p>
              </article>
            )) : <div className="review-empty"><Star size={30} /> Aún no hay reseñas publicadas. ¡Estrena este espacio!</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
