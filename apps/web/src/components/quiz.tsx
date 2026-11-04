"use client";
import { Arrow } from "@/components/icons";
import { useState } from "react";
import type { Quiz as QuizData } from "@/lib/catalog";
type Result = {
  score: number;
  total: number;
  results: {
    question_id: number;
    correct: boolean;
    correct_option: number;
    explanation: string;
  }[];
};
export function Quiz({ quiz }: { quiz: QuizData }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/quiz/${quiz.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: quiz.questions.map((q) => ({
            question_id: q.id,
            option: answers[q.id],
          })),
        }),
      });
      if (!response.ok)
        throw new Error(
          "La correction n’est pas disponible. Réessaie dans un instant.",
        );
      setResult((await response.json()) as Result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Connexion interrompue.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="quiz" id="quiz" aria-labelledby="quiz-title">
      <span className="eyebrow">À TOI DE JOUER · SANS CHRONOMÈTRE</span>
      <h2 id="quiz-title">{quiz.title}</h2>
      <p>Prends ton temps. Chaque réponse est une occasion d’apprendre.</p>
      <form onSubmit={submit}>
        {quiz.questions.map((q, index) => {
          const correction = result?.results.find(
            (r) => r.question_id === q.id,
          );
          return (
            <fieldset key={q.id} disabled={busy || !!result}>
              <legend>
                <span className="question-number">{index + 1}</span>
                {q.prompt}
              </legend>
              <div className="quiz-options">
                {q.options.map((option, i) => (
                  <label
                    key={i}
                    className={`quiz-option ${answers[q.id] === i ? "selected" : ""} ${correction?.correct_option === i ? "correct" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={i}
                      required
                      checked={answers[q.id] === i}
                      onChange={() => setAnswers((a) => ({ ...a, [q.id]: i }))}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              {correction && (
                <p className="correction">
                  <strong>
                    {correction.correct
                      ? "Bien vu ! "
                      : "Une nouvelle découverte ! "}
                  </strong>
                  {correction.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        {!result && (
          <button
            className="button"
            disabled={
              busy || Object.keys(answers).length !== quiz.questions.length
            }
          >
            {busy ? "Correction en cours…" : "Découvrir mes résultats"}{" "}
            <span aria-hidden="true">
              <Arrow />
            </span>
          </button>
        )}
      </form>
      {result && (
        <div className="quiz-result" role="status">
          <h3>
            {result.score} / {result.total} réponses justes
          </h3>
          <p>
            {result.score === result.total
              ? "Bravo, tu as fait le plein de découvertes !"
              : "Bien exploré ! Relis les explications et essaie à nouveau si tu en as envie."}
          </p>
          <button
            className="button"
            onClick={() => {
              setAnswers({});
              setResult(null);
              setError("");
            }}
          >
            Rejouer ↻
          </button>
        </div>
      )}
    </section>
  );
}
