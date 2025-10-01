"use client";

import { useEffect, useState } from "react";

export default function Billing() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    setIsPro(localStorage.getItem("jobcatcher_is_pro") === "true");
  }, []);

  const upgrade = () => {
    localStorage.setItem("jobcatcher_is_pro", "true");
    setIsPro(true);
  };

  const downgrade = () => {
    localStorage.removeItem("jobcatcher_is_pro");
    setIsPro(false);
  };

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
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: "#1e293b",
            marginBottom: 10,
          }}
        >
          Billing
        </h1>
        <p style={{ fontSize: 16, color: "#475569", marginBottom: 24 }}>
          Pro unlocks jobs posted &lt; 24h ago.
        </p>

        {!isPro ? (
          <>
            <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 18 }}>
              <strong>£9.99/month</strong>{" "}
              <span style={{ color: "#64748b" }}>(placeholder)</span>
            </p>
            <button
              onClick={upgrade}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                background: "linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)",
                color: "white",
                fontWeight: 600,
                fontSize: 16,
                border: "none",
                boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              Upgrade to Pro (dev)
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 18 }}>
              <strong>You're Pro!</strong> Fresh jobs will be visible.
            </p>
            <button
              onClick={downgrade}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                background: "#e0e7ff",
                color: "#1e293b",
                fontWeight: 600,
                fontSize: 16,
                border: "none",
                boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              Cancel (dev)
            </button>
          </>
        )}

        <p style={{ marginTop: 18 }}>
          <a
            href="/search"
            style={{
              color: "#6366f1",
              textDecoration: "underline",
              fontWeight: 500,
              fontSize: 15,
            }}
          >
            Back to search
          </a>
        </p>
      </div>
    </main>
  );
}
