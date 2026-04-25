"use client";

import { useCallback, useEffect, useState } from "react";
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

function fileProxyHref(fileId: string): string {
  return `/api/scph/journalist-workshops/file?fileId=${encodeURIComponent(fileId)}`;
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
  const href = fileProxyHref(file.id);
  const kind = previewKind(file.mimeType);
  const badge = fileBadge(file.mimeType);
  const size = formatSize(file.size);
  const canPreview = kind !== null;
  // Strip extension from display name for cleanliness
  const displayName = file.name.replace(/\.[a-zA-Z0-9]{1,5}$/, "");

  return (
    <div
      className={cn(
        "group flex flex-col gap-3 rounded-xl border p-4 transition-all duration-200",
        isSelected
          ? "border-scph-blue bg-white/90 shadow-lg shadow-scph-blue/10 ring-2 ring-scph-blue/20"
          : "border-scph-blue/10 bg-white/70 hover:-translate-y-1 hover:border-scph-blue/30 hover:bg-white/90 hover:shadow-lg hover:shadow-scph-blue/8",
      )}
    >
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
          href={href}
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

type SelectedFile = DriveTreeFile & { href: string; kind: PreviewKind };

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

  if (!file) return null;

  const badge = fileBadge(file.mimeType);
  const size = formatSize(file.size);
  const displayName = file.name.replace(/\.[a-zA-Z0-9]{1,5}$/, "");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-scph-blue/[0.06] backdrop-blur-[1px]"
        onClick={onClose}
        aria-hidden
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Preview: ${file.name}`}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col bg-white shadow-2xl shadow-black/10 animate-in slide-in-from-right duration-300"
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
        <div className="flex-1 overflow-hidden bg-muted/20">
          {file.kind === "pdf" ? (
            <iframe
              title={`Preview: ${file.name}`}
              src={file.href}
              className="h-full w-full border-0 bg-white"
            />
          ) : file.kind === "image" ? (
            <div className="flex h-full items-center justify-center p-6">
              <img
                src={file.href}
                alt={file.name}
                className="max-h-full max-w-full rounded-lg object-contain shadow-sm"
              />
            </div>
          ) : null}
        </div>

        {/* Panel footer */}
        <div className="border-t border-border/50 px-5 py-4">
          <a
            href={file.href}
            download
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-full bg-scph-blue text-sm font-semibold text-white shadow-sm transition-colors hover:bg-scph-blue-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-scph-blue"
          >
            <Download size={14} strokeWidth={2.5} aria-hidden />
            Download
          </a>
        </div>
      </div>
    </>
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
    setSelected({ ...file, href: fileProxyHref(file.id), kind });
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
            <p className="truncate text-[13px] font-semibold text-scph-blue">
              {workshopTitle}
            </p>
            <p className="text-[11px] text-muted-foreground">Workshop materials</p>
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
