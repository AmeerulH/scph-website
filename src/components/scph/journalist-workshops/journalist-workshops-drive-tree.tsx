"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  File,
  Folder,
  FolderOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
// Import types only — no googleapis in the client bundle.
import type {
  DriveTreeEntry,
  DriveTreeFile,
  DriveTreeFolder,
} from "@/lib/google-drive-client";
import { Button } from "@/components/ui/button";

// MIME constants inlined to keep googleapis out of the client bundle.
const GOOGLE_DRIVE_DOCUMENT_MIME = "application/vnd.google-apps.document";
const GOOGLE_DRIVE_PRESENTATION_MIME = "application/vnd.google-apps.presentation";
const GOOGLE_DRIVE_SHORTCUT_MIME = "application/vnd.google-apps.shortcut";
const GOOGLE_DRIVE_SPREADSHEET_MIME = "application/vnd.google-apps.spreadsheet";
const GOOGLE_DRIVE_DRAWING_MIME = "application/vnd.google-apps.drawing";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fileProxyHref(fileId: string, download = false): string {
  const base = `/api/scph/journalist-workshops/file?fileId=${encodeURIComponent(fileId)}`;
  return download ? `${base}&dl=1` : base;
}

function thumbnailHref(fileId: string): string {
  return `/api/scph/journalist-workshops/thumbnail?fileId=${encodeURIComponent(fileId)}`;
}

type PreviewKind = "pdf" | "image" | null;

function previewKind(mime: string): PreviewKind {
  if (mime === GOOGLE_DRIVE_SHORTCUT_MIME) return null;
  if (mime.startsWith("image/") || mime === GOOGLE_DRIVE_DRAWING_MIME) return "image";
  if (mime === "application/pdf") return "pdf";
  return null; // Workspace docs: download-only per design brief
}

type BadgeSpec = { label: string; bg: string; text: string; ring: string };

