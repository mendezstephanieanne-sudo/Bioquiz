"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      const response = await fetch(creatingAccount ? "/api/auth/register" : "/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Login failed."); return; }
      localStorage.setItem("bioquizUser", JSON.stringify(data.user)); router.push("/dashboard");
    } catch { setError("Unable to connect to the server."); }
    finally { setLoading(false); }
  }

  return (
    <main className="login-page">
      <div className="login-aside"><button className="brand-mark" onClick={() => router.push("/")}><span>Bio</span>Quiz</button><div className="login-quote"><p className="eyebrow">A curious mind is a powerful thing</p><h1>Small questions.<br /><em>Big discoveries.</em></h1><p>Build your biology instincts one question at a time.</p></div><span className="aside-note">EST. 2026 / FIELD NOTES</span></div>
      <div className="login-content"><div className="login-form-wrap"><p className="eyebrow">{creatingAccount ? "Join the lab" : "Welcome back"}</p><h2>{creatingAccount ? "Make a start." : "Enter the lab."}</h2><p className="login-copy">{creatingAccount ? "Create an account to begin your biology challenge." : "Sign in to continue your biology challenge."}</p><form onSubmit={handleLogin} className="login-form">
      {creatingAccount && <label>Name<input type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" required /></label>}
      <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></label>
      <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your password" autoComplete={creatingAccount ? "new-password" : "current-password"} minLength={creatingAccount ? 8 : undefined} required /></label>{error && <div className="error-box">{error}</div>}<button type="submit" className="primary-button login-button" disabled={loading}>{loading ? "Opening..." : creatingAccount ? "Create account" : "Continue to BioQuiz →"}</button></form>
      <button type="button" className="text-button" onClick={() => { setCreatingAccount(!creatingAccount); setError(""); }}>{creatingAccount ? "Already have an account? Sign in" : "New here? Create an account"}</button>
      {!creatingAccount && <div className="demo-note"><strong>Demo access</strong><span>user@bioquiz.com</span><span>bioquiz123</span></div>}</div></div>
    </main>
  );
}
