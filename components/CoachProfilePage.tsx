"use client";

import { useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ShareProfileSidebar from "@/components/profile/ShareProfileSidebar";
import SocialLinksSidebar from "@/components/profile/SocialLinksSidebar";
import ServicesTab from "@/components/services/ServicesTab";
import AvailabilityTab from "@/components/availability/AvailabilityTab";
import AvailabilityPreview from "@/components/availability/AvailabilityPreview";
import AppointmentsTab from "@/components/appointments/AppointmentsTab";
import WorksTab from "@/components/works/WorksTab";
import AboutTab from "@/components/about/AboutTab";
import {
  GridIcon,
  CalendarIcon,
  ClipboardIcon,
  BriefcaseIcon,
  UserIcon,
} from "@/components/icons";
import type { MainTab, SocialLink } from "@/components/types";

// ─── Tab config ───────────────────────────────────────────────────────────────

const MAIN_TABS: { key: MainTab; label: string; icon: React.ReactNode }[] = [
  { key: "services",     label: "Services",     icon: <GridIcon      className="w-[15px] h-[15px]" /> },
  { key: "availability", label: "Availability", icon: <CalendarIcon  className="w-[15px] h-[15px]" /> },
  { key: "appointments", label: "Appointments", icon: <ClipboardIcon className="w-[15px] h-[15px]" /> },
  { key: "works",        label: "Works",        icon: <BriefcaseIcon className="w-[15px] h-[15px]" /> },
  { key: "about",        label: "About",        icon: <UserIcon      className="w-[15px] h-[15px]" /> },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const INITIAL_SOCIAL_LINKS: SocialLink[] = [
  { id: 1, platform: "facebook",  url: "https://facebook.com"  },
  { id: 2, platform: "twitter",   url: "https://twitter.com"   },
  { id: 3, platform: "instagram", url: "https://instagram.com" },
  { id: 4, platform: "youtube",   url: "https://youtube.com"   },
  { id: 5, platform: "linkedin",  url: "https://linkedin.com"  },
];

export default function CoachProfilePage() {
  const [mainTab,         setMainTab]         = useState<MainTab>("services");
  const [shareOpen,       setShareOpen]       = useState(false);
  const [socialLinksOpen, setSocialLinksOpen] = useState(false);
  const [previewMode,     setPreviewMode]     = useState(false);
  const [socialLinks,     setSocialLinks]     = useState<SocialLink[]>(INITIAL_SOCIAL_LINKS);

  if (previewMode) {
    return <AvailabilityPreview onExit={() => setPreviewMode(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFD]">

      <Navbar />

      <ProfileHeader
        onShareClick={() => setShareOpen(true)}
        onSocialLinksClick={() => setSocialLinksOpen(true)}
        socialLinks={socialLinks}
      />

      {/* ── Main tabs ── */}
      <div className="bg-[#FDFDFD] border-b border-[#DCDCDC] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6">
          <nav className="flex justify-center" aria-label="Main navigation">
            {MAIN_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setMainTab(tab.key)}
                className={`flex items-center gap-1.5 px-8 py-[15px] text-[13px] font-medium border-b-2 transition-colors ${
                  mainTab === tab.key
                    ? "border-[#006BFF] text-[#006BFF]"
                    : "border-transparent text-[#86888D] hover:text-[#5A5C60]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* ── Tab content ── */}
      <main className="flex-1 bg-[#FBFBFB] py-6">
        <div className={`mx-auto px-6 ${mainTab === "works" ? "max-w-4xl" : "max-w-3xl"}`}>
          {mainTab === "services"      && <ServicesTab />}
          {mainTab === "availability"  && <AvailabilityTab onPreview={() => setPreviewMode(true)} />}
          {mainTab === "appointments"  && <AppointmentsTab />}
          {mainTab === "works"         && <WorksTab />}
          {mainTab === "about"         && <AboutTab />}
          {mainTab !== "services" && mainTab !== "availability" && mainTab !== "appointments" && mainTab !== "works" && mainTab !== "about" && (
            <div className="flex items-center justify-center h-48 text-[#95979C] text-sm">
              {MAIN_TABS.find((t) => t.key === mainTab)?.label} — coming soon
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* ── Share profile sidebar ── */}
      <ShareProfileSidebar isOpen={shareOpen} onClose={() => setShareOpen(false)} />

      {/* ── Social links sidebar ── */}
      <SocialLinksSidebar
        isOpen={socialLinksOpen}
        onClose={() => setSocialLinksOpen(false)}
        onSave={(links) => { setSocialLinks(links); setSocialLinksOpen(false); }}
        savedLinks={socialLinks}
      />

    </div>
  );
}
