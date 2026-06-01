import React, { useState } from "react";
import { useAuthStore } from "../store/authStore";

// ── Google "G" Logo ────────────────────────────────────────────────────────────
const GoogleLogo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M39.11 20.456c0-1.42-.127-2.783-.364-4.092H20v7.745h10.745a9.19 9.19 0 0 1-3.99 6.035v5.016h6.462c3.781-3.482 5.964-8.61 5.964-14.704Z"
      fill="#4285F4"
    />
    <path
      d="M20 40c5.4 0 9.927-1.79 13.236-4.84l-6.462-5.016c-1.79 1.2-4.08 1.907-6.774 1.907-5.21 0-9.617-3.52-11.19-8.247H2.182v5.178A19.997 19.997 0 0 0 20 40Z"
      fill="#34A853"
    />
    <path
      d="M8.81 23.804A12.03 12.03 0 0 1 8.182 20c0-1.323.228-2.607.628-3.804V10.018H2.182A19.997 19.997 0 0 0 0 20c0 3.227.773 6.28 2.182 8.982l6.628-5.178Z"
      fill="#FBBC05"
    />
    <path
      d="M20 7.953c2.936 0 5.568 1.01 7.636 2.99l5.727-5.727C29.918 1.98 25.39 0 20 0A19.997 19.997 0 0 0 2.182 10.018l6.628 5.178C10.383 10.473 14.79 7.953 20 7.953Z"
      fill="#EA4335"
    />
  </svg>
);

// ── Chevron Down ───────────────────────────────────────────────────────────────
const ChevronDown = () => (
  <svg
    width="10"
    height="6"
    viewBox="0 0 10 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1l4 4 4-4"
      stroke="#444746"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Eye icons for show/hide password ──────────────────────────────────────────
const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="#444746"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="#444746"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"
      stroke="#444746"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"
      stroke="#444746"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1 1l22 22"
      stroke="#444746"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// ── Floating label input ───────────────────────────────────────────────────────
interface FloatingInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  rightSlot?: React.ReactNode;
  autoComplete?: string;
}

