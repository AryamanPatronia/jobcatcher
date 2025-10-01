export default function Landing() {
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
          padding: "48px 36px",
          maxWidth: 420,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 40,
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: "-1px",
            color: "#1e293b",
          }}
        >
          JobCatcher
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "#475569",
            marginBottom: 28,
            lineHeight: 1.5,
          }}
        >
          <span style={{ fontWeight: 500 }}>
            Catch jobs before anyone else.
          </span>
          <br />
          <span style={{ opacity: 0.8 }}>
            <strong>Free:</strong> last week’s jobs.
            <br />
            <strong>Pro:</strong> today’s fresh jobs.
          </span>
        </p>
        <a
          href="/search"
          style={{
            display: "inline-block",
            background: "linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)",
            color: "white",
            fontWeight: 600,
            padding: "12px 28px",
            borderRadius: 10,
            fontSize: 17,
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
            transition: "background 0.2s",
          }}
        >
          Find fresh jobs →
        </a>
        <p
          style={{
            marginTop: 22,
            fontSize: 13,
            color: "#64748b",
            opacity: 0.8,
          }}
        >
          Tip: On the search page, toggle “Pro” to preview the Pro experience.
        </p>
      </div>
    </main>
  );
}
