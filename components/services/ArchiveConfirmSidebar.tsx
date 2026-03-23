"use client";

import { useEffect } from "react";
import { ArchiveBoxIcon, InfoCircleIcon } from "@/components/icons";
import type { Service } from "@/components/types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ArchiveConfirmSidebarProps {
  service: Service | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArchiveConfirmSidebar({
  service,
  onClose,
  onConfirm,
}: ArchiveConfirmSidebarProps) {
  const isOpen = !!service;

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
    if (!service) return;
    onConfirm(service.id);
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
            <h2 className="text-[16px] font-bold text-white leading-snug">Archive Service</h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">This service will be moved to your archive.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#95979C] hover:text-white text-xl leading-none mt-0.5"
          >
            ×
          </button>
        </div>

        {/* Body */}
        {service && (
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center gap-5">

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-[#FFFBEB] flex items-center justify-center shrink-0">
              <ArchiveBoxIcon className="w-7 h-7 text-[#D17F0E]" />
            </div>

            {/* Heading */}
            <div className="text-center">
              <h3 className="text-[18px] font-bold text-[#202124] leading-snug">
                Archive &ldquo;{service.title}&rdquo;?
              </h3>
              <p className="text-[13px] text-[#86888D] mt-2 leading-relaxed">
                This service will no longer be visible to clients. You can restore it anytime from the{" "}
                <span className="font-semibold text-[#5A5C60]">Archive Service</span> section.
              </p>
            </div>

            {/* Service preview card */}
            <div className="w-full border border-[#DCDCDC] rounded-xl px-4 py-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-bold text-[#202124]">{service.title}</span>
                <span className="text-[14px] font-bold text-[#006BFF] shrink-0">
                  {service.price}
                  {service.priceLabel && (
                    <span className="text-[12px] font-semibold text-[#006BFF]">{service.priceLabel}</span>
                  )}
                </span>
              </div>
              <p className="text-[12px] text-[#95979C] mt-1">
                <span className="text-[#006BFF] font-medium">
                  {service.sessionType === "one-on-one" ? "One on One Session" : "Group Session"}
                </span>
                {" · "}
                {service.duration}
              </p>
            </div>

            {/* Info box */}
            <div className="w-full flex items-start gap-2.5 bg-[#E6F0FF] border border-[#B2D3FF] rounded-lg px-4 py-3">
              <InfoCircleIcon className="w-3.5 h-3.5 text-[#006BFF] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#006BFF] leading-relaxed">
                Archived services are hidden from your public profile but all data is preserved and can be restored.
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
            Keep Active
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#D17F0E] hover:bg-[#B36B0C] rounded-lg text-[14px] font-semibold text-white transition-colors"
          >
            <ArchiveBoxIcon className="w-4 h-4" />
            Yes, Archive It
          </button>
        </div>
      </aside>
    </>
  );
}
