"use client";

import { useState, useCallback } from "react";
import { PencilIcon, ArchiveBoxIcon, GridIcon, PlusCircleIcon } from "@/components/icons";
import ServiceCard from "./ServiceCard";
import ServiceDetailsSidebar from "./ServiceDetailsSidebar";
import ArchiveServiceSidebar from "./ArchiveServiceSidebar";
import OrganizeServiceSidebar from "./OrganizeServiceSidebar";
import AddServiceSidebar from "./AddServiceSidebar";
import ArchiveConfirmSidebar from "./ArchiveConfirmSidebar";
import Toast from "@/components/shared/Toast";
import type { Service, ServiceTab } from "@/components/types";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SEED_SERVICES: Service[] = [
  {
    id: 1,
    title: "Personal Growth",
    price: "₱39.99",
    duration: "60 minutes",
    sessionType: "one-on-one",
    description: "Assisting clients in overcoming challenges and creating actionable plans for personal development",
    included: [
      "Understanding personal values and relationship patterns",
      "Setting meaningful short and long-term goals",
      "Building emotional resilience and self-confidence",
    ],
    whatToExpect: [
      "A safe, non-judgmental space to explore your challenges",
      "Practical tools and strategies you can apply immediately",
      "Consistent support and accountability between sessions",
    ],
    whoIsThisFor: "This service is ideal for individuals who feel stuck in their personal life and are ready to take meaningful steps forward. Whether you're navigating a major life transition or simply want to grow.",
  },
  {
    id: 2,
    title: "Personal Growth",
    price: "₱39.99",
    priceLabel: "/seat",
    duration: "60 minutes",
    sessionType: "group",
    description: "Assisting clients in overcoming challenges and creating actionable plans for personal development",
    included: [
      "Understanding personal values and relationship patterns",
      "Setting meaningful short and long-term goals",
      "Building emotional resilience and self-confidence",
    ],
    whatToExpect: [
      "A safe, non-judgmental space to explore your challenges",
      "Practical tools and strategies you can apply immediately",
      "Consistent support and accountability between sessions",
    ],
    whoIsThisFor: "Ideal for groups of individuals who want to grow together through shared experiences and peer accountability.",
  },
  {
    id: 3,
    title: "Career Development",
    price: "₱49.99",
    duration: "60 minutes",
    sessionType: "one-on-one",
    description: "Strategic guidance to help you advance your career and navigate professional transitions with confidence.",
    included: [
      "Career goal mapping and action planning",
      "Resume and interview preparation support",
      "Professional communication and leadership skills",
    ],
    whatToExpect: [
      "Clarity on your career direction and strengths",
      "Actionable steps tailored to your industry",
      "Ongoing accountability toward your career milestones",
    ],
    whoIsThisFor: "Perfect for professionals looking to level up their careers, switch industries, or navigate workplace challenges with clarity and purpose.",
  },
  {
    id: 4,
    title: "Financial Management",
    price: "₱39.99",
    priceLabel: "/seat",
    duration: "60 minutes",
    sessionType: "group",
    description: "Expert advice on managing finances, building wealth, and creating a stable financial future.",
    included: [
      "Budgeting fundamentals and expense tracking",
      "Investment basics and savings strategies",
      "Debt management and financial planning",
    ],
    whatToExpect: [
      "A clear picture of your current financial health",
      "Practical money management techniques",
      "A personalized roadmap toward financial freedom",
    ],
    whoIsThisFor: "For anyone who wants to take control of their finances, eliminate debt, and build lasting wealth — regardless of income level.",
  },
];

// ─── Sub-tab config ───────────────────────────────────────────────────────────

