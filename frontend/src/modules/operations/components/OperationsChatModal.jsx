
import { useEffect } from "react";
import {
  Hash,
  MessageSquare,
  X,
  Radio,
} from "lucide-react";

import { Chat } from "../../chat/index.js";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function OperationsChatModal({ project, onClose }) {
  useEffect(() => {
    if (!project) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Prevent background scrolling while modal is open.
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="relative flex h-[85vh] max-h-[850px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-950 shadow-[0_25px_100px_rgba(0,0,0,0.65)]">

        {/* Top accent */}
        <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-emerald-500/20" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-5 py-4 sm:px-7">
          <div className="flex min-w-0 items-center gap-4">

            <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-emerald-500/20 bg-emerald-500/10">
              <MessageSquare
                size={22}
                className="text-emerald-400"
              />

              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-zinc-900 bg-emerald-400" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-white">
                  Project Discussion
                </h2>

                <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  Operations
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1 font-medium text-zinc-300">
                  <Hash size={12} />
                  {project.projectCode}
                </span>

                <span className="text-zinc-700">/</span>

                <span className="truncate">
                  {project.projectName}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="ml-3 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-700 bg-zinc-800/70 text-zinc-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
          >
            <X size={19} />
          </button>
        </div>

        {/* Chat information bar */}
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950 px-5 py-2.5 sm:px-7">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Radio size={14} className="text-emerald-400" />
            <span>Project communication channel</span>
          </div>

          <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-600">
            Vikram Engineering
          </span>
        </div>

        {/* Chat body */}
        <div className="min-h-0 flex-1 overflow-hidden bg-zinc-950">
          <Chat
            id={project.projectCode}
            name={project.projectCode}
            description={project.projectName}
            apiBaseUrl={`${API_BASE_URL}/api/chat`}
            height="100%"
            joinLabel="Join project chat"
            className="chat-modal"
          />
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-zinc-800 bg-zinc-900/70 px-5 py-3 sm:px-7">
          <p className="text-[11px] text-zinc-500">
            Messages are shared in this project's discussion room.
          </p>

          <span className="text-[10px] font-medium tracking-wider text-zinc-600">
            OPERATIONS
          </span>
        </div>
      </div>
    </div>
  );
}
