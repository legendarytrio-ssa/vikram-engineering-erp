import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  ChevronDown,
  ClipboardList,
  Download,
  FileCheck2,
  FilePlus2,
  FileText,
  FolderKanban,
  FolderOpen,
  Loader2,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trash2,
  Users,
  X
} from "lucide-react";

import Header from "../components/landing/Header";
import Metric from "../components/landing/Metric";
import ProjectChatModal from "../components/ProjectChatModal";
import salesApi from "../services/salesApi";

const PAGE_SIZE = 9;

const STATUS_STYLES = {
  PENDING: "border-zinc-700/70 bg-zinc-800/70 text-zinc-300",
  APPLIED: "border-sky-500/30 bg-sky-500/10 text-sky-300",
  PO_ISSUED: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  LIVE: "border-teal-500/30 bg-teal-500/10 text-teal-300",
  REJECTED: "border-rose-500/25 bg-rose-500/[0.08] text-rose-300"
};

const STATUS_DOTS = {
  PENDING: "bg-zinc-400",
  APPLIED: "bg-sky-400",
  PO_ISSUED: "bg-emerald-400",
  LIVE: "bg-teal-400",
  REJECTED: "bg-rose-400"
};

const fileTone = (name = "") => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "bg-rose-500/10 text-rose-400";
  if (["xls", "xlsx", "csv"].includes(ext)) return "bg-emerald-500/10 text-emerald-400";
  if (["doc", "docx"].includes(ext)) return "bg-sky-500/10 text-sky-400";
  if (["png", "jpg", "jpeg", "webp", "svg"].includes(ext)) return "bg-violet-500/10 text-violet-400";
  return "bg-zinc-500/10 text-zinc-400";
};

const statusLabel = (status) => (status || "PENDING").replace("_", " ");

function StatusPill({ status }) {
  const key = status || "PENDING";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] ${
        STATUS_STYLES[key] || STATUS_STYLES.PENDING
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOTS[key] || STATUS_DOTS.PENDING}`} />
      {statusLabel(key)}
    </span>
  );
}

function SearchField({ value, onChange, placeholder }) {
  return (
    <div className="relative w-full sm:max-w-[280px]">
      <Search
        size={15}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-zinc-800 bg-zinc-950/70 py-2.5 pl-9 pr-9 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-600 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
        >
          <X size={13} />
        </button>
      )}
    </div>
  );
}

function CardSkeleton({ amber = false }) {
  return (
    <div
      className={`rounded-2xl border bg-zinc-900/60 p-4 ${
        amber ? "border-amber-900/30" : "border-zinc-800"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className={`skeleton h-10 w-10 rounded-xl ${amber ? "bg-amber-500/10" : "bg-zinc-800/60"}`} />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="skeleton mt-4 h-3 w-3/4 rounded-full" />
      <div className="skeleton mt-2 h-2.5 w-1/2 rounded-full opacity-70" />
      <div className="mt-4 flex items-center justify-between border-t border-zinc-800/70 pt-3">
        <div className="skeleton h-2.5 w-16 rounded-full" />
        <div className="skeleton h-2.5 w-8 rounded-full" />
      </div>
    </div>
  );
}

function CardGridSkeleton({ count = 6, amber = false }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} amber={amber} />
      ))}
    </div>
  );
}

