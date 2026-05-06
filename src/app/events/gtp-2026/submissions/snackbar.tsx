"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, X } from "lucide-react";

interface SnackbarProps {
  show: boolean;
  message: string;
  onClose: () => void;
  /** Omit for manual-dismiss only. Pass ms value for auto-dismiss. */
  duration?: number;
}

export function Snackbar({ show, message, onClose, duration }: SnackbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!show || !duration) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [show, duration, onClose]);

  if (!show || !mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-xl bg-white px-4 py-3 shadow-2xl ring-1 ring-gray-100">
      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      </span>
      <p className="text-sm font-medium text-gray-800">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="ml-1 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>,
    document.body,
  );
}
