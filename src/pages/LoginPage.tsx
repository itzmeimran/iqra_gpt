import { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";

export const LoginPage = () => {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("demo@genai.app");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Email is required.");
    if (!password.trim()) return setError("Password is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Enter a valid email address.");
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    }
  };

  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        background: "var(--bg-primary)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          top: -200,
          left: -200,
          background:
            "radial-gradient(circle, rgba(20,184,126,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          bottom: -100,
          right: -100,
          background:
            "radial-gradient(circle, rgba(20,184,126,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Card */}
      <div
        style={{
          margin: "auto",
          width: "100%",
          maxWidth: 420,
          padding: "0 24px",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 14,
              marginBottom: 16,
              background:
                "linear-gradient(135deg, var(--brand), var(--brand-dark))",
              boxShadow: "0 0 30px rgba(20,184,126,0.4)",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.5px",
            }}
          >
            Iqra GPT
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              marginTop: 6,
            }}
          >
            Sign in to your workspace
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            padding: 32,
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "var(--bg-tertiary)",
                  border:
                    error && !email
                      ? "1px solid #f87171"
                      : "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontFamily: "Sora, sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  color: "var(--text-primary)",
                  fontSize: 14,
                  fontFamily: "Sora, sans-serif",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--brand)")}
                onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
              />
            </div>

            {error && (
              <div
                style={{
                  marginBottom: 20,
                  padding: "10px 14px",
                  background: "rgba(248,113,113,0.1)",
                  border: "1px solid rgba(248,113,113,0.3)",
                  borderRadius: 8,
                  fontSize: 13,
                  color: "#fca5a5",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "13px",
                background: isLoading
                  ? "var(--brand-dark)"
                  : "linear-gradient(135deg, var(--brand-light), var(--brand))",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "Sora, sans-serif",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: isLoading ? "none" : "0 0 20px rgba(20,184,126,0.3)",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Demo credentials are pre-filled ↑
            </p>
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: 24,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Designed and Developed by Imran Khan
        </p>
      </div>
    </div>
  );
};

const Spinner = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    style={{ animation: "spin 0.8s linear infinite" }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle
      cx="12"
      cy="12"
      r="10"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="2.5"
    />
    <path
      d="M12 2a10 10 0 0 1 10 10"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);