const SERVICE_TABS: { key: ServiceTab; label: string; icon: React.ReactNode }[] = [
  { key: "active",   label: "Active Service",   icon: <PencilIcon     className="w-3.5 h-3.5" /> },
  { key: "archive",  label: "Archive Service",  icon: <ArchiveBoxIcon className="w-3.5 h-3.5" /> },
  { key: "organize", label: "Organize Service", icon: <GridIcon       className="w-3.5 h-3.5" /> },
  { key: "add",      label: "Add Service",      icon: <PlusCircleIcon className="w-3.5 h-3.5" /> },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ServicesTab() {
  const [activeTab,       setActiveTab]       = useState<ServiceTab>("active");
  const [services,        setServices]        = useState<Service[]>(SEED_SERVICES);
  const [archived,        setArchived]        = useState<Service[]>([]);

  // Sidebar state
  const [detailService,        setDetailService]        = useState<Service | null>(null);
  const [archiveSidebarOpen,   setArchiveSidebarOpen]   = useState(false);
  const [organizeSidebarOpen,  setOrganizeSidebarOpen]  = useState(false);
  const [addSidebarOpen,       setAddSidebarOpen]       = useState(false);
  const [archiveConfirmService, setArchiveConfirmService] = useState<Service | null>(null);
  const [editService,          setEditService]          = useState<Service | null>(null);
  const [toast,                setToast]                = useState<string | null>(null);
  const showToast = useCallback((msg: string) => setToast(msg), []);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  function handleTabClick(key: ServiceTab) {
    setActiveTab(key);
    if (key === "archive")  { setArchiveSidebarOpen(true);  return; }
    if (key === "organize") { setOrganizeSidebarOpen(true); return; }
    if (key === "add")      { setAddSidebarOpen(true);      return; }
  }

  function handleArchiveConfirm(id: number) {
    const service = services.find((s) => s.id === id);
    if (!service) return;
    setServices((prev) => prev.filter((s) => s.id !== id));
    setArchived((prev) => [...prev, service]);
  }

  function handleEditSave(updated: Service) {
    setServices((prev) => prev.map((s) => s.id === updated.id ? updated : s));
    showToast("Service updated successfully");
  }

  function handleRestore(ids: number[]) {
    const toRestore = archived.filter((s) => ids.includes(s.id));
    setArchived((prev) => prev.filter((s) => !ids.includes(s.id)));
    setServices((prev) => [...prev, ...toRestore]);
    showToast(ids.length > 1 ? `${ids.length} services restored` : "Service restored successfully");
  }

  function handleOrganizeSave(ordered: Service[]) {
    setServices(ordered);
    showToast("Service order saved");
  }

  function handleAddService(service: Service) {
    setServices((prev) => [...prev, service]);
    setActiveTab("active");
    showToast("Service added successfully");
  }

  return (
    <>
      {/* Sub-tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
        {SERVICE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabClick(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors ${
              activeTab === tab.key
                ? "bg-[#FDFDFD] border-[#BFBFBF] text-[#1A1A1D] shadow-sm"
                : "bg-[#EFEFEF] border-transparent text-[#86888D] hover:bg-[#DCDCDC]"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onViewDetails={setDetailService}
            onArchiveClick={setArchiveConfirmService}
            onEditClick={setEditService}
          />
        ))}
      </div>

      {/* ── Sidebars ── */}
      <ServiceDetailsSidebar
        service={detailService}
        onClose={() => setDetailService(null)}
      />

      <ArchiveServiceSidebar
        isOpen={archiveSidebarOpen}
        archivedServices={archived}
        onClose={() => { setArchiveSidebarOpen(false); setActiveTab("active"); }}
        onRestore={handleRestore}
      />

      <OrganizeServiceSidebar
        isOpen={organizeSidebarOpen}
        services={services}
        onClose={() => { setOrganizeSidebarOpen(false); setActiveTab("active"); }}
        onSave={handleOrganizeSave}
      />

      <AddServiceSidebar
        isOpen={addSidebarOpen}
        onClose={() => { setAddSidebarOpen(false); setActiveTab("active"); }}
        onAdd={handleAddService}
      />

      <AddServiceSidebar
        isOpen={!!editService}
        editService={editService}
        onClose={() => setEditService(null)}
        onSave={handleEditSave}
      />

      <ArchiveConfirmSidebar
        service={archiveConfirmService}
        onClose={() => setArchiveConfirmService(null)}
        onConfirm={handleArchiveConfirm}
      />

      <Toast
        message={toast ?? ""}
        isVisible={!!toast}
        onHide={() => setToast(null)}
      />
    </>
  );
}
