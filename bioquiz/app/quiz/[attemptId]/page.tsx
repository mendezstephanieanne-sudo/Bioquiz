"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import QuizHeader from "@/components/QuizHeader";

type Choice = { id: number; text: string };
type Question = { id: number; question: string; difficulty: string; choices: Choice[] };
type QuizData = {
  attempt: { id: number; status: string; score: number; totalQuestions: number; category: string };
  questions: Question[];
};

export default function QuizAttemptPage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const attemptId = params.attemptId;
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuiz() {
      try {
        const response = await fetch(`/api/quiz/${attemptId}`);
        const data = await response.json();
        if (!response.ok) { setError(data.error || "Unable to load quiz."); return; }
        setQuiz(data);
        if (data.attempt.status === "COMPLETED") router.push(`/result/${attemptId}`);
      } catch { setError("Unable to connect to the server."); }
      finally { setLoading(false); }
    }
    loadQuiz();
  }, [attemptId, router]);

  async function saveAnswer(questionId: number, choiceId: number) {
    setSaving(true); setError("");
    try {
      const response = await fetch(`/api/quiz/${attemptId}/answer`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, choiceId }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Unable to save answer."); return false; }
      return true;
    } catch { setError("Unable to save answer."); return false; }
    finally { setSaving(false); }
  }

  async function handleContinue() {
    if (!quiz) return;
    const question = quiz.questions[currentQuestion];
    if (!selectedChoice) { setError("Choose an answer to continue."); return; }
    if (!(await saveAnswer(question.id, selectedChoice))) return;
    if (currentQuestion < quiz.questions.length - 1) {
      setSelectedChoice(null);
      setCurrentQuestion((value) => value + 1);
    }
    else {
      setSaving(true);
      try {
        const response = await fetch(`/api/quiz/${attemptId}/submit`, { method: "POST" });
        const data = await response.json();
        if (!response.ok) { setError(data.error || "Unable to submit quiz."); return; }
        router.push(`/result/${attemptId}`);
      } catch { setError("Unable to submit quiz."); }
      finally { setSaving(false); }
    }
  }

  if (loading) return <main className="page-shell center-content"><p className="muted">Loading your quiz...</p></main>;
  if (error && !quiz) return <main className="page-shell center-content"><div className="error-box">{error}</div></main>;
  if (!quiz || !quiz.questions.length) return <main className="page-shell center-content"><p>No questions available.</p></main>;

  const question = quiz.questions[currentQuestion];
  const isLast = currentQuestion === quiz.questions.length - 1;

  return (
    <main className="page-shell quiz-shell">
      <QuizHeader category={quiz.attempt.category} onHome={() => router.push("/dashboard")} />
      <div className="quiz-heading"><div><p className="eyebrow">Knowledge challenge</p><h1>Think it through.</h1></div><div className="question-count"><strong>{String(currentQuestion + 1).padStart(2, "0")}</strong><span> / {String(quiz.questions.length).padStart(2, "0")}</span></div></div>
      <ProgressBar current={currentQuestion + 1} total={quiz.questions.length} />
      <section className="question-panel">
        <QuestionCard
          questionNumber={currentQuestion + 1}
          question={question.question}
          difficulty={question.difficulty}
          choices={question.choices}
          selectedChoice={selectedChoice}
          onSelect={setSelectedChoice}
        />
        {error && <div className="error-box inline-error">{error}</div>}
        <div className="question-footer"><span className="muted">Select one answer</span><button className="primary-button" onClick={handleContinue} disabled={saving}>{saving ? "Saving..." : isLast ? "Finish quiz" : "Next question →"}</button></div>
      </section>
    </main>
  );
}