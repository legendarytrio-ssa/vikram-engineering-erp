import { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMessageContext } from "stream-chat-react";
import { ChatContactContext } from "./ChatContactContext";

const formatTime = (value) => {
  if (!value) return "";

  // Stream may return timestamps in nanoseconds.
  const timestamp = typeof value === "number" && value > 1e15 ? value / 1e6 : value;
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const ChatMessage = ({ message: messageProp }) => {
  const { message: contextMessage, isMyMessage } = useMessageContext();
  const { enabled, onContact } = useContext(ChatContactContext);

  const message = messageProp ?? contextMessage;
  const ownMessage = typeof isMyMessage === "function" ? isMyMessage(message) : false;

  const senderName = message?.user?.name || "Unknown user";
  const senderEmail = message?.user?.custom?.email || message?.user?.email || "";

  const [menu, setMenu] = useState(null);
  const menuRef = useRef(null);

  const canContact = enabled && !ownMessage && Boolean(senderEmail || onContact);

  useEffect(() => {
    if (!menu) return;

    const handleOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenu(null);
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setMenu(null);
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menu]);

  const handleContextMenu = (event) => {
    if (!canContact) return;
    event.preventDefault();
    setMenu({ x: event.clientX, y: event.clientY });
  };

  const handleContact = () => {
    setMenu(null);

    if (onContact) {
      onContact({ name: senderName, email: senderEmail, message });
      return;
    }

    window.location.href = `mailto:${encodeURIComponent(senderEmail)}`;
  };

  return (
    <div
      className={`pc-message ${ownMessage ? "pc-message-own" : "pc-message-other"}`}
      onContextMenu={handleContextMenu}
      title={canContact ? `Right-click to contact ${senderName}` : undefined}
    >
      <span className="pc-message-sender">
        {senderName}
        {ownMessage && " (You)"}
      </span>

      <div className="pc-message-text">{message?.text}</div>

      {message?.attachments?.map((attachment, index) => {
        const url =
          attachment.image_url || attachment.asset_url || attachment.og_scrape_url;

        if (!url) return null;

        if (attachment.type === "image") {
          return (
            <img
              key={index}
              src={url}
              alt="Chat attachment"
              className="pc-message-image"
            />
          );
        }

        return (
          <a key={index} href={url} target="_blank" rel="noreferrer">
            {attachment.title || attachment.name || "View attachment"}
          </a>
        );
      })}

      <span className="pc-message-time">{formatTime(message?.created_at)}</span>

      {menu &&
        createPortal(
          <div
            ref={menuRef}
            className="pc-menu"
            style={{
              left: Math.max(8, Math.min(menu.x, window.innerWidth - 200)),
              top: Math.max(8, Math.min(menu.y, window.innerHeight - 56)),
            }}
            onContextMenu={(event) => event.preventDefault()}
          >
            <button type="button" className="pc-menu-item" onClick={handleContact}>
              {senderEmail ? `Email ${senderName}` : `Contact ${senderName}`}
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};

export default ChatMessage;
