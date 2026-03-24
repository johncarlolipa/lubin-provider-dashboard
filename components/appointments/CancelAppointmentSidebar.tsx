"use client";

import { useEffect } from "react";
import { InfoCircleIcon } from "@/components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppointmentSummary {
  id: number;
  title: string;
  date: string;
  time: string;
  client: string;
  price: string;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface CancelAppointmentSidebarProps {
  appointment: AppointmentSummary | null;
  onClose: () => void;
  onConfirm: (id: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CancelAppointmentSidebar({
  appointment,
  onClose,
  onConfirm,
}: CancelAppointmentSidebarProps) {
  const isOpen = !!appointment;

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
    if (!appointment) return;
    onConfirm(appointment.id);
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
            <h2 className="text-[16px] font-bold text-white leading-snug">Cancel Appointment</h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">This action cannot be undone.</p>
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
        {appointment && (
          <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col items-center gap-5">

            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-[#FEE4E2] flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-[#D92D20]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            {/* Heading */}
            <div className="text-center">
              <h3 className="text-[18px] font-bold text-[#202124] leading-snug">
                Cancel &ldquo;{appointment.title}&rdquo;?
              </h3>
              <p className="text-[13px] text-[#86888D] mt-2 leading-relaxed">
                Are you sure you want to cancel this appointment? The client will be notified and the slot will be released.
              </p>
            </div>

            {/* Appointment preview card */}
            <div className="w-full border border-[#DCDCDC] rounded-xl px-4 py-3 flex flex-col gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[14px] font-bold text-[#202124]">{appointment.title}</span>
                <span className="text-[14px] font-bold text-[#006BFF] shrink-0">{appointment.price}</span>
              </div>
              <p className="text-[12px] text-[#86888D]">
                {appointment.date}
                <span className="mx-1.5 opacity-50">·</span>
                {appointment.time}
              </p>
              <p className="text-[12px] text-[#86888D]">
                Client: <span className="font-semibold text-[#5A5C60]">{appointment.client}</span>
              </p>
            </div>

            {/* Warning info box */}
            <div className="w-full flex items-start gap-2.5 bg-[#FEE4E2] border border-[#D92D20]/20 rounded-lg px-4 py-3">
              <InfoCircleIcon className="w-3.5 h-3.5 text-[#D92D20] shrink-0 mt-0.5" />
              <p className="text-[12px] text-[#D92D20] leading-relaxed">
                Cancelled appointments cannot be restored. The client may be eligible for a refund depending on your cancellation policy.
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
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#D92D20] hover:bg-[#B42318] rounded-lg text-[14px] font-semibold text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            Yes, Cancel It
          </button>
        </div>
      </aside>
    </>
  );
}
