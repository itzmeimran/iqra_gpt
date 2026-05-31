import React from "react";
import { useNavigate } from "react-router-dom";

const GoogleIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      fill="#4285F4"
    />
    <path
      d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      fill="#EA4335"
    />
  </svg>
);

interface GoogleSignInButtonProps {
  onClick?: () => void;
  disabled?: boolean;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    onClick?.(); // call parent handler if provided
    navigate("/google_sso");
  };
  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        height: "40px",
        paddingInline: "12px",
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "#ffffff",
        border: "1px solid #dadce0",
        borderRadius: "4px",
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "'Google Sans', Roboto, Arial, sans-serif",
        fontSize: "14px",
        fontWeight: 500,
        color: "#3c4043",
        letterSpacing: "0.25px",
        whiteSpace: "nowrap",
        userSelect: "none",
        transition: "background-color 0.2s, box-shadow 0.2s",
        opacity: disabled ? 0.6 : 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#f7f8f8";
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            "0 1px 3px rgba(60,64,67,0.3), 0 2px 6px rgba(60,64,67,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
          "#ffffff";
        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#efeff0";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor =
            "#f7f8f8";
        }
      }}
      aria-label="Sign in with Google"
      type="button"
    >
      <GoogleIcon />
      <span>Sign in with Google</span>
    </button>
  );
};

export default GoogleSignInButton;
