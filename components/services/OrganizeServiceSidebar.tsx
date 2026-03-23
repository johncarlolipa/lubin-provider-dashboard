"use client";

import { useState, useEffect, useRef } from "react";
import { SearchIcon, GripDotsIcon, InfoCircleIcon } from "@/components/icons";
import type { Service } from "@/components/types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface OrganizeServiceSidebarProps {
  isOpen: boolean;
  services: Service[];
  onClose: () => void;
  onSave: (ordered: Service[]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OrganizeServiceSidebar({
  isOpen,
  services,
  onClose,
  onSave,
}: OrganizeServiceSidebarProps) {
  const [items,       setItems]       = useState<Service[]>(services);
  const [query,       setQuery]       = useState("");
  const [dragIndex,   setDragIndex]   = useState<number | null>(null);
  const [overIndex,   setOverIndex]   = useState<number | null>(null);
  const dragItem = useRef<number | null>(null);

  // Sync with external services list when opened
  useEffect(() => {
    if (isOpen) setItems(services);
  }, [isOpen, services]);

  useEffect(() => {
    if (!isOpen) setQuery("");
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

  // ── Drag handlers ───────────────────────────────────────────────────────────

  function handleDragStart(e: React.DragEvent, index: number) {
    dragItem.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setOverIndex(index);
  }

  function handleDrop(e: React.DragEvent, targetIndex: number) {
    e.preventDefault();
    const from = dragItem.current;
    if (from === null || from === targetIndex) { resetDrag(); return; }
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(targetIndex, 0, moved);
    setItems(next);
    resetDrag();
  }

  function handleDragEnd() { resetDrag(); }

  function resetDrag() {
    dragItem.current = null;
    setDragIndex(null);
    setOverIndex(null);
  }

  // ── Filtered list (search only filters display, not reorder source) ─────────

  const displayItems = query.trim()
    ? items.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
    : items;

  // ── Save / Cancel ────────────────────────────────────────────────────────────

  function handleSave() { onSave(items); onClose(); }
  function handleCancel() { setItems(services); onClose(); }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
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
            <h2 className="text-[16px] font-bold text-white leading-snug">Organize Service</h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">Arrange your services for easy access.</p>
          </div>
          <button onClick={handleCancel} aria-label="Close" className="text-[#95979C] hover:text-white text-xl leading-none mt-0.5">×</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto flex flex-col">

          {/* How to use info box */}
          <div className="mx-5 mt-4 flex items-start gap-2.5 bg-[#E6F0FF] border border-[#B2D3FF] rounded-lg px-4 py-3 shrink-0">
            <InfoCircleIcon className="w-3.5 h-3.5 text-[#006BFF] shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-semibold text-[#004099]">How to use:</p>
              <p className="text-[12px] text-[#006BFF] mt-0.5">Drag services using the grip handle to reorder them</p>
            </div>
          </div>

          {/* Search */}
          <div className="px-5 pt-3 pb-3 shrink-0">
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

          {/* Draggable list */}
          <ul className="flex-1 px-5 pb-4">
            {displayItems.map((service, visibleIdx) => {
              // Find actual index in items array for drop targeting
              const actualIndex = items.findIndex((s) => s.id === service.id);
              const isDragging  = dragIndex === actualIndex;
              const isOver      = overIndex === actualIndex;

              return (
                <li
                  key={service.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, actualIndex)}
                  onDragOver={(e) => handleDragOver(e, actualIndex)}
                  onDrop={(e) => handleDrop(e, actualIndex)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 py-3.5 transition-all select-none ${
                    visibleIdx < displayItems.length - 1 ? "border-b border-[#EFEFEF]" : ""
                  } ${isDragging ? "opacity-40" : "opacity-100"} ${
                    isOver && !isDragging ? "bg-[#E6F0FF] rounded-lg px-2 -mx-2" : ""
                  }`}
                >
                  {/* Grip handle */}
                  <span className="cursor-grab active:cursor-grabbing text-[#BFBFBF] hover:text-[#86888D] transition-colors shrink-0">
                    <GripDotsIcon className="w-4 h-4" />
                  </span>

                  {/* Service name */}
                  <span className="text-[13px] font-medium text-[#1A1A1D] flex-1 leading-snug">
                    {service.title}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer */}
        <div className="border-t border-[#DCDCDC] px-5 py-4 flex gap-3 shrink-0 bg-[#FDFDFD]">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 border border-[#BFBFBF] rounded-lg text-[14px] font-semibold text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 bg-[#006BFF] hover:bg-[#0056CC] rounded-lg text-[14px] font-semibold text-white transition-colors"
          >
            Save Changes
          </button>
        </div>
      </aside>
    </>
  );
}
