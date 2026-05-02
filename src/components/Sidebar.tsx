import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/chatStore";
import { useAuthStore } from "../store/authStore";
import type { ChatSession } from "../types";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) => {
  const {
    sessions,
    activeSesssionId,
    createSession,
    deleteSession,
    setActiveSession,
    updateSessionTitle,
  } = useChatStore();
  const { user, logout } = useAuthStore();
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editRef.current) editRef.current.focus();
  }, [editingId]);

  const filtered = sessions.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase()),
  );

  const handleNewChat = () => {
    createSession();
    onMobileClose();
  };

  const handleSelectSession = (id: string) => {
    setActiveSession(id);
    onMobileClose();
  };

  const startEdit = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditValue(s.title);
  };

  const commitEdit = () => {
    if (editingId && editValue.trim()) {
      updateSessionTitle(editingId, editValue.trim());
    }
    setEditingId(null);
  };

  const avatarLetter = user?.name?.[0]?.toUpperCase() ?? "?";

  const W = collapsed ? 64 : 260;

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--sidebar-overlay)",
            zIndex: 40,
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <aside
        style={{
          width: W,
          minWidth: W,
          maxWidth: W,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          transition:
            "width 0.25s ease, min-width 0.25s ease, transform 0.3s ease",
          position: "relative",
          zIndex: 50,
          flexShrink: 0,
          boxShadow: "var(--sidebar-shadow)",
          ...(typeof window !== "undefined" && window.innerWidth < 768
            ? {
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
                width: 280,
                minWidth: 280,
                maxWidth: 280,
              }
            : {}),
        }}
      >
        <div
          style={{
            padding: collapsed ? "18px 12px" : "18px 16px",
            borderBottom: "1px solid var(--sidebar-border)",
            display: "flex",
            alignItems: "center",
            gap: 10,
            justifyContent: collapsed ? "center" : "space-between",
          }}
        >
          {!collapsed && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: "var(--sidebar-logo-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "var(--sidebar-logo-shadow)",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L2 7l10 5 10-5-10-5z"
                    stroke="var(--sidebar-logo-icon)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2 17l10 5 10-5M2 12l10 5 10-5"
                    stroke="var(--sidebar-logo-icon)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                Iqra GPT
              </span>
            </div>
          )}

          <button
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{
              width: 30,
              height: 30,
              borderRadius: 9,
              border: "1px solid var(--icon-button-border)",
              background: "var(--icon-button-bg)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-secondary)",
              flexShrink: 0,
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--icon-button-bg-hover)";
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--icon-button-bg)";
              e.currentTarget.style.borderColor = "var(--icon-button-border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {collapsed ? (
                <path d="M9 18l6-6-6-6" />
              ) : (
                <path d="M15 18l-6-6 6-6" />
              )}
            </svg>
          </button>
        </div>

        <div style={{ padding: collapsed ? "12px 10px" : "12px 12px" }}>
          <button
            onClick={handleNewChat}
            title="New Chat"
            style={{
              width: "100%",
              padding: collapsed ? "10px" : "11px 14px",
              background: "var(--sidebar-newchat-bg)",
              border: "1px solid var(--sidebar-newchat-border)",
              borderRadius: 14,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              color: "var(--sidebar-newchat-text)",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "Sora, sans-serif",
              boxShadow: "var(--sidebar-newchat-shadow)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--sidebar-newchat-bg-hover)";
              e.currentTarget.style.boxShadow =
                "var(--sidebar-newchat-shadow-hover)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--sidebar-newchat-bg)";
              e.currentTarget.style.boxShadow = "var(--sidebar-newchat-shadow)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {!collapsed && "New Chat"}
          </button>
        </div>

        {!collapsed && (
          <div style={{ padding: "0 12px 10px" }}>
            <div style={{ position: "relative" }}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chats…"
                style={{
                  width: "100%",
                  padding: "9px 10px 9px 32px",
                  background: "var(--sidebar-search-bg)",
                  border: "1px solid var(--sidebar-search-border)",
                  borderRadius: 10,
                  color: "var(--text-primary)",
                  fontSize: 13,
                  fontFamily: "Sora, sans-serif",
                  outline: "none",
                  transition: "all 0.15s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor =
                    "var(--sidebar-search-border-focus)";
                  e.target.style.boxShadow = "var(--focus-ring)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--sidebar-search-border)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
          {!collapsed && (
            <>
              {filtered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 16px",
                    color: "var(--text-muted)",
                    fontSize: 13,
                  }}
                >
                  {search ? "No matching chats" : "No chats yet"}
                </div>
              )}

              {filtered.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isActive={session.id === activeSesssionId}
                  isEditing={editingId === session.id}
                  editValue={editValue}
                  editRef={editRef}
                  onSelect={() => handleSelectSession(session.id)}
                  onDelete={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  onStartEdit={startEdit}
                  onEditChange={setEditValue}
                  onEditBlur={commitEdit}
                  onEditKeyDown={(e) => {
                    if (e.key === "Enter") commitEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                />
              ))}
            </>
          )}

          {collapsed &&
            sessions.slice(0, 8).map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSession(s.id)}
                title={s.title}
                style={{
                  width: "100%",
                  height: 38,
                  borderRadius: 10,
                  border:
                    s.id === activeSesssionId
                      ? "1px solid var(--sidebar-session-active-border)"
                      : "1px solid transparent",
                  background:
                    s.id === activeSesssionId
                      ? "var(--sidebar-session-active-bg)"
                      : "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 4,
                  transition: "all 0.15s ease",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={
                    s.id === activeSesssionId
                      ? "var(--sidebar-session-active-icon)"
                      : "var(--text-muted)"
                  }
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            ))}
        </div>

        <div
          style={{
            padding: collapsed ? "12px 10px" : "12px 12px",
            borderTop: "1px solid var(--sidebar-border)",
          }}
        >
          {!collapsed && (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px",
                  borderRadius: 12,
                  background: "var(--sidebar-user-card-bg)",
                  border: "1px solid var(--sidebar-user-card-border)",
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: "var(--avatar-user-bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--avatar-user-text)",
                    boxShadow: "var(--shadow-sm)",
                    border: "1px solid var(--avatar-user-border)",
                  }}
                >
                  {avatarLetter}
                </div>

                <div style={{ overflow: "hidden", flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {user?.name ?? "User"}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--sidebar-plan-text)",
                      fontWeight: 500,
                    }}
                  >
                    Free Plan
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={logout}
            title="Sign out"
            style={{
              width: "100%",
              padding: collapsed ? "10px" : "9px 12px",
              background: "var(--sidebar-logout-bg)",
              border: "1px solid var(--sidebar-logout-border)",
              borderRadius: 10,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: collapsed ? "center" : "flex-start",
              gap: 8,
              color: "var(--sidebar-logout-text)",
              fontSize: 13,
              fontFamily: "Sora, sans-serif",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "var(--sidebar-logout-bg-hover)";
              e.currentTarget.style.borderColor =
                "var(--sidebar-logout-border-hover)";
              e.currentTarget.style.color = "var(--sidebar-logout-text-hover)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--sidebar-logout-bg)";
              e.currentTarget.style.borderColor =
                "var(--sidebar-logout-border)";
              e.currentTarget.style.color = "var(--sidebar-logout-text)";
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>
    </>
  );
};

interface SessionItemProps {
  session: ChatSession;
  isActive: boolean;
  isEditing: boolean;
  editValue: string;
  editRef: React.RefObject<HTMLInputElement | null>;
  onSelect: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onStartEdit: (s: ChatSession, e: React.MouseEvent) => void;
  onEditChange: (v: string) => void;
  onEditBlur: () => void;
  onEditKeyDown: (e: React.KeyboardEvent) => void;
}

const SessionItem = ({
  session,
  isActive,
  isEditing,
  editValue,
  editRef,
  onSelect,
  onDelete,
  onStartEdit,
  onEditChange,
  onEditBlur,
  onEditKeyDown,
}: SessionItemProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "9px 10px",
        borderRadius: 12,
        marginBottom: 4,
        cursor: "pointer",
        background: isActive
          ? "var(--sidebar-session-active-bg)"
          : hovered
            ? "var(--sidebar-session-hover-bg)"
            : "transparent",
        border: isActive
          ? "1px solid var(--sidebar-session-active-border)"
          : "1px solid transparent",
        display: "flex",
        alignItems: "center",
        gap: 8,
        transition: "all 0.15s ease",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={
          isActive ? "var(--sidebar-session-active-icon)" : "var(--text-muted)"
        }
        strokeWidth="2"
        style={{ flexShrink: 0 }}
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>

      {isEditing ? (
        <input
          ref={editRef}
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onBlur={onEditBlur}
          onKeyDown={onEditKeyDown}
          onClick={(e) => e.stopPropagation()}
          style={{
            flex: 1,
            background: "var(--sidebar-edit-bg)",
            border: "1px solid var(--sidebar-edit-border)",
            borderRadius: 8,
            color: "var(--text-primary)",
            fontSize: 13,
            padding: "5px 8px",
            fontFamily: "Sora, sans-serif",
            outline: "none",
            boxShadow: "var(--focus-ring)",
          }}
        />
      ) : (
        <span
          style={{
            flex: 1,
            fontSize: 13,
            color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontWeight: isActive ? 500 : 400,
          }}
        >
          {session.title}
        </span>
      )}

      {(hovered || isActive) && !isEditing && (
        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          <IconBtn onClick={(e) => onStartEdit(session, e)} title="Rename">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </IconBtn>
          <IconBtn onClick={onDelete} title="Delete" danger>
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14H6L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
            </svg>
          </IconBtn>
        </div>
      )}
    </div>
  );
};

const IconBtn = ({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    title={title}
    style={{
      width: 24,
      height: 24,
      borderRadius: 7,
      border: "1px solid transparent",
      background: "transparent",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
      transition: "all 0.15s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = danger
        ? "var(--danger-soft-bg)"
        : "var(--icon-button-bg-hover)";
      e.currentTarget.style.borderColor = danger
        ? "var(--danger-soft-border)"
        : "var(--border)";
      e.currentTarget.style.color = danger
        ? "var(--danger-soft-text)"
        : "var(--text-primary)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "transparent";
      e.currentTarget.style.borderColor = "transparent";
      e.currentTarget.style.color = "var(--text-muted)";
    }}
  >
    {children}
  </button>
);
