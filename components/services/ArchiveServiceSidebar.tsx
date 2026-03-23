"use client";

import { useState, useEffect } from "react";
import { SearchIcon } from "@/components/icons";
import type { Service } from "@/components/types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ArchiveServiceSidebarProps {
  isOpen: boolean;
  archivedServices: Service[];
  onClose: () => void;
  onRestore: (ids: number[]) => void;
}

// ─── Checkmark icon ───────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="w-2.5 h-2.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 6 5 9 10 3" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ArchiveServiceSidebar({
  isOpen,
  archivedServices,
  onClose,
  onRestore,
}: ArchiveServiceSidebarProps) {
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());

  // Reset selection when closed
  useEffect(() => {
    if (!isOpen) { setQuery(""); setSelected(new Set()); }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = archivedServices.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  function toggleItem(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function handleRestore() {
    if (selected.size === 0) return;
    onRestore(Array.from(selected));
    setSelected(new Set());
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
        className={`fixed top-0 right-0 h-full w-[340px] bg-[#FDFDFD] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#002B66] px-5 py-4 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-white leading-snug">Archived Service</h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">See all services that are no longer active</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[#95979C] hover:text-white text-xl leading-none mt-0.5">×</button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 pb-3 border-b border-[#EFEFEF] shrink-0">
          <div className="flex items-center gap-2 border border-[#DCDCDC] rounded-lg px-3 py-2 focus-within:border-[#66A6FF] focus-within:ring-1 focus-within:ring-[#B2D3FF] transition-colors">
            <SearchIcon className="w-4 h-4 text-[#95979C] shrink-0" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search services"
              className="flex-1 text-[13px] text-[#5A5C60] placeholder-[#95979C] outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Selection count hint */}
        {selected.size > 0 && (
          <div className="px-5 pt-3 shrink-0">
            <p className="text-[12px] text-[#006BFF] font-medium">
              {selected.size} service{selected.size > 1 ? "s" : ""} selected
            </p>
          </div>
        )}

        {/* List / Empty state */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-[13px] text-[#95979C]">
              No archived services.
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {filtered.map((service) => {
                const isChecked = selected.has(service.id);
                return (
                  <li
                    key={service.id}
                    onClick={() => toggleItem(service.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                      isChecked
                        ? "border-[#66A6FF] bg-[#E6F0FF]"
                        : "border-[#DCDCDC] hover:bg-[#FBFBFB]"
                    }`}
                  >
                    {/* Checkbox indicator */}
                    <span className={`w-[18px] h-[18px] rounded flex items-center justify-center shrink-0 border-2 transition-colors ${
                      isChecked
                        ? "bg-[#006BFF] border-[#006BFF] text-white"
                        : "bg-[#FDFDFD] border-[#BFBFBF]"
                    }`}>
                      {isChecked && <CheckIcon />}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#202124]">{service.title}</p>
                      <p className="text-[11px] text-[#95979C] mt-0.5">
                        {service.sessionType === "one-on-one" ? "One on One" : "Group"} · {service.duration}
                      </p>
                    </div>
                    <span className="text-[13px] font-bold text-[#006BFF] shrink-0">{service.price}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[#DCDCDC] px-5 py-4 flex gap-3 shrink-0 bg-[#FDFDFD]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#BFBFBF] rounded-lg text-[14px] font-semibold text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRestore}
            disabled={selected.size === 0}
            className={`flex-1 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-colors ${
              selected.size > 0
                ? "bg-[#006BFF] hover:bg-[#0056CC]"
                : "bg-[#66A6FF] cursor-not-allowed"
            }`}
          >
            Restore{selected.size > 1 ? ` (${selected.size})` : ""}
          </button>
        </div>
      </aside>
    </>
  );
}