function TenderCard({ tender, pending = false, onOpen }) {
  const docs = tender.tenderDocs?.length || 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex flex-col rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30 ${
        pending
          ? "border-amber-900/40 bg-amber-500/[0.03] hover:border-amber-500/40 hover:bg-amber-500/[0.06]"
          : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-900"
      }`}
    >
      <span className="flex items-start justify-between gap-2">
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${
            pending
              ? "border-amber-900/50 bg-amber-500/10 text-amber-400"
              : "border-zinc-800 bg-zinc-950 text-zinc-400 group-hover:text-emerald-400"
          }`}
        >
          {pending ? <FileCheck2 size={17} /> : <ClipboardList size={17} />}
        </span>
        {pending ? (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-amber-400">
            CEO APPROVED
          </span>
        ) : (
          <StatusPill status={tender.status} />
        )}
      </span>

      <span className="mt-4 line-clamp-2 text-sm font-semibold leading-5 text-zinc-100">
        {tender.title || "Untitled tender"}
      </span>
      <span className="mt-1 truncate text-xs text-zinc-500">
        {tender.client?.name || "Unknown client"}
      </span>

      <span className="mt-4 flex items-center justify-between border-t border-zinc-800/70 pt-3">
        <span className="truncate font-mono text-[11px] text-zinc-500">{tender.code}</span>
        <span className="flex shrink-0 items-center gap-2 text-[11px] text-zinc-500">
          {docs > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip size={11} />
              {docs}
            </span>
          )}
          {pending ? (
            <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
              Upload PO
              <ArrowUpRight size={12} />
            </span>
          ) : (
            <ArrowUpRight
              size={14}
              className="text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400"
            />
          )}
        </span>
      </span>
    </button>
  );
}

function ClientCard({ client, onOpen }) {
  const docs = client.clientDocs?.length || 0;

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 text-left transition hover:-translate-y-0.5 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl hover:shadow-black/30"
    >
      <span className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 transition group-hover:text-sky-400">
          <Building2 size={17} />
        </span>
        <span className="rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-zinc-400">
          {client.type || "Client"}
        </span>
      </span>

      <span className="mt-4 line-clamp-2 text-sm font-semibold leading-5 text-zinc-100">
        {client.name}
      </span>
      <span className="mt-1 inline-flex items-center gap-1.5 truncate text-xs text-zinc-500">
        <Phone size={11} className="shrink-0" />
        {client.contactNo || "No contact number"}
      </span>

      <span className="mt-4 flex items-center justify-between border-t border-zinc-800/70 pt-3">
        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
          <Paperclip size={11} />
          {docs} {docs === 1 ? "document" : "documents"}
        </span>
        <ArrowUpRight
          size={14}
          className="text-zinc-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-sky-400"
        />
      </span>
    </button>
  );
}

function ProjectCard({ project, onJoinChat }) {
  const clientName = project.client?.name;
  const tenderTitle = project.tender?.title;

  return (
    <div className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 transition hover:border-emerald-500/30 hover:bg-zinc-900">
      <span className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-400 transition group-hover:text-emerald-400">
          <FolderKanban size={17} />
        </span>
        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-emerald-300">
          {project.status || "ACTIVE"}
        </span>
      </span>

      <span className="mt-4 line-clamp-2 text-sm font-semibold leading-5 text-zinc-100">
        {project.projectName || "Untitled project"}
      </span>
      <span className="mt-1 truncate font-mono text-[11px] text-zinc-500">
        {project.projectCode}
      </span>

      <span className="mt-4 flex items-center justify-between gap-2 border-t border-zinc-800/70 pt-3">
        <span
          className="min-w-0 truncate text-[11px] text-zinc-500"
          title={clientName || tenderTitle || ""}
        >
          {clientName || tenderTitle || "Project workspace"}
        </span>
        <button
          type="button"
          onClick={onJoinChat}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-500"
        >
          <MessageSquare size={12} />
          Join chat
        </button>
      </span>
    </div>
  );
}

