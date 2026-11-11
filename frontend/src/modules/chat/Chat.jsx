import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ChatSession from "./ChatSession";
import { createChatApi } from "./chatApi";

import "stream-chat-react/dist/css/v2/index.css";
import "./chat.css";

const SESSION_PREFIX = "chat-kit:";

const readSession = (key) => {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeSession = (key, value) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode) - chat still works, identity just isn't cached.
  }
};

const clearSession = (key) => {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(key);
  } catch {
    // Ignore storage failures.
  }
};

const toCssSize = (value) => (typeof value === "number" ? `${value}px` : value);

/**
 * Drop-in chatroom bound to any room/project id.
 *
 * <Chat id={project._id} name={project.name} apiBaseUrl="/api/chat" />
 */
const Chat = ({
  id,
  name,
  description = "",
  apiBaseUrl = "/api/chat",
  channelType = "messaging",
  height = 600,
  initialUser = null,
  autoJoin = false,
  persistSession = true,
  enableEmailContact = true,
  joinLabel = "Join chatroom",
  className = "",
  onJoin,
  onLeave,
  onContactUser,
}) => {
  const storageKey = `${SESSION_PREFIX}${channelType}:${id}`;

  const [credentials, setCredentials] = useState(() =>
    persistSession ? readSession(storageKey) : null
  );
  const [form, setForm] = useState({
    name: initialUser?.name ?? "",
    email: initialUser?.email ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const autoJoined = useRef(false);
  const api = useMemo(() => createChatApi(apiBaseUrl), [apiBaseUrl]);

  const join = useCallback(
    async (values) => {
      const payload = {
        name: values.name.trim(),
        email: values.email.trim(),
      };

      if (!payload.name || !payload.email) {
        setError("Please enter your name and email.");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await api.getToken(payload);

        if (persistSession) writeSession(storageKey, data);

        setCredentials(data);
        onJoin?.(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [api, onJoin, persistSession, storageKey]
  );

  useEffect(() => {
    if (!autoJoin || credentials || autoJoined.current) return;

    autoJoined.current = true;
    join(form);
  }, [autoJoin, credentials, form, join]);

  const updateField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    join(form);
  };

  const handleReset = useCallback(() => {
    if (persistSession) clearSession(storageKey);
    setCredentials(null);
    setError("");
  }, [persistSession, storageKey]);

  const handleLeave = useCallback(() => {
    handleReset();
    setForm({ name: "", email: "" });
    onLeave?.();
  }, [handleReset, onLeave]);

  return (
    <section
      className={`pc-root ${className}`.trim()}
      style={{ "--pc-height": toCssSize(height) }}
    >
      <header className="pc-header">
        <div>
          <h2 className="pc-title">{name}</h2>
          {description && <p className="pc-subtitle">{description}</p>}
        </div>

        {credentials && (
          <div className="pc-user">
            <span>{credentials.username}</span>
            <button type="button" className="pc-ghost-button" onClick={handleLeave}>
              Leave
            </button>
          </div>
        )}
      </header>

      <div className="pc-body">
        {credentials ? (
          <ChatSession
            credentials={credentials}
            roomId={id}
            roomName={name}
            apiBaseUrl={apiBaseUrl}
            channelType={channelType}
            enableEmailContact={enableEmailContact}
            onContactUser={onContactUser}
            onReset={handleReset}
          />
        ) : (
          <form className="pc-join" onSubmit={handleSubmit}>
            <h3>{joinLabel}</h3>
            <p>Join this room with your name and email.</p>

            <label className="pc-field">
              Name
              <input
                type="text"
                value={form.name}
                onChange={updateField("name")}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </label>

            <label className="pc-field">
              Email
              <input
                type="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            {error && <p className="pc-error">{error}</p>}

            <button type="submit" className="pc-submit" disabled={loading}>
              {loading ? "Joining..." : joinLabel}
            </button>

            {enableEmailContact && (
              <p className="pc-hint">
                Right-click any message from someone else to email them.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
};

export default Chat;
