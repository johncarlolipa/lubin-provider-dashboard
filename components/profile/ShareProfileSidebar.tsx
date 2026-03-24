"use client";

import { useState, useEffect } from "react";
import Toast from "@/components/shared/Toast";
import {
  PencilIcon,
  CopyIcon,
  WarningTriangleIcon,
  EnvelopeIcon,
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
  LinkedinIcon,
  YoutubeIcon,
  SnapchatIcon,
  PinterestIcon,
  TwitchIcon,
} from "@/components/icons";

// ─── Social platform grid ─────────────────────────────────────────────────────

const PLATFORMS = [
  { label: "Email",     bg: "bg-[#DCDCDC]",      icon: <EnvelopeIcon  className="w-[15px] h-[15px] text-white" /> },
  { label: "Facebook",  bg: "bg-[#1877F2]",     icon: <FacebookIcon  className="w-[15px] h-[15px] text-white" /> },
  { label: "Instagram", bg: "bg-[#E4405F]",     icon: <InstagramIcon className="w-[15px] h-[15px] text-white" /> },
  { label: "TikTok",    bg: "bg-black",          icon: <TikTokIcon    className="w-[15px] h-[15px] text-white" /> },
  { label: "X",         bg: "bg-black",          icon: <XIcon         className="w-[15px] h-[15px] text-white" /> },
  { label: "LinkedIn",  bg: "bg-[#0A66C2]",     icon: <LinkedinIcon  className="w-[15px] h-[15px] text-white" /> },
  { label: "YouTube",   bg: "bg-[#FF0000]",     icon: <YoutubeIcon   className="w-[15px] h-[15px] text-white" /> },
  { label: "Snapchat",  bg: "bg-[#FFFC00]",     icon: <SnapchatIcon  className="w-[15px] h-[15px] text-black"  /> },
  { label: "Pinterest", bg: "bg-[#E60023]",     icon: <PinterestIcon className="w-[15px] h-[15px] text-white" /> },
  { label: "Twitch",    bg: "bg-[#9146FF]",     icon: <TwitchIcon    className="w-[15px] h-[15px] text-white" /> },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface ShareProfileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShareProfileSidebar({ isOpen, onClose }: ShareProfileSidebarProps) {
  const [url,        setUrl]        = useState("lubin.ai/carolmorgan23");
  const [draftUrl,   setDraftUrl]   = useState("lubin.ai/carolmorgan23");
  const [editingUrl, setEditingUrl] = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [urlSaved,   setUrlSaved]   = useState(false);
  const [toast,      setToast]      = useState({ message: "", isVisible: false });

  const urlDirty = draftUrl !== url;

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleCopy() {
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveUrl() {
    setUrl(draftUrl);
    setEditingUrl(false);
    setUrlSaved(true);
    setToast({ message: "Username saved successfully!", isVisible: true });
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

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 right-0 h-full w-[320px] bg-[#FDFDFD] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#002B66] px-5 py-4 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-white leading-snug">Share your profile</h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">Let others find and book you.</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#95979C] hover:text-white transition-colors text-xl leading-none mt-0.5"
            aria-label="Close sidebar"
          >
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

          {/* Important warning — hidden once URL has been saved */}
          {!urlSaved && (
            <div className="border border-[#D17F0E] bg-[#FFFBEB] rounded-xl p-4 flex items-start gap-3">
              <WarningTriangleIcon className="w-4 h-4 text-[#D17F0E] shrink-0 mt-0.5" />
              <div>
                <p className="text-[12px] font-bold text-[#D17F0E] mb-1">Important</p>
                <p className="text-[12px] text-[#D17F0E] leading-snug">
                  You can only edit your username link <span className="font-bold underline">once</span>.
                  After changing, it will be permanent and cannot be changed again.
                </p>
              </div>
            </div>
          )}

          {/* Share your site */}
          <div className="border border-[#DCDCDC] rounded-xl p-5">
            <h3 className="text-[15px] font-bold text-[#202124] text-center">Share your site</h3>
            <p className="text-[12px] text-[#86888D] text-center mt-0.5 mb-4">
              Get more views by sharing your site everywhere
            </p>

            {/* URL field */}
            <div className={`flex items-center border rounded-lg px-3 py-2 gap-2 transition-colors ${editingUrl ? "border-[#66A6FF] ring-1 ring-[#B2D3FF]" : "border-[#DCDCDC]"}`}>
              {editingUrl ? (
                <input
                  autoFocus
                  value={draftUrl}
                  onChange={(e) => setDraftUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") { setDraftUrl(url); setEditingUrl(false); } }}
                  className="flex-1 text-[13px] text-[#5A5C60] outline-none min-w-0"
                />
              ) : (
                <span className="flex-1 text-[13px] text-[#5A5C60] truncate min-w-0">{url}</span>
              )}
              {!urlSaved && (
                <button
                  onClick={() => setEditingUrl((v) => !v)}
                  className="text-[#95979C] hover:text-[#006BFF] transition-colors shrink-0"
                  aria-label="Edit URL"
                >
                  <PencilIcon className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={handleCopy}
                className={`transition-colors shrink-0 ${copied ? "text-[#079455]" : "text-[#95979C] hover:text-[#006BFF]"}`}
                aria-label="Copy URL"
              >
                <CopyIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Save button — only shown when URL is being edited and changed */}
            {urlDirty && editingUrl && (
              <button
                onClick={handleSaveUrl}
                className="mt-2 w-full py-2 bg-[#006BFF] hover:bg-[#0056CC] text-white text-[13px] font-semibold rounded-lg transition-colors"
              >
                Save Username
              </button>
            )}

            {copied && (
              <p className="text-[11px] text-[#079455] text-center mt-1.5">Copied to clipboard!</p>
            )}
          </div>

          {/* SHARE ON */}
          <div>
            <p className="text-[10px] font-semibold text-[#95979C] uppercase tracking-widest mb-3">
              Share On
            </p>
            <div className="grid grid-cols-5 gap-y-4 gap-x-2">
              {PLATFORMS.map(({ label, bg, icon }) => (
                <button
                  key={label}
                  className="flex flex-col items-center gap-1.5 group"
                >
                  <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                    {icon}
                  </div>
                  <span className="text-[10px] text-[#86888D] leading-none">{label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>
      </aside>

      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onHide={() => setToast((t) => ({ ...t, isVisible: false }))}
      />
    </>
  );
}
