"use client";

import { useState } from "react";

type Job = {
  title: string;
  company: string;
  location: string;
  posted_at: string;
  age_hours: number;
  url: string;
};

export default function SearchPage() {
  const [q, setQ] = useState("python");
  const [loc, setLoc] = useState("london");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [missingOut, setMissingOut] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function doSearch() {
    setLoading(true);
    setError(null);
    setMissingOut(false);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/search?q=${encodeURIComponent(
          q
        )}&location=${encodeURIComponent(loc)}&limit=50`
      );
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      setJobs(data.results || []);
      setMissingOut(Boolean(data.has_hidden_fresh));
    } catch (e: any) {
      setError(e.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 18,
          boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
          padding: "40px 32px",
          maxWidth: 600,
          width: "100%",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <h1 style={{ margin: 0, fontSize: 32, color: "#1e293b" }}>
            JobCatcher
          </h1>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 15,
            }}
          >
            <input
              type="checkbox"
              checked={isPro}
              onChange={() => setIsPro((v) => !v)}
              style={{ accentColor: "#6366f1" }}
            />
            Pro (dev toggle)
          </label>
        </header>

        <p style={{ marginTop: 0, color: "#475569", fontSize: 16 }}>
          Free: last week • Pro: includes today&apos;s fresh jobs (&lt;24h)
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="keywords (e.g. python)"
            className="jc-input"
            style={{
              flex: 1,
              padding: 10,
              border: "1px solid #e0e7ff",
              borderRadius: 10,
              fontSize: 16,
              color: "#111",
            }}
          />
          <input
            value={loc}
            onChange={(e) => setLoc(e.target.value)}
            placeholder="location (e.g. london)"
            className="jc-input"
            style={{
              width: 200,
              padding: 10,
              border: "1px solid #e0e7ff",
              borderRadius: 10,
              fontSize: 16,
              color: "#111",
            }}
          />
          <button
            onClick={doSearch}
            disabled={loading}
            style={{
              padding: "10px 22px",
              borderRadius: 10,
              background: "linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)",
              color: "white",
              fontWeight: 600,
              fontSize: 16,
              border: "none",
              boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {error && (
          <div style={{ marginTop: 14, color: "#b00020", fontSize: 15 }}>
            {error}
          </div>
        )}

        {missingOut && !isPro && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              background: "#6366f1",
              color: "white",
              border: "1px solid #6366f1",
              borderRadius: 10,
              fontSize: 15,
            }}
          >
            <strong>You&apos;re missing out!</strong> Fresh roles (&lt;24h)
            exist for this search but are hidden without Pro.
          </div>
        )}

        <ul style={{ marginTop: 28, listStyle: "none", padding: 0 }}>
          {jobs
            .filter((j) => (isPro ? true : j.age_hours >= 24))
            .map((j, i) => (
              <li
                key={`${j.title}-${i}`}
                style={{
                  padding: 16,
                  border: "1px solid #e0e7ff",
                  borderRadius: 12,
                  marginBottom: 14,
                  position: "relative",
                  background: j.age_hours < 24 ? "#f1f5ff" : "#fff",
                  boxShadow:
                    j.age_hours < 24
                      ? "0 2px 8px rgba(99,102,241,0.07)"
                      : "none",
                }}
              >
                {!isPro && j.age_hours < 24 && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(255,255,255,0.7)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(2px)",
                      borderRadius: 12,
                      zIndex: 2,
                    }}
                  >
                    <span style={{ color: "#6366f1", fontWeight: 600 }}>
                      Locked — Pro only (&lt;24h)
                    </span>
                  </div>
                )}
                <a
                  href={j.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontWeight: 600,
                    textDecoration: "underline",
                    fontSize: 18,
                    color: "#1e293b",
                  }}
                >
                  {j.title}
                </a>
                <div style={{ fontSize: 15, color: "#475569", marginTop: 2 }}>
                  {j.company} • {j.location}
                </div>
                <div style={{ fontSize: 13, color: "#111", marginTop: 2 }}>
                  {j.age_hours < 24
                    ? `${j.age_hours}h ago`
                    : `${Math.floor(j.age_hours / 24)}d ago`}
                </div>
              </li>
            ))}
        </ul>

        {jobs.length === 0 && !loading && (
          <div style={{ marginTop: 32, opacity: 0.7, fontSize: 15 }}>
            Try a search to see results.
          </div>
        )}
      </div>
      <style jsx>{`
        .jc-input::placeholder {
          color: #111 !important;
          opacity: 1;
        }
      `}</style>
    </main>
  );
}
