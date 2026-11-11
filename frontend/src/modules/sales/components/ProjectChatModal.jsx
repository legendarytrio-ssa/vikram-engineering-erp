import { useEffect } from "react";
import { Hash, MessageSquare, X } from "lucide-react";

import { Chat } from "../../chat/index.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function ProjectChatModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, project]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Chat room for ${project.projectCode}`}
        className="relative flex h-[min(760px,92vh)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl shadow-black/60"
      >
        <header className="flex items-center justify-between gap-3 border-b border-zinc-800 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
              <MessageSquare size={16} />
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                <Hash size={11} />
                Project chat room
              </p>
              <h2 className="truncate text-sm font-semibold text-zinc-100">
                {project.projectCode}
                <span className="ml-2 font-normal text-zinc-400">
                  {project.projectName}
                </span>
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100"
          >
            <X size={15} />
          </button>
        </header>

        <div className="min-h-0 flex-1">
          <Chat
            id={project.projectCode}
            name={project.projectCode}
            description={project.projectName}
            apiBaseUrl={`${API_BASE_URL}/api/chat`}
            height="100%"
            joinLabel="Join chat room"
            className="chat-modal"
          />
        </div>
      </div>
    </div>
  );
}
