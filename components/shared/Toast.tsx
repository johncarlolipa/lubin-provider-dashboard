"use client";

import { useEffect } from "react";

// ─── CheckCircle icon ─────────────────────────────────────────────────────────

function CheckCircle() {
  return (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11.5 14.5 16 9.5" />
    </svg>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Toast({ message, isVisible, onHide }: ToastProps) {
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(onHide, 3000);
    return () => clearTimeout(t);
  }, [isVisible, onHide]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-xl shadow-lg bg-[#DCF4E6] border border-[#079455]/30 text-[#079455] text-[13px] font-semibold whitespace-nowrap transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <CheckCircle />
      {message}
    </div>
  );
}