function fileBadge(mime: string): BadgeSpec {
  if (mime === "application/pdf")
    return { label: "PDF", bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" };
  if (mime === GOOGLE_DRIVE_DOCUMENT_MIME)
    return { label: "Doc", bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" };
  if (mime === GOOGLE_DRIVE_PRESENTATION_MIME)
    return { label: "Slides", bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" };
  if (mime === GOOGLE_DRIVE_SPREADSHEET_MIME)
    return { label: "Sheet", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" };
  if (mime.startsWith("image/") || mime === GOOGLE_DRIVE_DRAWING_MIME)
    return { label: "Image", bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-200" };
  return { label: "File", bg: "bg-gray-50", text: "text-gray-600", ring: "ring-gray-200" };
}

function formatSize(size: string | null): string | null {
  if (!size) return null;
  const n = parseInt(size, 10);
  if (isNaN(n)) return null;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function countFiles(entry: DriveTreeEntry): number {
  if (entry.type === "file") return 1;
  return entry.children.reduce((acc, e) => acc + countFiles(e), 0);
}

// ---------------------------------------------------------------------------
// Folder card
// ---------------------------------------------------------------------------

function FolderCard({
  folder,
  onClick,
}: {
  folder: DriveTreeFolder;
  onClick: () => void;
}) {
  const count = countFiles(folder);
  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-xl border border-scph-blue/10 bg-white/70 p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-scph-blue/30 hover:bg-white/90 hover:shadow-lg hover:shadow-scph-blue/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scph-blue"
      aria-label={`Open folder: ${folder.name}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="rounded-lg bg-amber-50 p-2 text-amber-500 transition-colors group-hover:bg-amber-100 group-hover:text-amber-600">
          <Folder size={17} strokeWidth={1.75} aria-hidden />
        </span>
        <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
          {count === 1 ? "1 file" : `${count} files`}
        </span>
      </div>
      <span className="line-clamp-2 text-sm font-semibold leading-snug text-scph-blue">
        {folder.name}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// File type placeholder (non-previewable files)
// ---------------------------------------------------------------------------

function filePlaceholderSpec(mime: string): { bg: string; iconColor: string; icon: React.ReactElement } {
  if (mime === GOOGLE_DRIVE_DOCUMENT_MIME) return {
    bg: "bg-blue-50/60",
    iconColor: "text-blue-300",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <rect x="10" y="4" width="28" height="36" rx="3" fill="currentColor" opacity="0.2" />
        <path d="M16 16h16M16 22h16M16 28h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30 4v10h8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  };
  if (mime === GOOGLE_DRIVE_PRESENTATION_MIME) return {
    bg: "bg-orange-50/60",
    iconColor: "text-orange-300",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <rect x="6" y="8" width="36" height="26" rx="3" fill="currentColor" opacity="0.2" />
        <rect x="12" y="14" width="24" height="14" rx="1.5" fill="currentColor" opacity="0.15" />
        <path d="M20 38l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="24" y1="34" x2="24" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  };
  if (mime === GOOGLE_DRIVE_SPREADSHEET_MIME) return {
    bg: "bg-emerald-50/60",
    iconColor: "text-emerald-300",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <rect x="8" y="6" width="32" height="36" rx="3" fill="currentColor" opacity="0.2" />
        <line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="1.5" />
        <line x1="8" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="1.5" />
        <line x1="24" y1="6" x2="24" y2="42" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  };
  // Generic file
  return {
    bg: "bg-gray-50/60",
    iconColor: "text-gray-300",
    icon: (
      <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none" aria-hidden>
        <rect x="10" y="4" width="28" height="40" rx="3" fill="currentColor" opacity="0.2" />
        <path d="M16 20h16M16 27h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M30 4v10h8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  };
}

function FilePlaceholder({ mime }: { mime: string }) {
  const spec = filePlaceholderSpec(mime);
  return (
    <div className={cn("flex h-32 w-full items-center justify-center rounded-lg", spec.bg)}>
      <span className={spec.iconColor}>{spec.icon}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Thumbnail zone (lazy image / hover-loaded PDF iframe)
// ---------------------------------------------------------------------------

function ThumbnailZone({
  file,
  onOpen,
}: {
  file: DriveTreeFile;
  onOpen: () => void;
}) {
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { rootMargin: "150px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const kind = previewKind(file.mimeType);
  const thumbSrc = thumbnailHref(file.id);

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label={`Open preview of ${file.name}`}
      onClick={onOpen}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative h-32 w-full cursor-pointer overflow-hidden rounded-lg bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-scph-blue"
    >
      {/* Skeleton shown until content loads */}
      {!loaded && !failed && (
        <div className="absolute inset-0 animate-pulse bg-muted/50" />
      )}

      {/* Fallback placeholder shown when thumbnail unavailable */}
      {failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          {kind === "pdf" ? (
            <svg viewBox="0 0 48 48" className="h-10 w-10 text-red-300/60" fill="none" aria-hidden>
              <rect x="8" y="4" width="32" height="40" rx="3" fill="currentColor" opacity="0.25" />
              <path d="M16 18h16M16 24h16M16 30h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M28 4v10h12" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 48 48" className="h-10 w-10 text-violet-300/60" fill="none" aria-hidden>
              <rect x="6" y="6" width="36" height="36" rx="4" fill="currentColor" opacity="0.15" />
              <path d="M6 30l10-10 8 8 6-6 12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="18" r="3" fill="currentColor" opacity="0.4" />
            </svg>
          )}
        </div>
      )}

      {/* Drive thumbnail — single <img> for both images and PDFs */}
      {inView && !failed && (
        <img
          src={thumbSrc}
          alt=""
          aria-hidden
          className={cn(
            "h-full w-full object-cover transition-opacity duration-300",
            loaded ? "opacity-100" : "opacity-0",
          )}
          onLoad={() => setLoaded(true)}
          onError={() => { setLoaded(false); setFailed(true); }}
        />
      )}

      {/* Hover overlay with "Preview" hint */}
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center transition-all duration-150",
          hovered ? "bg-black/30" : "bg-transparent",
        )}
      >
        <span
          className={cn(
            "rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm transition-all duration-150",
            hovered ? "scale-100 opacity-100" : "scale-90 opacity-0",
          )}
        >
          Open preview
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// File card
// ---------------------------------------------------------------------------

function FileCard({
  file,
  isSelected,
  onClick,
}: {
  file: DriveTreeFile;
  isSelected: boolean;
  onClick: () => void;
}) {
  const downloadHref = fileProxyHref(file.id, true);
  const kind = previewKind(file.mimeType);
  const badge = fileBadge(file.mimeType);
  const size = formatSize(file.size);
  const canPreview = kind !== null;
  const displayName = file.name.replace(/\.[a-zA-Z0-9]{1,5}$/, "");

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-3 transition-all duration-200",
        isSelected
          ? "border-scph-blue bg-white/90 shadow-lg shadow-scph-blue/10 ring-2 ring-scph-blue/20"
          : "border-scph-blue/10 bg-white/70 hover:-translate-y-1 hover:border-scph-blue/30 hover:bg-white/90 hover:shadow-lg hover:shadow-scph-blue/8",
      )}
    >
      {/* Thumbnail for previewable files; type placeholder for the rest */}
      {canPreview ? (
        <ThumbnailZone file={file} onOpen={onClick} />
      ) : (
        <FilePlaceholder mime={file.mimeType} />
      )}

      {/* Badge row */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset",
            badge.bg,
            badge.text,
            badge.ring,
          )}
        >
          {badge.label}
        </span>
        {size && (
          <span className="text-[11px] tabular-nums text-muted-foreground/60">{size}</span>
        )}
      </div>

      {/* File icon + name */}
      <div className="flex min-h-[2.5rem] items-start gap-2.5">
        <File
          size={15}
          strokeWidth={1.75}
          className="mt-0.5 shrink-0 text-muted-foreground/40"
          aria-hidden
        />
        <p className="line-clamp-3 text-sm font-medium leading-snug text-foreground">
          {displayName}
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto flex items-center gap-2 pt-1">
        <a
          href={downloadHref}
          download
          className="inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold text-scph-blue ring-1 ring-scph-blue/30 transition-colors hover:bg-scph-blue hover:text-white hover:ring-transparent focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-scph-blue"
          aria-label={`Download ${file.name}`}
          onClick={(e) => e.stopPropagation()}
        >
          <Download size={11} strokeWidth={2.5} aria-hidden />
          Download
        </a>
        {canPreview && (
          <button
            onClick={onClick}
            className="inline-flex h-7 items-center rounded-full px-3 text-[12px] font-semibold text-muted-foreground ring-1 ring-border transition-all hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-scph-blue"
            aria-label={`Preview ${file.name}`}
          >
            Preview
          </button>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Breadcrumb
// ---------------------------------------------------------------------------

function Breadcrumb({
  stack,
  onNavigate,
}: {
  stack: DriveTreeFolder[];
  onNavigate: (depth: number) => void;
}) {
  return (
    <nav aria-label="Folder path" className="flex flex-wrap items-center gap-0.5">
      {stack.map((folder, i) => (
        <span key={folder.id} className="flex items-center gap-0.5">
          {i > 0 && (
            <ChevronRight
              size={12}
              strokeWidth={2}
              className="text-muted-foreground/40"
              aria-hidden
            />
          )}
          {i === stack.length - 1 ? (
            <span className="text-sm font-semibold text-scph-blue">{folder.name}</span>
          ) : (
            <button
              onClick={() => onNavigate(i)}
              className="rounded-full px-2 py-0.5 text-sm text-muted-foreground transition-colors hover:text-scph-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-scph-blue"
            >
              {folder.name}
            </button>
          )}
        </span>
      ))}
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Preview panel (slide-over from right)
// ---------------------------------------------------------------------------

type SelectedFile = DriveTreeFile & { href: string; downloadHref: string; kind: PreviewKind };

function PreviewPanel({
  file,
  onClose,
}: {
  file: SelectedFile | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [loading, setLoading] = useState(true);
  useEffect(() => { setLoading(true); }, [file?.id]);

  if (!file || !mounted) return null;

  const badge = fileBadge(file.mimeType);
  const size = formatSize(file.size);
  const displayName = file.name.replace(/\.[a-zA-Z0-9]{1,5}$/, "");

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Preview: ${file.name}`}
        className="fixed inset-y-0 right-0 z-[9999] flex w-full max-w-lg flex-col bg-white shadow-2xl shadow-black/10 animate-in slide-in-from-right duration-300"
      >
        {/* Panel header */}
        <div className="flex items-start justify-between gap-4 border-b border-border/50 px-5 py-4">
          <div className="min-w-0 space-y-0.5">
            <p className="truncate text-sm font-semibold leading-snug text-foreground">
              {displayName}
            </p>
            <p className="text-[11px] text-muted-foreground">
              <span
                className={cn(
                  "mr-1.5 inline-flex items-center rounded px-1.5 py-px text-[10px] font-bold uppercase tracking-widest ring-1 ring-inset",
                  badge.bg,
                  badge.text,
                  badge.ring,
                )}
              >
                {badge.label}
              </span>
              {size}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-scph-blue"
            aria-label="Close preview"
          >
            <X size={16} strokeWidth={2} aria-hidden />
          </button>
        </div>

        {/* Preview content */}
        <div className="relative flex-1 overflow-hidden bg-muted/20">
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white">
              <svg
                className="h-8 w-8 animate-spin text-scph-blue/40"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
              <p className="text-xs text-muted-foreground">Loading preview…</p>
            </div>
          )}
          {file.kind === "pdf" ? (
            <iframe
              key={file.href}
              title={`Preview: ${file.name}`}
              src={file.href}
              className="h-full w-full border-0 bg-white"
              onLoad={() => setLoading(false)}
            />
          ) : file.kind === "image" ? (
            <div className="flex h-full items-center justify-center p-6">
              <img
                key={file.href}
                src={file.href}
                alt={file.name}
                className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
                onLoad={() => setLoading(false)}
              />
            </div>
          ) : null}
        </div>

        {/* Panel footer */}
        <div className="border-t border-border/50 px-5 py-4">
          <a
            href={file.downloadHref}
            download
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-scph-blue text-sm font-semibold text-white shadow-sm transition-colors hover:bg-scph-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scph-blue"
          >
            <Download size={14} strokeWidth={2.5} aria-hidden />
            Download
          </a>
        </div>
      </div>
    </>,
    document.body,
  );
}

// ---------------------------------------------------------------------------
// Root component
// ---------------------------------------------------------------------------

export function JournalistWorkshopsDriveTree({
  root,
  workshopTitle,
}: {
  root: DriveTreeFolder;
  workshopTitle: string;
}) {
  const router = useRouter();
  const [stack, setStack] = useState<DriveTreeFolder[]>([root]);
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [signOutPending, setSignOutPending] = useState(false);

  const currentFolder = stack[stack.length - 1];
  const folders = currentFolder.children.filter(
    (e): e is DriveTreeFolder => e.type === "folder",
  );
  const files = currentFolder.children.filter(
    (e): e is DriveTreeFile => e.type === "file",
  );
  const isEmpty = folders.length === 0 && files.length === 0;

  const navigateTo = useCallback((folder: DriveTreeFolder) => {
    setStack((prev) => [...prev, folder]);
    setSelected(null);
  }, []);

  const navigateBack = useCallback((depth: number) => {
    setStack((prev) => prev.slice(0, depth + 1));
    setSelected(null);
  }, []);

  const selectFile = useCallback((file: DriveTreeFile) => {
    const kind = previewKind(file.mimeType);
    if (!kind) return;
    setSelected({ ...file, href: fileProxyHref(file.id, false), downloadHref: fileProxyHref(file.id, true), kind });
  }, []);

  const closePreview = useCallback(() => setSelected(null), []);

  async function onSignOut() {
    setSignOutPending(true);
    try {
      await fetch("/api/scph/journalist-workshops/logout", {
        method: "POST",
        credentials: "include",
      });
      router.refresh();
    } finally {
      setSignOutPending(false);
    }
  }

  return (
    <div className="relative">
      {/* Gradient backing so backdrop-blur has colour to refract */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-scph-blue/[0.07] via-sky-100/40 to-emerald-50/50" aria-hidden />
      {/* Browser chrome wrapper */}
      <div className="relative overflow-hidden rounded-2xl border border-scph-blue/10 bg-white/50 shadow-md backdrop-blur-xl backdrop-saturate-200">

        {/* Header: workshop title + sign-out */}
        <div className="flex items-center justify-between gap-4 border-b border-scph-blue/8 bg-scph-blue/[0.03] px-5 py-5">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-scph-blue">
              {workshopTitle}
            </p>
            <p className="text-sm text-muted-foreground">Workshop materials</p>
          </div>
          <Button
            type="button"
            variant="scphOutline"
            size="sm"
            disabled={signOutPending}
            onClick={onSignOut}
            className="shrink-0 rounded-full text-xs"
          >
            {signOutPending ? "Signing out…" : "Sign out"}
          </Button>
        </div>

        {/* Breadcrumb bar — only visible when navigated into a subfolder */}
        {stack.length > 1 && (
          <div className="flex items-center gap-2 border-b border-scph-blue/8 bg-scph-blue/[0.02] px-4 py-2.5">
            <button
              onClick={() => navigateBack(stack.length - 2)}
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-scph-blue/8 hover:text-scph-blue focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-scph-blue"
              aria-label="Go back"
            >
              <ArrowLeft size={14} strokeWidth={2} aria-hidden />
            </button>
            <Breadcrumb stack={stack} onNavigate={navigateBack} />
          </div>
        )}

        {/* Content area */}
        <div className="p-5">
          {isEmpty ? (
            <div className="flex flex-col items-center gap-3 py-14 text-center">
              <div className="rounded-2xl bg-muted p-5">
                <FolderOpen
                  size={36}
                  strokeWidth={1.25}
                  className="text-muted-foreground/30"
                  aria-hidden
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">
                  This folder is empty
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  Files will appear here once the team uploads them to Drive.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {/* Folders */}
              {folders.length > 0 && (
                <section aria-label="Folders in this workshop">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                    Folders
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {folders.map((folder) => (
                      <FolderCard
                        key={folder.id}
                        folder={folder}
                        onClick={() => navigateTo(folder)}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Files */}
              {files.length > 0 && (
                <section aria-label="Files in this workshop">
                  {folders.length > 0 && (
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                      Files
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        isSelected={selected?.id === file.id}
                        onClick={() => selectFile(file)}
                      />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Slide-over preview panel */}
      <PreviewPanel file={selected} onClose={closePreview} />
    </div>
  );
}
