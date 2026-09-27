"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function startQuiz() {
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/guest", { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Unable to start a quiz.");
        return;
      }
      localStorage.setItem("bioquizUser", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-aside"><button className="brand-mark" onClick={() => router.push("/")}><span>Bio</span>Quiz</button><div className="login-quote"><p className="eyebrow">A curious mind is a powerful thing</p><h1>Small questions.<br /><em>Big discoveries.</em></h1><p>Build your biology instincts one question at a time.</p></div><span className="aside-note">EST. 2026 / FIELD NOTES</span></div>
      <div className="login-content"><div className="login-form-wrap"><p className="eyebrow">Welcome to the lab</p><h2>Ready to explore?</h2><p className="login-copy">Choose a subject and start your biology challenge.</p><button type="button" className="primary-button login-button" onClick={startQuiz} disabled={loading}>{loading ? "Opening..." : "Start Quiz"}</button>{error && <div className="error-box">{error}</div>}</div></div>
    </main>
  );
}
