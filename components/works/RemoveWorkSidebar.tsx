"use client";

import { useEffect } from "react";
import { TrashIcon, BanIcon } from "@/components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkItem {
  id: number;
  title: string;
}

interface RemoveWorkSidebarProps {
  work: WorkItem | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RemoveWorkSidebar({ work, onClose, onConfirm }: RemoveWorkSidebarProps) {
  const isOpen = !!work;

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleConfirm() {
    if (!work) return;
    onConfirm(work.id);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[380px] bg-[#FDFDFD] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#002B66] px-5 py-4 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-white leading-snug">Remove Work</h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">This action cannot be undone.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[#95979C] hover:text-white text-xl leading-none mt-0.5">
            ×
          </button>
        </div>

        {/* Body */}
        {work && (
          <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center gap-5">

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-[#FEE4E2] flex items-center justify-center shrink-0">
              <TrashIcon className="w-7 h-7 text-[#D92D20]" />
            </div>

            {/* Heading + description */}
            <div className="text-center">
              <h3 className="text-[18px] font-bold text-[#202124] leading-snug">
                Remove &ldquo;{work.title}&rdquo;?
              </h3>
              <p className="text-[13px] text-[#86888D] mt-2 leading-relaxed">
                This proof of work will be permanently deleted and{" "}
                <span className="font-semibold text-[#5A5C60]">cannot be recovered.</span>
              </p>
            </div>

            {/* Warning box */}
            <div className="w-full flex items-center gap-2.5 bg-[#FEE4E2] border border-red-200 rounded-lg px-4 py-3">
              <BanIcon className="w-4 h-4 text-[#D92D20] shrink-0" />
              <p className="text-[12px] text-[#D92D20] leading-relaxed">
                All media files and details will be permanently removed.
              </p>
            </div>

          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[#DCDCDC] px-5 py-4 flex gap-3 shrink-0 bg-[#FDFDFD]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#BFBFBF] rounded-lg text-[14px] font-semibold text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors"
          >
            Keep It
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#D92D20] hover:bg-[#B52419] rounded-lg text-[14px] font-semibold text-white transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Yes, Remove It
          </button>
        </div>
      </aside>
    </>
  );
}
