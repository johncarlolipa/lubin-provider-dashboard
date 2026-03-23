"use client";

import { useState, useRef, useEffect } from "react";
import { LubinLogoMark, ChatIcon, CogIcon, LogoutIcon } from "@/components/icons";

export default function Navbar() {
  const [open, setOpen]     = useState(false);
  const dropdownRef         = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="h-14 bg-[#FDFDFD] border-b border-[#DCDCDC] flex items-center justify-between px-6 shrink-0 z-20 relative">
      <div className="flex items-center">
        <LubinLogoMark fill="#002B66" height={22} />
      </div>

      {/* Avatar + Dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          aria-label="Open account menu"
          onClick={() => setOpen((o) => !o)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shadow-sm focus:outline-none"
          style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }}
        >
          CM
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 top-[calc(100%+10px)] w-[220px] bg-[#FDFDFD] rounded-2xl shadow-xl border border-[#EFEFEF] overflow-hidden z-50">

            {/* User info */}
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }}
              >
                CM
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#202124] leading-snug">Carol Morgan</p>
                <p className="text-[12px] text-[#95979C]">Life Coach</p>
              </div>
            </div>

            <div className="h-px bg-[#EFEFEF] mx-0" />

            {/* Menu items */}
            <div className="py-1.5">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors text-left">
                <ChatIcon className="w-4 h-4 text-[#95979C] shrink-0" />
                AI Chat
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors text-left">
                <CogIcon className="w-4 h-4 text-[#95979C] shrink-0" />
                Account Settings
              </button>
            </div>

            <div className="h-px bg-[#EFEFEF]" />

            <div className="py-1.5">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-[#D92D20] hover:bg-[#FEE4E2] transition-colors text-left">
                <LogoutIcon className="w-4 h-4 text-[#D92D20] shrink-0" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