const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  type = "text",
  value,
  onChange,
  error,
  rightSlot,
  autoComplete,
}) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div style={{ position: "relative", marginBottom: error ? "4px" : "0" }}>
      <div
        style={{
          position: "relative",
          borderStyle: "solid",
          borderRadius: "4px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          paddingInline: "14px",
          boxSizing: "border-box",
          transition: "border-color 0.15s",
          borderColor: error ? "#d93025" : focused ? "#1a73e8" : "#747775",
          borderWidth: error ? "2px" : focused ? "2px" : "1px",
        }}
      >
        <label
          style={{
            position: "absolute",
            left: "13px",
            pointerEvents: "none",
            transition: "all 0.15s ease",
            transformOrigin: "left center",
            lineHeight: 1,
            fontFamily: "'Google Sans', Roboto, sans-serif",
            top: lifted ? "-8px" : "50%",
            transform: lifted
              ? "translateY(0) scale(0.75)"
              : "translateY(-50%) scale(1)",
            color: error ? "#d93025" : focused ? "#1a73e8" : "#444746",
            fontSize: lifted ? "12px" : "16px",
            backgroundColor: lifted ? "#fff" : "transparent",
            paddingInline: lifted ? "4px" : "0",
          }}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          style={{
            width: "100%",
            border: "none",
            outline: "none",
            fontSize: "16px",
            color: "#1f1f1f",
            backgroundColor: "transparent",
            paddingTop: "10px",
            fontFamily: "'Google Sans', Roboto, sans-serif",
            paddingRight: rightSlot ? "36px" : "0",
          }}
        />
        {rightSlot && (
          <div
            style={{
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p
          style={{
            margin: "4px 0 0 14px",
            fontSize: "12px",
            color: "#d93025",
            fontFamily: "'Google Sans', Roboto, sans-serif",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// ── Email validation ───────────────────────────────────────────────────────────
const validateEmail = (val: string): string => {
  if (!val.trim()) return "Enter an email or phone number";
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRe = /^\+?[\d\s\-().]{7,15}$/;
  if (!emailRe.test(val) && !phoneRe.test(val))
    return "Enter a valid email or phone number";
  return "";
};

// ── Responsive hook ────────────────────────────────────────────────────────────
const useIsMobile = (breakpoint = 600): boolean => {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth <= breakpoint
  );
  React.useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

// ── Main Page ──────────────────────────────────────────────────────────────────
type Step = "email" | "password";

const GoogleSignInPage: React.FC = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // hover states
  const [hoverCreate, setHoverCreate] = useState(false);
  const [hoverNext, setHoverNext] = useState(false);
  const [hoverForgot, setHoverForgot] = useState(false);
  const [hoverBack, setHoverBack] = useState(false);

  const isMobile = useIsMobile(600);

  // ── Step 1: validate email then advance ──
  const handleNext = async () => {
    if (step === "email") {
      const err = validateEmail(email);
      setEmailError(err);
      if (!err) {
        setStep("password");
        setPassword("");
        setPasswordError("");
      }
      return;
    }

    // Step 2: validate password
    if (!password) {
      setPasswordError("Enter a password");
      return;
    }
    if (password.length < 6) {
      setPasswordError(
        "Wrong password. Try again or click 'Forgot password' to reset it."
      );
      return;
    }
    setPasswordError("");
    try {
      await googleLogin(email, password);
    } catch (e) {
      alert("Something went wrong");
    }
  };

  const handleBack = () => {
    setStep("email");
    setPassword("");
    setPasswordError("");
  };

  const leftHeading = step === "email" ? "Sign in" : "Welcome";
  const leftSubheading = step === "email" ? "Use your Google Account" : email;

  const { googleLogin } = useAuthStore();

  // ── Responsive card layout ────────────────────────────────────────────────
  const cardStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: isMobile ? "0" : "28px",
    padding: isMobile ? "32px 24px 28px" : "48px 40px 36px",
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: isMobile ? "24px" : "80px",
    alignItems: "flex-start",
    width: "100%",
    maxWidth: isMobile ? "100%" : "860px",
    boxSizing: "border-box",
  };

  const leftColStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isMobile ? "row" : "column",
    alignItems: isMobile ? "center" : "flex-start",
    gap: isMobile ? "12px" : "12px",
    flexShrink: 0,
    paddingTop: isMobile ? "0" : "8px",
    minWidth: isMobile ? "unset" : "200px",
    width: isMobile ? "100%" : "auto",
  };

  const headingStyle: React.CSSProperties = {
    margin: isMobile ? "0" : "8px 0 0",
    fontSize: isMobile ? "24px" : "32px",
    fontWeight: 400,
    color: "#1f1f1f",
    letterSpacing: "-0.5px",
    lineHeight: 1.2,
  };

  // On mobile, hide the subheading from the left column since it shows
  // inline next to the logo & title — avoids duplication
  const showLeftSubheading = !isMobile || step === "email";

  return (
    <>
      {/* Inject a media-query for the footer to wrap on small screens */}
      <style>{`
        @media (max-width: 480px) {
          .gsip-footer {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 12px !important;
          }
        }
        @media (max-width: 600px) {
          .gsip-page {
            justify-content: flex-start !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="gsip-page" style={styles.pageWrapper}>
        {/* ── Card ── */}
        <div style={cardStyle}>
          {/* Left column */}
          <div style={leftColStyle}>
            <GoogleLogo />
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <h1 style={headingStyle}>{leftHeading}</h1>
              {showLeftSubheading && (
                <p
                  style={{
                    margin: 0,
                    fontSize:
                      step === "password" && !isMobile ? "14px" : "16px",
                    fontWeight: step === "password" && !isMobile ? 500 : 400,
                    color:
                      step === "password" && !isMobile ? "#1f1f1f" : "#444746",
                    fontFamily: "'Google Sans', Roboto, sans-serif",
                  }}
                >
                  {leftSubheading}
                </p>
              )}
            </div>
          </div>

          {/* Right column */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingTop: isMobile ? "0" : "8px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            {step === "email" ? (
              <>
                {/* Email field */}
                <FloatingInput
                  label="Email or phone"
                  type="email"
                  value={email}
                  onChange={(v) => {
                    setEmail(v);
                    if (emailError) setEmailError("");
                  }}
                  error={emailError}
                  autoComplete="email"
                />

                {/* Forgot email */}
                <div style={styles.forgotRow}>
                  <a
                    href="#"
                    style={{
                      ...styles.link,
                      color: hoverForgot ? "#1558b0" : "#1a73e8",
                      textDecoration: hoverForgot ? "underline" : "none",
                    }}
                    onMouseEnter={() => setHoverForgot(true)}
                    onMouseLeave={() => setHoverForgot(false)}
                  >
                    Forgot email?
                  </a>
                </div>

                {/* Guest notice */}
                <p style={styles.guestNotice}>
                  Not your computer? Use Guest mode to sign in privately.{" "}
                  <a href="#" style={styles.learnMore}>
                    Learn more
                  </a>
                </p>

                {/* Actions */}
                <div style={styles.actions}>
                  <button
                    style={{
                      ...styles.createBtn,
                      backgroundColor: hoverCreate ? "#e8f0fe" : "transparent",
                    }}
                    onMouseEnter={() => setHoverCreate(true)}
                    onMouseLeave={() => setHoverCreate(false)}
                    type="button"
                  >
                    Create account
                  </button>
                  <button
                    style={{
                      ...styles.nextBtn,
                      backgroundColor: hoverNext ? "#1557b0" : "#1a73e8",
                      boxShadow: hoverNext
                        ? "0 1px 3px rgba(0,0,0,.3)"
                        : "0 1px 2px rgba(0,0,0,.2)",
                    }}
                    onMouseEnter={() => setHoverNext(true)}
                    onMouseLeave={() => setHoverNext(false)}
                    onClick={handleNext}
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Password field */}
                <FloatingInput
                  label="Enter your password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(v) => {
                    setPassword(v);
                    if (passwordError) setPasswordError("");
                  }}
                  error={passwordError}
                  autoComplete="current-password"
                  rightSlot={
                    <span onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </span>
                  }
                />

                {/* Show password checkbox */}
                <label style={styles.showPasswordRow}>
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    style={{
                      accentColor: "#1a73e8",
                      width: "16px",
                      height: "16px",
                      cursor: "pointer",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#444746",
                      fontFamily: "'Google Sans', Roboto, sans-serif",
                    }}
                  >
                    Show password
                  </span>
                </label>

                {/* Forgot password */}
                <div style={styles.forgotRow}>
                  <a
                    href="#"
                    style={{
                      ...styles.link,
                      color: hoverForgot ? "#1558b0" : "#1a73e8",
                      textDecoration: hoverForgot ? "underline" : "none",
                    }}
                    onMouseEnter={() => setHoverForgot(true)}
                    onMouseLeave={() => setHoverForgot(false)}
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Actions */}
                <div style={styles.actions}>
                  <button
                    style={{
                      ...styles.createBtn,
                      backgroundColor: hoverBack ? "#e8f0fe" : "transparent",
                    }}
                    onMouseEnter={() => setHoverBack(true)}
                    onMouseLeave={() => setHoverBack(false)}
                    onClick={handleBack}
                    type="button"
                  >
                    Back
                  </button>
                  <button
                    style={{
                      ...styles.nextBtn,
                      backgroundColor: hoverNext ? "#1557b0" : "#1a73e8",
                      boxShadow: hoverNext
                        ? "0 1px 3px rgba(0,0,0,.3)"
                        : "0 1px 2px rgba(0,0,0,.2)",
                    }}
                    onMouseEnter={() => setHoverNext(true)}
                    onMouseLeave={() => setHoverNext(false)}
                    onClick={handleNext}
                    type="button"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <footer
          className="gsip-footer"
          style={{
            ...styles.footer,
            maxWidth: isMobile ? "100%" : "860px",
            paddingInline: isMobile ? "24px" : "4px",
            marginTop: isMobile ? "12px" : "16px",
          }}
        >
          <div style={styles.langSelector}>
            <span style={styles.langText}>English (United States)</span>
            <ChevronDown />
          </div>
          <nav style={styles.footerLinks}>
            {["Help", "Privacy", "Terms"].map((label) => (
              <a key={label} href="#" style={styles.footerLink}>
                {label}
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f9",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Google Sans', Roboto, sans-serif",
    padding: "24px 16px",
  },
  forgotRow: { marginTop: "-4px" },
  link: {
    fontSize: "14px",
    fontFamily: "'Google Sans', Roboto, sans-serif",
    cursor: "pointer",
    transition: "color 0.1s",
  },
  guestNotice: {
    fontSize: "14px",
    color: "#444746",
    lineHeight: 1.5,
    margin: "4px 0 0",
    fontFamily: "'Google Sans', Roboto, sans-serif",
  },
  learnMore: {
    color: "#1a73e8",
    fontWeight: 600,
    textDecoration: "none",
    fontSize: "14px",
  },
  showPasswordRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    marginTop: "-4px",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "12px",
    marginTop: "20px",
  },
  createBtn: {
    height: "40px",
    paddingInline: "24px",
    border: "none",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a73e8",
    cursor: "pointer",
    fontFamily: "'Google Sans', Roboto, sans-serif",
    letterSpacing: "0.25px",
    transition: "background-color 0.15s",
  },
  nextBtn: {
    height: "40px",
    paddingInline: "24px",
    border: "none",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    cursor: "pointer",
    fontFamily: "'Google Sans', Roboto, sans-serif",
    letterSpacing: "0.25px",
    transition: "background-color 0.15s, box-shadow 0.15s",
  },
  footer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxSizing: "border-box",
  },
  langSelector: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    padding: "8px 12px",
    borderRadius: "4px",
  },
  langText: {
    fontSize: "13px",
    color: "#444746",
    fontFamily: "'Google Sans', Roboto, sans-serif",
  },
  footerLinks: { display: "flex", gap: "24px" },
  footerLink: {
    fontSize: "13px",
    color: "#444746",
    textDecoration: "none",
    fontFamily: "'Google Sans', Roboto, sans-serif",
  },
};

export default GoogleSignInPage;