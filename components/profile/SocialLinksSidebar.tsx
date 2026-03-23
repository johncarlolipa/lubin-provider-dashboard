"use client";

import { useState, useEffect } from "react";
import {
  FacebookIcon,
  XIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
} from "@/components/icons";
import type { SocialLink, SocialPlatform } from "@/components/types";

// ─── Platform config ──────────────────────────────────────────────────────────

const ALL_PLATFORMS: SocialPlatform[] = ["facebook", "twitter", "instagram", "youtube", "linkedin"];

const PLATFORM_CONFIG: Record<SocialPlatform, {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  defaultUrl: string;
}> = {
  facebook:  { icon: <FacebookIcon  className="w-[15px] h-[15px] text-[#1877F2]" />, label: "Facebook",  placeholder: "https://facebook.com/yourpage",   defaultUrl: "https://facebook.com"  },
  twitter:   { icon: <XIcon         className="w-[15px] h-[15px] text-[#202124]"  />, label: "Twitter/X", placeholder: "https://twitter.com/yourhandle",  defaultUrl: "https://twitter.com"   },
  instagram: { icon: <InstagramIcon className="w-[15px] h-[15px] text-[#E4405F]" />, label: "Instagram", placeholder: "https://instagram.com/yourhandle", defaultUrl: "https://instagram.com" },
  youtube:   { icon: <YoutubeIcon   className="w-[15px] h-[15px] text-[#FF0000]" />, label: "YouTube",   placeholder: "https://youtube.com/yourchannel", defaultUrl: "https://youtube.com"   },
  linkedin:  { icon: <LinkedinIcon  className="w-[15px] h-[15px] text-[#0A66C2]" />, label: "LinkedIn",  placeholder: "https://linkedin.com/in/yourname", defaultUrl: "https://linkedin.com"  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface SocialLinksSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (links: SocialLink[]) => void;
  savedLinks: SocialLink[];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SocialLinksSidebar({ isOpen, onClose, onSave, savedLinks }: SocialLinksSidebarProps) {
  const [links, setLinks] = useState<SocialLink[]>(savedLinks);

  // Sync with saved state whenever the sidebar opens
  useEffect(() => {
    if (isOpen) setLinks(savedLinks);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") handleCancel(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, savedLinks]); // eslint-disable-line react-hooks/exhaustive-deps

  // Platforms not currently in the active list
  const activePlatforms = links.map((l) => l.platform);
  const removedPlatforms = ALL_PLATFORMS.filter((p) => !activePlatforms.includes(p));

  function updateUrl(id: number, url: string) {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, url } : l)));
  }

  function removeLink(id: number) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  function addPlatform(platform: SocialPlatform) {
    setLinks((prev) => [
      ...prev,
      { id: Date.now(), platform, url: PLATFORM_CONFIG[platform].defaultUrl },
    ]);
  }

  function handleSave() {
    onSave(links);
    onClose();
  }

  function handleCancel() {
    setLinks(savedLinks);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[320px] bg-[#FDFDFD] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#002B66] px-5 py-4 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-white leading-snug">Social Links</h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">Add your social media profiles to your page.</p>
          </div>
          <button onClick={handleCancel} aria-label="Close" className="text-[#95979C] hover:text-white transition-colors text-xl leading-none mt-0.5">
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 bg-[#FBFBFB]">

          {/* Active links */}
          {links.length > 0 && (
            <div className="flex flex-col gap-2.5">
              {links.map((link) => {
                const config = PLATFORM_CONFIG[link.platform];
                return (
                  <div
                    key={link.id}
                    className="flex items-center gap-3 bg-[#FDFDFD] border border-[#DCDCDC] rounded-lg px-3 py-2.5 focus-within:border-[#66A6FF] focus-within:ring-1 focus-within:ring-[#B2D3FF] transition-colors"
                  >
                    <span className="shrink-0">{config.icon}</span>
                    <input
                      type="url"
                      value={link.url}
                      onChange={(e) => updateUrl(link.id, e.target.value)}
                      placeholder={config.placeholder}
                      className="flex-1 text-[13px] text-[#5A5C60] placeholder-[#95979C] outline-none min-w-0 bg-transparent"
                    />
                    <button
                      onClick={() => removeLink(link.id)}
                      aria-label={`Remove ${link.platform}`}
                      className="text-[#95979C] hover:text-[#D92D20] transition-colors shrink-0 text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* ADD PLATFORM section — only visible when at least one platform is removed */}
          {removedPlatforms.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-[#95979C] uppercase tracking-wider mb-2.5">
                Add Platform
              </p>
              <div className="flex flex-wrap gap-2">
                {removedPlatforms.map((platform) => {
                  const config = PLATFORM_CONFIG[platform];
                  return (
                    <button
                      key={platform}
                      onClick={() => addPlatform(platform)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FDFDFD] border border-[#DCDCDC] rounded-full text-[12px] font-medium text-[#5A5C60] hover:border-[#66A6FF] hover:text-[#006BFF] hover:bg-[#E6F0FF]/40 transition-colors shadow-sm"
                    >
                      {config.icon}
                      {config.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {links.length === 0 && removedPlatforms.length === 0 && (
            <p className="text-[13px] text-[#95979C] text-center py-8">All platforms added.</p>
          )}

        </div>

        {/* Footer */}
        <div className="border-t border-[#DCDCDC] px-5 py-4 flex items-center gap-3 shrink-0 bg-[#FDFDFD]">
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
            Save
          </button>
        </div>
      </aside>
    </>
  );
}
