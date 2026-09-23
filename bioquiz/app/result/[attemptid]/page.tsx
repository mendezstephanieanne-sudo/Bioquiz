"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ResultCard from "@/components/ResultCard";

type Result = {
  id: number;
  userName: string;
  category: string;
  score: number;
  totalQuestions: number;
  status: string;
  startedAt: string;
  finishedAt: string | null;
};

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();

  const attemptId = params.attemptid as string;

  const [result, setResult] = useState<Result | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResult() {
      try {
        const response = await fetch(
          `/api/results/${attemptId}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Unable to load result.");
          return;
        }

        setResult(data.result);
      } catch {
        setError("Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    }

    loadResult();
  }, [attemptId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Loading result...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="rounded-xl bg-red-50 p-6 text-red-600">
          {error}
        </div>
      </main>
    );
  }

  if (!result) {
    return null;
  }

  const percentage = Math.round(
    (result.score / result.totalQuestions) * 100
  );

  return (
    <main className="page-shell center-content">
      <ResultCard
        category={result.category}
        userName={result.userName}
        totalQuestions={result.totalQuestions}
        correctAnswers={result.score}
        incorrectAnswers={result.totalQuestions - result.score}
        percentage={percentage}
        onRetake={() => router.push("/dashboard")}
        onHome={() => router.push("/dashboard")}
      />
    </main>
  );
}