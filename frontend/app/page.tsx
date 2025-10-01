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

export default function Home() {
  const [q, setQ] = useState("python");
  const [loc, setLoc] = useState("london");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [missingOut, setMissingOut] = useState(false);
  const [isPro, setIsPro] = useState(false); // mock (we'll wire real auth/billing later)
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
    <main style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h1 style={{ margin: 0 }}>JobCatcher</h1>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={isPro}
            onChange={() => setIsPro((v) => !v)}
          />
          Pro (dev toggle)
        </label>
      </header>

      <p style={{ marginTop: 0 }}>
        Free: last week • Pro: includes today&apos;s fresh jobs (&lt;24h)
      </p>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="keywords (e.g. python)"
          style={{
            flex: 1,
            padding: 8,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
        <input
          value={loc}
          onChange={(e) => setLoc(e.target.value)}
          placeholder="location (e.g. london)"
          style={{
            width: 220,
            padding: 8,
            border: "1px solid #ddd",
            borderRadius: 8,
          }}
        />
        <button
          onClick={doSearch}
          disabled={loading}
          style={{ padding: "8px 16px", borderRadius: 8 }}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <div style={{ marginTop: 12, color: "#b00020" }}>{error}</div>}

      {missingOut && !isPro && (
        <div
          style={{
            marginTop: 16,
            padding: 12,
            background: "#000000eb",
            border: "1px solid #000000ff",
            borderRadius: 8,
          }}
        >
          <strong>You&apos;re missing out!</strong> Fresh roles (&lt;24h) exist
          for this search but are hidden without Pro.
        </div>
      )}

      <ul style={{ marginTop: 20, listStyle: "none", padding: 0 }}>
        {jobs
          .filter((j) => (isPro ? true : j.age_hours >= 24)) // Free hides <24h
          .map((j, i) => (
            <li
              key={`${j.title}-${i}`}
              style={{
                padding: 12,
                border: "1px solid #eee",
                borderRadius: 8,
                marginBottom: 10,
                position: "relative",
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
                    borderRadius: 8,
                  }}
                >
                  <span>Locked — Pro only (&lt;24h)</span>
                </div>
              )}
              <a
                href={j.url}
                target="_blank"
                rel="noreferrer"
                style={{ fontWeight: 600, textDecoration: "underline" }}
              >
                {j.title}
              </a>
              <div>
                {j.company} • {j.location}
              </div>
              <div style={{ fontSize: 12, opacity: 0.7 }}>
                {j.age_hours < 24
                  ? `${j.age_hours}h ago`
                  : `${Math.floor(j.age_hours / 24)}d ago`}
              </div>
            </li>
          ))}
      </ul>

      {jobs.length === 0 && !loading && (
        <div style={{ marginTop: 24, opacity: 0.7 }}>
          Try a search to see results.
        </div>
      )}
    </main>
  );
}
