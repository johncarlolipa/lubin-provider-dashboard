"use client";

import { useState, useEffect, useRef } from "react";
import { PlusCircleIcon, CheckCircleIcon } from "@/components/icons";
import type { Service, SessionType } from "@/components/types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddServiceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  /** Add mode */
  onAdd?: (service: Service) => void;
  /** Edit mode — provide the service to pre-fill */
  editService?: Service | null;
  onSave?: (service: Service) => void;
}

// ─── Pricing type ─────────────────────────────────────────────────────────────

type PricingType = "per-session" | "package";

// ─── Tag input row ────────────────────────────────────────────────────────────

interface TagRowProps {
  items: string[];
  inputValue: string;
  placeholder: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

function TagRow({ items, inputValue, placeholder, onInputChange, onAdd, onRemove }: TagRowProps) {
  return (
    <>
      {items.length > 0 && (
        <div className="flex flex-col gap-2 mb-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#E6F0FF] border border-[#B2D3FF] rounded-lg px-3 py-2.5">
              <CheckCircleIcon className="w-4 h-4 text-[#006BFF] shrink-0" />
              <span className="text-[13px] text-[#1A1A1D] flex-1 leading-snug">{item}</span>
              <button
                onClick={() => onRemove(i)}
                className="text-[#95979C] hover:text-[#5A5C60] text-base leading-none ml-1"
                aria-label="Remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onAdd(); } }}
          placeholder={placeholder}
          className="flex-1 text-[13px] text-[#5A5C60] placeholder-[#95979C] border border-[#DCDCDC] rounded-lg px-3 py-2 outline-none focus:border-[#66A6FF] focus:ring-1 focus:ring-[#B2D3FF] transition-colors"
        />
        <button
          onClick={onAdd}
          className="px-3 py-2 bg-[#006BFF] hover:bg-[#0056CC] text-white text-[12px] font-semibold rounded-lg transition-colors"
        >
          Add
        </button>
      </div>
    </>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddServiceSidebar({
  isOpen,
  onClose,
  onAdd,
  editService,
  onSave,
}: AddServiceSidebarProps) {
  const isEditMode = !!editService;

  const [serviceName,       setServiceName]       = useState("");
  const [pricingType,       setPricingType]       = useState<PricingType>("per-session");
  const [sessionPrice,      setSessionPrice]      = useState("");
  const [numSessions,       setNumSessions]       = useState(5);
  const [packagePrice,      setPackagePrice]      = useState(150);
  const [sessionType,       setSessionType]       = useState<SessionType>("one-on-one");
  const [description,       setDescription]       = useState("");
  const [benefits,          setBenefits]          = useState<string[]>([]);
  const [benefitInput,      setBenefitInput]      = useState("");
  const [whoIsThisFor,      setWhoIsThisFor]      = useState("");

  const nameRef = useRef<HTMLInputElement>(null);

  // ── Populate / reset when sidebar opens or editService changes ────────────

  useEffect(() => {
    if (!isOpen) {
      setServiceName("");
      setPricingType("per-session");
      setSessionPrice("");
      setNumSessions(5);
      setPackagePrice(150);
      setSessionType("one-on-one");
      setDescription("");
      setBenefits([]);
      setBenefitInput("");
      setWhoIsThisFor("");
      return;
    }

    if (editService) {
      setServiceName(editService.title);
      setSessionType(editService.sessionType);
      setDescription(editService.description);
      setBenefits(editService.included);
      setWhoIsThisFor(editService.whoIsThisFor ?? "");

      // Determine pricing type from duration
      const isPackage = /\d+\s*sessions?/i.test(editService.duration);
      setPricingType(isPackage ? "package" : "per-session");

      // Parse numeric price (strip currency symbols)
      const priceNum = editService.price.replace(/[^0-9.]/g, "");
      if (isPackage) {
        setPackagePrice(parseFloat(priceNum) || 0);
        const sessionMatch = editService.duration.match(/(\d+)/);
        setNumSessions(sessionMatch ? parseInt(sessionMatch[1]) : 5);
      } else {
        setSessionPrice(priceNum);
      }
    } else {
      setTimeout(() => nameRef.current?.focus(), 300);
    }
  }, [isOpen, editService]);

  // ── Body scroll lock ──────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // ── Tag helpers ───────────────────────────────────────────────────────────

  function commitBenefit() {
    const v = benefitInput.trim();
    if (v) { setBenefits((p) => [...p, v]); setBenefitInput(""); }
  }

  // ── Submit ────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!serviceName.trim()) return;

    const price =
      pricingType === "package"
        ? `₱${packagePrice}`
        : sessionPrice
        ? `₱${sessionPrice}`
        : "₱0";

    const priceLabel =
      pricingType === "per-session" && sessionType === "group" ? "/seat" :
      pricingType === "per-session"                            ? "/session" :
      undefined;

    const duration =
      pricingType === "package" ? `${numSessions} sessions` : "60 minutes";

    const serviceData: Service = {
      id:           isEditMode ? editService!.id : Date.now(),
      title:        serviceName.trim(),
      price,
      priceLabel,
      duration,
      sessionType,
      description:  description.trim(),
      included:     benefits,
      whoIsThisFor: whoIsThisFor.trim() || undefined,
    };

    if (isEditMode) {
      onSave?.(serviceData);
    } else {
      onAdd?.(serviceData);
    }
    onClose();
  }

  const canSubmit = serviceName.trim().length > 0;

  // ── Render ────────────────────────────────────────────────────────────────

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-[#FDFDFD] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#002B66] px-5 py-4 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-white leading-snug">
              {isEditMode ? "Edit Service" : "Add Service"}
            </h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">
              {isEditMode
                ? "Update your service details."
                : "Add a service so clients can schedule with you."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-[#95979C] hover:text-white text-xl leading-none mt-0.5"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4">

          {/* ── Service Name ── */}
          <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-4">
            <label className="text-[13px] font-semibold text-[#1A1A1D] mb-2 block">
              Service Name <span className="text-[#D92D20]">*</span>
            </label>
            <input
              ref={nameRef}
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              placeholder="Ex: Marketing Management"
              className="w-full text-[13px] text-[#5A5C60] placeholder-[#95979C] border border-[#DCDCDC] rounded-lg px-3 py-2.5 outline-none focus:border-[#66A6FF] focus:ring-1 focus:ring-[#B2D3FF] transition-colors"
            />
          </div>

          {/* ── Pricing type ── */}
          <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-4">
            <p className="text-[13px] font-semibold text-[#1A1A1D] mb-3">How is this service priced?</p>
            <div className="flex flex-col gap-2">
              {([
                { value: "per-session", label: "Per Session",          sub: "Clients book and pay per visit" },
                { value: "package",     label: "Package (multi-session)", sub: "Clients purchase a bundle of sessions upfront" },
              ] as { value: PricingType; label: string; sub: string }[]).map(({ value, label, sub }) => (
                <label
                  key={value}
                  onClick={() => setPricingType(value)}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    pricingType === value
                      ? "border-[#66A6FF] bg-[#E6F0FF]"
                      : "border-[#DCDCDC] hover:bg-[#FBFBFB]"
                  }`}
                >
                  {/* Custom radio circle */}
                  <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    pricingType === value
                      ? "border-[#006BFF] bg-[#006BFF]"
                      : "border-[#BFBFBF] bg-[#FDFDFD]"
                  }`}>
                    {pricingType === value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1A1D]">{label}</p>
                    <p className="text-[12px] text-[#86888D]">{sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ── Per Session price ── */}
          {pricingType === "per-session" && (
            <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-4">
              <p className="text-[13px] font-semibold text-[#1A1A1D] mb-3">Session Pricing</p>
              <label className="text-[12px] font-semibold text-[#5A5C60] mb-1.5 block">
                Session Price <span className="text-[#D92D20]">*</span>
              </label>
              <div className="flex items-center border border-[#DCDCDC] rounded-lg overflow-hidden focus-within:border-[#66A6FF] focus-within:ring-1 focus-within:ring-[#B2D3FF] transition-colors">
                <span className="px-3 text-[13px] text-[#86888D] border-r border-[#DCDCDC] py-2.5 bg-[#FBFBFB] select-none">₱</span>
                <input
                  type="number"
                  min={0}
                  value={sessionPrice}
                  onChange={(e) => setSessionPrice(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 text-[13px] text-[#5A5C60] placeholder-[#95979C] px-3 py-2.5 outline-none bg-transparent"
                />
              </div>
            </div>
          )}

          {/* ── Package Options ── */}
          {pricingType === "package" && (
            <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-4">
              <p className="text-[13px] font-semibold text-[#1A1A1D] mb-0.5">Package Options</p>
              <p className="text-[12px] text-[#86888D] mb-3">Clients pay once for the full package.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#5A5C60] mb-1.5 block">
                    Number of sessions <span className="text-[#D92D20]">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={numSessions}
                    onChange={(e) => setNumSessions(Math.max(1, Number(e.target.value)))}
                    className="w-full text-[13px] text-[#5A5C60] border border-[#DCDCDC] rounded-lg px-3 py-2.5 outline-none focus:border-[#66A6FF] focus:ring-1 focus:ring-[#B2D3FF] transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#5A5C60] mb-1.5 block">
                    Package Price <span className="text-[#D92D20]">*</span>
                  </label>
                  <div className="flex items-center border border-[#DCDCDC] rounded-lg overflow-hidden focus-within:border-[#66A6FF] focus-within:ring-1 focus-within:ring-[#B2D3FF] transition-colors">
                    <span className="px-3 text-[13px] text-[#86888D] border-r border-[#DCDCDC] py-2.5 bg-[#FBFBFB] select-none">₱</span>
                    <input
                      type="number"
                      min={0}
                      value={packagePrice}
                      onChange={(e) => setPackagePrice(Number(e.target.value))}
                      className="flex-1 text-[13px] text-[#5A5C60] px-3 py-2.5 outline-none bg-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Session Type ── */}
          <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-4">
            <p className="text-[13px] font-semibold text-[#1A1A1D] mb-3">Session Type</p>
            <div className="flex gap-2">
              {(["one-on-one", "group"] as SessionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSessionType(type)}
                  className={`flex-1 py-2 rounded-lg border text-[13px] font-medium transition-colors ${
                    sessionType === type
                      ? "border-[#66A6FF] bg-[#E6F0FF] text-[#004099]"
                      : "border-[#DCDCDC] text-[#5A5C60] hover:bg-[#FBFBFB]"
                  }`}
                >
                  {type === "one-on-one" ? "One on One" : "Group"}
                </button>
              ))}
            </div>
          </div>

          {/* ── Service Description ── */}
          <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-4">
            <label className="text-[13px] font-semibold text-[#1A1A1D] mb-2 block">Service Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write short description of your services here..."
              rows={4}
              className="w-full text-[13px] text-[#5A5C60] placeholder-[#95979C] border border-[#DCDCDC] rounded-lg px-3 py-2.5 outline-none focus:border-[#66A6FF] focus:ring-1 focus:ring-[#B2D3FF] transition-colors resize-y"
            />
          </div>

          {/* ── Service Benefits ── */}
          <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-4">
            <div className="mb-3">
              <p className="text-[13px] font-semibold text-[#1A1A1D]">Service Benefits</p>
            </div>
            <TagRow
              items={benefits}
              inputValue={benefitInput}
              placeholder="e.g. Personalized coaching tailored to your needs"
              onInputChange={setBenefitInput}
              onAdd={commitBenefit}
              onRemove={(i) => setBenefits((p) => p.filter((_, j) => j !== i))}
            />
          </div>

          {/* ── Who Is This For ── */}
          <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-4">
            <p className="text-[13px] font-semibold text-[#1A1A1D] mb-0.5">Who Is This For?</p>
            <p className="text-[12px] text-[#86888D] mb-2">Describe the ideal client for this service in 2–3 sentences.</p>
            <div className="relative">
              <textarea
                value={whoIsThisFor}
                onChange={(e) => {
                  if (e.target.value.length <= 400) setWhoIsThisFor(e.target.value);
                }}
                placeholder="e.g. This service is ideal for professionals who feel stuck in their career and are ready to take action."
                rows={5}
                className="w-full text-[13px] text-[#5A5C60] placeholder-[#95979C] border border-[#DCDCDC] rounded-lg px-3 py-2.5 pb-6 outline-none focus:border-[#66A6FF] focus:ring-1 focus:ring-[#B2D3FF] transition-colors resize-y"
              />
              <span className="absolute bottom-2.5 right-3 text-[11px] text-[#95979C] pointer-events-none">
                {whoIsThisFor.length}/400
              </span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="border-t border-[#DCDCDC] px-5 py-4 flex gap-3 shrink-0 bg-[#FDFDFD]">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#BFBFBF] rounded-lg text-[14px] font-semibold text-[#006BFF] hover:bg-[#FBFBFB] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-colors ${
              canSubmit ? "bg-[#006BFF] hover:bg-[#0056CC]" : "bg-[#66A6FF] cursor-not-allowed"
            }`}
          >
            {isEditMode ? "Save Changes" : "Add Service"}
          </button>
        </div>
      </aside>
    </>
  );
}