function DocumentCard({ doc, onDownload, onDelete }) {
  const ext = doc.originalName?.split(".").pop()?.toLowerCase() || "file";

  return (
    <li className="flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-900/70 p-2.5 transition hover:border-zinc-700 hover:bg-zinc-800/60">
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${fileTone(doc.originalName)}`}>
        <FileText size={14} />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className="block truncate text-xs font-medium text-zinc-200"
          title={doc.originalName}
        >
          {doc.originalName}
        </span>
        <span className="block text-[10px] uppercase tracking-[0.1em] text-zinc-500">
          {ext}
        </span>
      </span>

      <span className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => onDownload(doc)}
          className="rounded-md p-1.5 text-zinc-500 transition hover:bg-emerald-500/10 hover:text-emerald-400"
          title="Download file"
        >
          <Download size={14} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(doc)}
          className="rounded-md p-1.5 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400"
          title="Delete file"
        >
          <Trash2 size={14} />
        </button>
      </span>
    </li>
  );
}

function AttachmentPanel({
  title,
  docs,
  uploading,
  emptyHint,
  onChange,
  onDownload,
  onDelete
}) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FolderOpen size={14} className="text-zinc-500" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {title}
          </span>
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium tabular-nums text-zinc-400">
            {docs.length}
          </span>
        </div>

        <label
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed px-3 py-1.5 text-xs font-semibold transition ${
            uploading
              ? "border-zinc-800 text-zinc-500"
              : "border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:border-emerald-400/60 hover:bg-emerald-500/10"
          }`}
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          {uploading ? "Uploading…" : "Add files"}
          <input
            type="file"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={onChange}
          />
        </label>
      </div>

      {docs.length === 0 ? (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/40 px-4 py-4">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-900 text-zinc-600">
            <FilePlus2 size={16} />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-medium text-zinc-300">No documents attached yet</p>
            <p className="mt-0.5 text-[11px] leading-5 text-zinc-500">{emptyHint}</p>
          </div>
        </div>
      ) : (
        <ul className="grid gap-2">
          {docs.map((doc) => (
            <DocumentCard
              key={doc._id}
              doc={doc}
              onDownload={onDownload}
              onDelete={onDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function PoPanel({ selectedFiles, sending, onPick, onSend }) {
  return (
    <div className="rounded-xl border border-amber-900/40 bg-amber-500/[0.04] p-4">
      <div className="flex items-center gap-2">
        <FileCheck2 size={15} className="text-amber-400" />
        <h3 className="text-sm font-medium text-zinc-100">Upload winning purchase order</h3>
      </div>
      <p className="mt-1 text-xs leading-5 text-zinc-500">
        Attach the signed PO to move this tender into project conversion.
      </p>

      <label
        className={`mt-3 flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-3 py-3 transition ${
          sending
            ? "border-zinc-800 bg-zinc-900/40"
            : "border-zinc-700 bg-zinc-900/60 hover:border-amber-500/50 hover:bg-amber-500/[0.04]"
        }`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-zinc-800 text-zinc-400">
          <FilePlus2 size={16} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-zinc-200">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} document(s) ready`
              : "Browse PO documents"}
          </span>
          <span className="block truncate text-[11px] text-zinc-500">
            {selectedFiles.length > 0
              ? selectedFiles.map((file) => file.name).join(", ")
              : "PDF, DOCX, scans — multiple files supported"}
          </span>
        </span>
        <input
          type="file"
          multiple
          className="hidden"
          disabled={sending}
          onChange={onPick}
        />
      </label>

      <button
        type="button"
        onClick={onSend}
        disabled={sending || selectedFiles.length === 0}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-amber-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {sending ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Send to CEO
            <Send size={15} />
          </>
        )}
      </button>
    </div>
  );
}

function Drawer({ open, eyebrow, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="overlay-in absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="drawer-in relative flex h-full w-full flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl sm:max-w-md"
      >
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 px-5 py-4">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
              {eyebrow}
            </p>
            <h2 className="mt-1 truncate text-base font-semibold text-zinc-100">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-100"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </aside>
    </div>
  );
}

function MetaTile({ label, children }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{label}</p>
      <p className="mt-1 truncate text-xs font-medium text-zinc-200">{children}</p>
    </div>
  );
}

function SectionHeading({ eyebrow, accent = "text-zinc-500", title, meta }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${accent}`}>
          {eyebrow}
        </p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">{title}</h2>
      </div>
      {meta}
    </div>
  );
}

function LoadingChip({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
      <Loader2 size={12} className="animate-spin" />
      {label}
    </span>
  );
}

function EmptyState({ icon, tone, title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 px-5 py-12 text-center">
      <span className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
        {icon}
      </span>
      <h3 className="mt-4 text-sm font-semibold text-zinc-200">{title}</h3>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-zinc-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const [tenders, setTenders] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);

  const [tendersLoading, setTendersLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [activeTenderId, setActiveTenderId] = useState(null);
  const [activeClientId, setActiveClientId] = useState(null);
  const [activeProjectCode, setActiveProjectCode] = useState(null);
  const [busyKey, setBusyKey] = useState(null);

  const [tenderQuery, setTenderQuery] = useState("");
  const [tenderStatus, setTenderStatus] = useState("ALL");
  const [tenderLimit, setTenderLimit] = useState(PAGE_SIZE);

  const [clientQuery, setClientQuery] = useState("");
  const [clientLimit, setClientLimit] = useState(PAGE_SIZE);

  // State to hold pending PO file selections before sending to CEO
  const [poFileSelections, setPoFileSelections] = useState({});

  const fetchAll = useCallback(async () => {
    const [tenderResult, clientResult, projectResult] = await Promise.allSettled([
      salesApi.get("/tenders/getTenders"),
      salesApi.get("/clients/getAllClients"),
      salesApi.get("/projects")
    ]);
    return { tenderResult, clientResult, projectResult };
  }, []);

  const applyResults = useCallback(({ tenderResult, clientResult, projectResult }) => {
    if (tenderResult.status === "fulfilled") {
      setTenders(tenderResult.value.data);
    } else {
      console.error(tenderResult.reason);
    }

    if (clientResult.status === "fulfilled") {
      setClients(clientResult.value.data);
    } else {
      console.error(clientResult.reason);
    }

    if (projectResult.status === "fulfilled") {
      setProjects(projectResult.value.data);
    } else {
      console.error(projectResult.reason);
    }

    setLoadError(
      tenderResult.status === "rejected" ||
        clientResult.status === "rejected" ||
        projectResult.status === "rejected"
    );
    setTendersLoading(false);
    setClientsLoading(false);
    setProjectsLoading(false);
  }, []);

  useEffect(() => {
    let active = true;
    fetchAll().then((results) => {
      if (active) applyResults(results);
    });
    return () => {
      active = false;
    };
  }, [fetchAll, applyResults]);

  const handleRefresh = async () => {
    setTendersLoading(true);
    setClientsLoading(true);
    setProjectsLoading(true);
    setLoadError(false);
    applyResults(await fetchAll());
  };

  const activeTender = tenders.find((t) => t._id === activeTenderId) || null;
  const activeClient = clients.find((c) => c._id === activeClientId) || null;
  const activeProject =
    projects.find((p) => p.projectCode === activeProjectCode) || null;
  const isDrawerOpen = Boolean(activeTender || activeClient);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setActiveTenderId(null);
        setActiveClientId(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isDrawerOpen]);

  const isRefreshing = tendersLoading || clientsLoading || projectsLoading;

  // --- DOWNLOAD HANDLER ---
  const handleDownloadFile = async (routePrefix, fileKey, originalName) => {
    try {
      const res = await salesApi.get(`/${routePrefix}/download-file`, {
        params: { fileKey, originalName }
      });

      const link = document.createElement("a");
      link.href = res.data.url;
      link.setAttribute("download", originalName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error("Failed to fetch secure download link", err);
    }
  };

  // --- TENDER FILE HANDLERS ---
  const handleAddTenderFile = async (e, tenderId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("tenderDocs", file));

    setBusyKey(`tender-files-${tenderId}`);
    try {
      const res = await salesApi.post(`/tenders/${tenderId}/files`, formData);
      setTenders((prev) => prev.map((t) => (t._id === tenderId ? res.data : t)));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setBusyKey(null);
      e.target.value = null;
    }
  };

  const handleDeleteTenderFile = async (tenderId, fileKey) => {
    try {
      const res = await salesApi.delete(`/tenders/${tenderId}/files`, { data: { fileKey } });
      setTenders((prev) => prev.map((t) => (t._id === tenderId ? res.data : t)));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // --- CLIENT FILE HANDLERS ---
  const handleAddClientFile = async (e, clientId) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("clientDocs", file));

    setBusyKey(`client-files-${clientId}`);
    try {
      const res = await salesApi.post(`/clients/${clientId}/files`, formData);
      setClients((prev) => prev.map((c) => (c._id === clientId ? res.data : c)));
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setBusyKey(null);
      e.target.value = null;
    }
  };

  const handleDeleteClientFile = async (clientId, fileKey) => {
    try {
      const res = await salesApi.delete(`/clients/${clientId}/files`, { data: { fileKey } });
      setClients((prev) => prev.map((c) => (c._id === clientId ? res.data : c)));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // --- PO ISSUED HANDLER (Send to CEO) ---
  const handlePoFileChange = (e, tenderId) => {
    const files = e.target.files;
    if (files) {
      setPoFileSelections((prev) => ({
        ...prev,
        [tenderId]: Array.from(files)
      }));
    }
  };

  const handleSendToCEO = async (tenderId) => {
    const files = poFileSelections[tenderId];
    if (!files || files.length === 0) {
      alert("Please upload at least one Purchase Order (PO) document.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("poDocs", file));

    setBusyKey(`po-${tenderId}`);
    try {
      const res = await salesApi.post(`/tenders/${tenderId}/po-issued`, formData);
      // Update tender list with the returned tender (which now has status PO_ISSUED)
      setTenders((prev) => prev.map((t) => (t._id === tenderId ? res.data.tender : t)));

      // Clear selection and close the drawer
      setPoFileSelections((prev) => {
        const newState = { ...prev };
        delete newState[tenderId];
        return newState;
      });
      setActiveTenderId(null);
    } catch (err) {
      console.error("Failed to send PO to CEO", err);
      alert("Failed to send PO to CEO. Check console.");
    } finally {
      setBusyKey(null);
    }
  };

  const pendingPoTenders = useMemo(
    () => tenders.filter((t) => t.status === "APPLIED"),
    [tenders]
  );

  const generalTenders = useMemo(
    () => tenders.filter((t) => t.status !== "APPLIED"),
    [tenders]
  );

  const statusCounts = useMemo(() => {
    const counts = {};
    generalTenders.forEach((tender) => {
      const key = tender.status || "PENDING";
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [generalTenders]);

  const filteredTenders = useMemo(() => {
    const query = tenderQuery.trim().toLowerCase();

    return generalTenders.filter((tender) => {
      if (tenderStatus !== "ALL" && (tender.status || "PENDING") !== tenderStatus) {
        return false;
      }
      if (!query) return true;

      return (
        (tender.title || "").toLowerCase().includes(query) ||
        (tender.code || "").toLowerCase().includes(query) ||
        (tender.client?.name || "").toLowerCase().includes(query)
      );
    });
  }, [generalTenders, tenderQuery, tenderStatus]);

  const visibleTenders = filteredTenders.slice(0, tenderLimit);
  const remainingTenders = filteredTenders.length - visibleTenders.length;

  const filteredClients = useMemo(() => {
    const query = clientQuery.trim().toLowerCase();
    if (!query) return clients;

    return clients.filter(
      (client) =>
        (client.name || "").toLowerCase().includes(query) ||
        (client.type || "").toLowerCase().includes(query) ||
        (client.contactNo || "").toLowerCase().includes(query)
    );
  }, [clients, clientQuery]);

  const visibleClients = filteredClients.slice(0, clientLimit);
  const remainingClients = filteredClients.length - visibleClients.length;

  const tenderFilterChips = [
    { key: "ALL", label: "All", count: generalTenders.length },
    ...Object.entries(statusCounts).map(([key, count]) => ({
      key,
      label: statusLabel(key),
      count
    }))
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Ambient backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[520px] w-[840px] -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[130px]" />
        <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.045)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 py-7 sm:px-8 lg:px-10">
        <Header eyebrow="OVERVIEW" />

        <section className="grid gap-10 pb-14 pt-12 md:grid-cols-[1.25fr_0.75fr] md:items-end md:pt-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur">
              <Sparkles size={13} className="text-emerald-400" />
              Your tender desk
            </div>

            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              Good work starts with a{" "}
              <span className="text-emerald-400">clear record.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400 sm:text-lg">
              Keep tender details, client contacts, and the next steps in one quiet,
              organised workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/sales/tenders/new")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 transition hover:-translate-y-0.5 hover:bg-emerald-500 hover:shadow-emerald-900/40"
              >
                <FilePlus2 size={17} />
                Add Tender
                <ArrowUpRight size={16} />
              </button>

              <Link
                to="/sales/clients/new"
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-3.5 text-sm font-semibold text-zinc-300 transition hover:-translate-y-0.5 hover:border-zinc-700 hover:text-zinc-100"
              >
                <Users size={16} />
                Add a client
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-900/50 p-5 shadow-2xl shadow-black/40 sm:p-6">
            <div
              aria-hidden
              className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-300">Workspace snapshot</span>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  title="Refresh workspace"
                  className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2 text-zinc-500 transition hover:border-zinc-700 hover:text-emerald-400 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isRefreshing ? "animate-spin" : ""} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Metric label="Tenders saved" value={tenders.length} loading={tendersLoading} />
                <Metric label="Client records" value={clients.length} loading={clientsLoading} />
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-zinc-800/60 bg-zinc-950/70 p-4">
                <span className="mt-0.5 rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
                  <Users size={16} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-200">Start with your client list</p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    Company and CEO records power the linked fields in each tender.
                  </p>
                  <Link
                    to="/sales/clients/new"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    Add a client <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {loadError && (
          <div className="mb-10 flex items-center justify-between gap-3 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-3">
            <div className="flex items-center gap-2.5 text-sm text-rose-300">
              <AlertTriangle size={16} />
              Couldn't load the workspace. Check your connection and try again.
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="shrink-0 rounded-lg border border-rose-500/30 px-3 py-1.5 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10"
            >
              Retry
            </button>
          </div>
        )}

        {/* --- ACTION REQUIRED: APPROVED BIDS (AWAITING PO) --- */}
        {pendingPoTenders.length > 0 && (
          <section className="mb-14 border-t border-zinc-800 pt-7">
            <SectionHeading
              eyebrow="Action required"
              accent="text-amber-500"
              title="Winning bids (awaiting PO)"
              meta={
                <span className="text-xs font-medium text-amber-500">
                  {pendingPoTenders.length} pending
                </span>
              }
            />

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pendingPoTenders.map((tender) => (
                <TenderCard
                  key={tender._id}
                  tender={tender}
                  pending
                  onOpen={() => setActiveTenderId(tender._id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* --- TENDERS SECTION --- */}
        <section className="mb-14 border-t border-zinc-800 pt-7">
          <SectionHeading
            eyebrow="Recent activity"
            title="Your tenders"
            meta={
              tendersLoading ? (
                <LoadingChip label="Loading tenders…" />
              ) : (
                <span className="text-xs tabular-nums text-zinc-500">
                  {filteredTenders.length === generalTenders.length
                    ? `${generalTenders.length} total`
                    : `${filteredTenders.length} of ${generalTenders.length}`}
                </span>
              )
            }
          />

          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchField
              value={tenderQuery}
              onChange={(value) => {
                setTenderQuery(value);
                setTenderLimit(PAGE_SIZE);
              }}
              placeholder="Search title, client, or code…"
            />

            {!tendersLoading && generalTenders.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {tenderFilterChips.map((chip) => {
                  const isActive = tenderStatus === chip.key;
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => {
                        setTenderStatus(chip.key);
                        setTenderLimit(PAGE_SIZE);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                        isActive
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                      }`}
                    >
                      {chip.label}
                      <span
                        className={`tabular-nums ${
                          isActive ? "text-emerald-400/70" : "text-zinc-600"
                        }`}
                      >
                        {chip.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {tendersLoading ? (
            <CardGridSkeleton count={6} />
          ) : generalTenders.length === 0 ? (
            <EmptyState
              icon={<ClipboardList size={21} />}
              tone="bg-emerald-500/10 text-emerald-400"
              title="No tenders yet"
              description="Add your first tender and it will appear here for quick access."
              action={
                <button
                  type="button"
                  onClick={() => navigate("/sales/tenders/new")}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                >
                  <Plus size={14} />
                  Add Tender
                </button>
              }
            />
          ) : filteredTenders.length === 0 ? (
            <EmptyState
              icon={<Search size={20} />}
              tone="bg-zinc-800 text-zinc-400"
              title="No matching tenders"
              description="Try a different search term or clear the status filter."
              action={
                <button
                  type="button"
                  onClick={() => {
                    setTenderQuery("");
                    setTenderStatus("ALL");
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
                >
                  <X size={13} />
                  Clear filters
                </button>
              }
            />
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleTenders.map((tender) => (
                  <TenderCard
                    key={tender._id}
                    tender={tender}
                    onOpen={() => setActiveTenderId(tender._id)}
                  />
                ))}
              </div>

              {remainingTenders > 0 && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setTenderLimit((limit) => limit + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
                  >
                    <ChevronDown size={14} />
                    Show {Math.min(remainingTenders, PAGE_SIZE)} more
                    <span className="text-zinc-600">· {remainingTenders} left</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* --- PROJECTS / CHATROOMS SECTION --- */}
        <section className="mb-14 border-t border-zinc-800 pt-7">
          <SectionHeading
            eyebrow="Workspaces"
            accent="text-emerald-500"
            title="Project chat rooms"
            meta={
              projectsLoading ? (
                <LoadingChip label="Loading projects…" />
              ) : (
                <span className="text-xs tabular-nums text-zinc-500">
                  {projects.length} active
                </span>
              )
            }
          />

          <p className="mb-4 text-xs leading-5 text-zinc-500">
            Every project has a room named after its project code. Join with your
            name and email to start chatting with the project team.
          </p>

          {projectsLoading ? (
            <CardGridSkeleton count={3} />
          ) : projects.length === 0 ? (
            <EmptyState
              icon={<FolderKanban size={21} />}
              tone="bg-emerald-500/10 text-emerald-400"
              title="No active projects yet"
              description="Convert a won tender into a project and it will get its own chat room here."
            />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onJoinChat={() => setActiveProjectCode(project.projectCode)}
                />
              ))}
            </div>
          )}
        </section>

        {/* --- CLIENTS SECTION --- */}
        <section className="border-t border-zinc-800 pt-7">
          <SectionHeading
            eyebrow="Directory"
            title="Client profiles"
            meta={
              clientsLoading ? (
                <LoadingChip label="Loading clients…" />
              ) : (
                <span className="text-xs tabular-nums text-zinc-500">
                  {filteredClients.length === clients.length
                    ? `${clients.length} total`
                    : `${filteredClients.length} of ${clients.length}`}
                </span>
              )
            }
          />

          <div className="mb-4">
            <SearchField
              value={clientQuery}
              onChange={(value) => {
                setClientQuery(value);
                setClientLimit(PAGE_SIZE);
              }}
              placeholder="Search client, type, or contact…"
            />
          </div>

          {clientsLoading ? (
            <CardGridSkeleton count={6} />
          ) : clients.length === 0 ? (
            <EmptyState
              icon={<Users size={21} />}
              tone="bg-sky-500/10 text-sky-400"
              title="No clients yet"
              description="Add a client so tenders can link to the right company and contact."
              action={
                <Link
                  to="/sales/clients/new"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500"
                >
                  <Plus size={14} />
                  Add Client
                </Link>
              }
            />
          ) : filteredClients.length === 0 ? (
            <EmptyState
              icon={<Search size={20} />}
              tone="bg-zinc-800 text-zinc-400"
              title="No matching clients"
              description="Try a different name, type, or contact number."
              action={
                <button
                  type="button"
                  onClick={() => setClientQuery("")}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-4 py-2 text-xs font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
                >
                  <X size={13} />
                  Clear search
                </button>
              }
            />
          ) : (
            <>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {visibleClients.map((client) => (
                  <ClientCard
                    key={client._id}
                    client={client}
                    onOpen={() => setActiveClientId(client._id)}
                  />
                ))}
              </div>

              {remainingClients > 0 && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setClientLimit((limit) => limit + PAGE_SIZE)}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-zinc-100"
                  >
                    <ChevronDown size={14} />
                    Show {Math.min(remainingClients, PAGE_SIZE)} more
                    <span className="text-zinc-600">· {remainingClients} left</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <footer className="mt-12 flex flex-col gap-2 border-t border-zinc-800 pt-5 text-xs text-zinc-500 sm:flex-row sm:justify-between">
          <span>Vikram Engineering · Internal workspace</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Client-linked tender records
          </span>
        </footer>
      </div>

      {activeTender && (
        <Drawer
          open
          eyebrow="Tender record"
          title={activeTender.title || "Untitled tender"}
          onClose={() => setActiveTenderId(null)}
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              {activeTender.status === "APPLIED" ? (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] text-amber-400">
                  CEO APPROVED
                </span>
              ) : (
                <StatusPill status={activeTender.status} />
              )}
              <span className="rounded-full border border-zinc-800 bg-zinc-950/60 px-2.5 py-1 font-mono text-[11px] text-zinc-400">
                {activeTender.code}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <MetaTile label="Client">{activeTender.client?.name || "Unknown client"}</MetaTile>
              <MetaTile label="Documents">
                {(activeTender.tenderDocs || []).length} attached
              </MetaTile>
            </div>

            {activeTender.status === "APPLIED" && (
              <PoPanel
                selectedFiles={poFileSelections[activeTender._id] || []}
                sending={busyKey === `po-${activeTender._id}`}
                onPick={(e) => handlePoFileChange(e, activeTender._id)}
                onSend={() => handleSendToCEO(activeTender._id)}
              />
            )}

            <AttachmentPanel
              title="Tender attachments"
              docs={activeTender.tenderDocs || []}
              uploading={busyKey === `tender-files-${activeTender._id}`}
              emptyHint="Add the tender brief, BOQ, or bid documents to keep this record complete."
              onChange={(e) => handleAddTenderFile(e, activeTender._id)}
              onDownload={(doc) =>
                handleDownloadFile("tenders", doc.key, doc.originalName)
              }
              onDelete={(doc) => handleDeleteTenderFile(activeTender._id, doc.key)}
            />
          </div>
        </Drawer>
      )}

      {activeClient && (
        <Drawer
          open
          eyebrow="Client record"
          title={activeClient.name}
          onClose={() => setActiveClientId(null)}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-2">
              <MetaTile label="Type">{activeClient.type || "Client"}</MetaTile>
              <MetaTile label="Contact">
                <span className="inline-flex items-center gap-1.5">
                  <Phone size={11} className="text-zinc-500" />
                  {activeClient.contactNo || "—"}
                </span>
              </MetaTile>
            </div>

            <AttachmentPanel
              title="Client documents"
              docs={activeClient.clientDocs || []}
              uploading={busyKey === `client-files-${activeClient._id}`}
              emptyHint="Keep contracts, registrations, and contact records attached to this client."
              onChange={(e) => handleAddClientFile(e, activeClient._id)}
              onDownload={(doc) =>
                handleDownloadFile("clients", doc.key, doc.originalName)
              }
              onDelete={(doc) => handleDeleteClientFile(activeClient._id, doc.key)}
            />
          </div>
        </Drawer>
      )}

      {activeProject && (
        <ProjectChatModal
          project={activeProject}
          onClose={() => setActiveProjectCode(null)}
        />
      )}
    </main>
  );
}
