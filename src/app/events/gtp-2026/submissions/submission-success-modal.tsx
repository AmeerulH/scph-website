"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

interface SubmissionSuccessModalProps {
  show: boolean;
  message: string;
  email?: string;
  onClose: () => void;
}

const EXPO_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function SubmissionSuccessModal({
  show,
  message,
  email,
  onClose,
}: SubmissionSuccessModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [show, onClose]);

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [show]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-5"
          style={{ backgroundColor: "oklch(0.22 0.05 210 / 0.75)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.4, ease: EXPO_OUT }}
            className="w-full max-w-sm overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* ── Top banner ── */}
            <div
              className="relative flex h-52 flex-col items-center justify-center overflow-hidden"
              style={{ backgroundColor: "oklch(0.33 0.08 210)" }}
            >
              {/* Concentric ring background decoration */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 384 220"
                fill="none"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden
              >
                {[80, 120, 162, 206, 252].map((r) => (
                  <circle
                    key={r}
                    cx="192"
                    cy="110"
                    r={r}
                    stroke="oklch(0.97 0.005 210 / 0.07)"
                    strokeWidth="1"
                  />
                ))}
              </svg>

              {/* Icon circle */}
              <div className="relative flex h-[108px] w-[108px] items-center justify-center rounded-full"
                style={{ backgroundColor: "oklch(0.44 0.10 210)" }}>
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden>
                  <motion.path
                    d="M11 24.5L20 33.5L37 15"
                    stroke="oklch(0.97 0.005 210)"
                    strokeWidth="3.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{
                      pathLength: { duration: 0.5, delay: 0.22, ease: EXPO_OUT },
                      opacity: { duration: 0.01, delay: 0.22 },
                    }}
                  />
                </svg>
              </div>
            </div>

            {/* ── Bottom content ── */}
            <div
              className="px-8 pb-8 pt-8"
              style={{ backgroundColor: "oklch(0.99 0.004 210)" }}
            >
              <h2
                className="mb-3 text-center font-heading text-xl font-bold"
                style={{ color: "oklch(0.26 0.07 210)" }}
              >
                Submission received
              </h2>
              <p
                className="mx-auto mb-3 text-center text-sm leading-relaxed"
                style={{ color: "oklch(0.50 0.04 210)" }}
              >
                {message}
              </p>
              {email && (
                <p
                  className="mx-auto mb-8 text-center text-sm leading-relaxed"
                  style={{ color: "oklch(0.50 0.04 210)" }}
                >
                  A confirmation email has been sent to{" "}
                  <strong style={{ color: "oklch(0.33 0.08 210)" }}>{email}</strong>.
                </p>
              )}
              {!email && <div className="mb-8" />}

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-xl py-4 text-base font-semibold tracking-wide transition-opacity hover:opacity-90 active:opacity-80"
                style={{
                  backgroundColor: "oklch(0.33 0.08 210)",
                  color: "oklch(0.97 0.005 210)",
                }}
              >
                Done
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
