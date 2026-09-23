"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = { id: number; name: string; email: string };
type Category = { name: string; icon: string; description: string; available: boolean };

const categories: Category[] = [
  { name: "Cell Biology", icon: "◉", description: "The tiny machinery that makes life possible.", available: true },
  { name: "Genetics", icon: "⌁", description: "DNA, inheritance, and the code of life.", available: true },
  { name: "Human Anatomy", icon: "♡", description: "A closer look at the remarkable human body.", available: true },
  { name: "Botany", icon: "✳", description: "Plants, photosynthesis, and green systems.", available: true },
  { name: "Microbiology", icon: "✣", description: "The hidden world of microbes.", available: true },
  { name: "Zoology", icon: "◌", description: "Life in motion, from insects to mammals.", available: true },
  { name: "Ecology", icon: "♧", description: "The relationships that shape every habitat.", available: true },
  { name: "General Biology", icon: "＋", description: "A little bit of everything, beautifully connected.", available: true },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedUser = localStorage.getItem("bioquizUser");
    if (!savedUser) { router.push("/"); return; }
    const timer = window.setTimeout(() => setUser(JSON.parse(savedUser)), 0);
    return () => window.clearTimeout(timer);
  }, [router]);

  async function startQuiz() {
    if (!user || !selectedCategory.available) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, categoryName: selectedCategory.name }),
      });
      const data = await response.json();
      if (!response.ok) { setError(data.error || "Unable to start quiz."); return; }
      router.push(`/quiz/${data.attemptId}`);
    } catch { setError("Unable to connect to the server."); }
    finally { setLoading(false); }
  }

  async function logout() {
    try {
      await fetch("/api/auth/login/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("bioquizUser");
      router.push("/");
    }
  }

  if (!user) return <main className="page-shell center-content"><p className="muted">Preparing your lab...</p></main>;

  return (
    <main className="page-shell">
      <div className="dashboard-wrap">
        <header className="dashboard-header">
          <button className="brand-mark" onClick={() => router.push("/dashboard")}><span>Bio</span>Quiz</button>
          <div className="user-area"><span>Hi, {user.name.split(" ")[0]}</span><button className="logout-button" onClick={logout}>Log out</button></div>
        </header>
        <section className="dashboard-intro"><div><p className="eyebrow">Your biology lab</p><h1>What will you<br /><em>discover</em> today?</h1><p className="intro-copy">Choose a subject, follow your curiosity, and see how far your knowledge can take you.</p></div><div className="intro-stamp"><strong>08</strong><span>fields<br />to explore</span></div></section>
        <section className="category-section"><div className="section-heading"><div><p className="eyebrow">01 / Pick a subject</p><h2>Explore biology</h2></div><span className="muted category-count">{categories.filter((category) => category.available).length} of {categories.length} live</span></div>
          <div className="category-grid">{categories.map((category) => <button key={category.name} className={`category-card ${selectedCategory.name === category.name ? "active" : ""} ${!category.available ? "locked" : ""}`} onClick={() => category.available && setSelectedCategory(category)}><span className="category-icon">{category.icon}</span><span className="category-name">{category.name}</span><span className="category-description">{category.description}</span>{!category.available && <span className="coming-soon">Coming soon</span>}{selectedCategory.name === category.name && <span className="selected-dot">●</span>}</button>)}</div>
        </section>
        <section className="start-strip"><div><p className="eyebrow">Ready when you are</p><h2>{selectedCategory.name}</h2><span className="muted">10 questions · untimed · instant feedback</span></div><button className="primary-button" onClick={startQuiz} disabled={loading || !selectedCategory.available}>{loading ? "Opening..." : "Start quiz →"}</button></section>
        {error && <div className="error-box dashboard-error">{error}</div>}
      </div>
    </main>
  );
}
