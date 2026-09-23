"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Login failed."); return; }
      localStorage.setItem("bioquizUser", JSON.stringify(data.user)); router.push("/dashboard");
    } catch { setError("Unable to connect to the server."); }
    finally { setLoading(false); }
  }

  return (
    <main className="login-page">
      <div className="login-aside"><button className="brand-mark" onClick={() => router.push("/")}><span>Bio</span>Quiz</button><div className="login-quote"><p className="eyebrow">A curious mind is a powerful thing</p><h1>Small questions.<br /><em>Big discoveries.</em></h1><p>Build your biology instincts one question at a time.</p></div><span className="aside-note">EST. 2026 / FIELD NOTES</span></div>
      <div className="login-content"><div className="login-form-wrap"><p className="eyebrow">Welcome back</p><h2>Enter the lab.</h2><p className="login-copy">Sign in to continue your biology challenge.</p><form onSubmit={handleLogin} className="login-form"><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label>
      <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" required /></label>{error && <div className="error-box">{error}</div>}<button type="submit" className="primary-button login-button" disabled={loading}>{loading ? "Opening..." : "Continue to BioQuiz →"}</button></form><div className="demo-note"><strong>Demo access</strong>
      <span>user@bioquiz.com</span><span>bioquiz123</span></div></div></div>
    </main>
  );
}
