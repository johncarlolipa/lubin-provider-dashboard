"use client";

import { useEffect } from "react";
import type { Service } from "@/components/types";

// ─── Icons inline (small, specific to this sidebar) ──────────────────────────

function InfoCircle() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}


function CheckSquareIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[#86888D] shrink-0">{icon}</span>
      <h4 className="text-[13px] font-bold text-[#1A1A1D]">{title}</h4>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ServiceDetailsSidebarProps {
  service: Service | null;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServiceDetailsSidebar({ service, onClose }: ServiceDetailsSidebarProps) {
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
        className={`fixed top-0 right-0 h-full w-[360px] bg-[#FDFDFD] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#002B66] px-5 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-[16px] font-bold text-white">{service?.title ?? ""}</h2>
          <button onClick={onClose} aria-label="Close" className="text-[#95979C] hover:text-white text-xl leading-none">×</button>
        </div>

        {/* Scrollable content */}
        {service && (
          <div className="flex-1 overflow-y-auto">

            {/* ── Service summary ── */}
            <div className="px-5 pt-5 pb-4">
              <div className="flex items-start justify-between gap-3 mb-2.5">
                <span className="text-[15px] font-bold text-[#202124] leading-snug">{service.title}</span>
                <div className="text-right shrink-0">
                  <div className="text-[15px] font-bold text-[#006BFF] leading-tight">
                    {service.price}
                    {service.priceLabel && (
                      <span className="text-[12px] font-semibold text-[#006BFF]">{service.priceLabel}</span>
                    )}
                  </div>
                  <div className="text-[12px] text-[#86888D] mt-0.5">{service.duration}</div>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#E6F0FF] text-[#004099]">
                {service.sessionType === "one-on-one" ? "One on One Session" : "Group Session"}
              </span>
            </div>

            <div className="border-t border-[#EFEFEF]" />

            {/* ── Sections ── */}
            <div className="px-5 py-5 flex flex-col gap-6">

              {/* About This Service */}
              <div>
                <SectionHeader icon={<InfoCircle />} title="About This Service" />
                <p className="text-[13px] text-[#86888D] leading-relaxed">{service.description}</p>
              </div>


              {/* Service Inclusions */}
              {service.included && service.included.length > 0 && (
                <div>
                  <SectionHeader icon={<CheckSquareIcon />} title="Service Inclusions" />
                  <ul className="flex flex-col gap-3">
                    {service.included.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#006BFF] flex items-center justify-center shrink-0 mt-0.5 text-white">
                          <CheckIcon />
                        </span>
                        <span className="text-[13px] text-[#5A5C60] leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Who Is This For? */}
              {service.whoIsThisFor && (
                <div>
                  <SectionHeader icon={<PersonIcon />} title="Who Is This For?" />
                  <p className="text-[13px] text-[#86888D] leading-relaxed">{service.whoIsThisFor}</p>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-[#DCDCDC] px-5 py-4 shrink-0 bg-[#FDFDFD]">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-[#BFBFBF] rounded-xl text-[14px] font-semibold text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors"
          >
            Close
          </button>
        </div>
      </aside>
    </>
  );
}
