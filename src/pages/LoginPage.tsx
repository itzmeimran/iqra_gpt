import { useEffect, useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const {
    login,
    googleSSO,
    isLoading,
    error: storeError,
    clearError,
    isAuthenticated,
  } = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setMounted(true);
    return () => clearError();
  }, [clearError]);

  const error = useMemo(
    () => localError || storeError || "",
    [localError, storeError],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");
    clearError();

    if (!email.trim()) {
      setLocalError("Email is required.");
      return;
    }

    if (!password.trim()) {
      setLocalError("Password is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setLocalError("Enter a valid email address.");
      return;
    }

    try {
      await login(email.trim(), password);
    } catch {
      // handled in store
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLocalError("");
      clearError();
      const { credential: idToken } = credentialResponse;
      console.log("credentialResponse", credentialResponse);
      if (!idToken) {
        setLocalError("Google login failed. No credential received.");
        return;
      }
      const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'
      const response = await fetch(`${baseURL}api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Google login failed");
      }

      await googleSSO(idToken);
      navigate("/chat", { replace: true });

    } catch (err: any) {
      setLocalError(err.message || "Google sign-in failed.");
    }
  };

  const handleGoogleError = () => {
    setLocalError("Google sign-in failed.");
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
            Iqra AI
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
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                style={inputStyle}
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
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                style={inputStyle}
              />
            </div>

            {error && (
              <div
                role="alert"
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
                boxShadow: isLoading
                  ? "none"
                  : "0 0 20px rgba(20,184,126,0.25)",
              }}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "18px 0",
              }}
            >
              <div
                style={{ flex: 1, height: 1, background: "var(--border)" }}
              />
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                Or continue with
              </span>
              <div
                style={{ flex: 1, height: 1, background: "var(--border)" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 4,
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="330"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "var(--bg-tertiary)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  color: "var(--text-primary)",
  fontSize: 14,
  fontFamily: "Sora, sans-serif",
  outline: "none",
} as const;
