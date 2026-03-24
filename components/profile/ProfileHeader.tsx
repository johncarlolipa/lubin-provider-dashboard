"use client";

import { useState, useRef, useEffect } from "react";
import {
  PencilIcon,
  MapPinIcon,
  ShareIcon,
  FacebookIcon,
  XIcon,
  InstagramIcon,
  YoutubeIcon,
  LinkedinIcon,
  CameraIcon,
} from "@/components/icons";
import type { SocialLink, SocialPlatform } from "@/components/types";
import Toast from "@/components/shared/Toast";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ProfileHeaderProps {
  onShareClick: () => void;
  onSocialLinksClick: () => void;
  socialLinks: SocialLink[];
}

// ─── Platform → icon mapping ──────────────────────────────────────────────────

const PLATFORM_ICON: Record<SocialPlatform, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  facebook:  { icon: FacebookIcon,  color: "text-[#1877F2]" },
  twitter:   { icon: XIcon,         color: "text-[#202124]"  },
  instagram: { icon: InstagramIcon, color: "text-[#E4405F]" },
  youtube:   { icon: YoutubeIcon,   color: "text-[#FF0000]" },
  linkedin:  { icon: LinkedinIcon,  color: "text-[#0A66C2]" },
};

// ─── Cancel / Save pill buttons ───────────────────────────────────────────────

function EditActions({ onCancel, onSave, small = false }: { onCancel: () => void; onSave: () => void; small?: boolean }) {
  const py   = small ? "py-1"   : "py-1.5";
  const px   = small ? "px-3"   : "px-4";
  const text = small ? "text-[12px]" : "text-[13px]";
  return (
    <div className="flex items-center gap-2">
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCancel}
        className={`${px} ${py} ${text} font-medium border border-[#BFBFBF] rounded-full text-[#5A5C60] bg-[#FDFDFD] hover:bg-[#FBFBFB] transition-colors`}
      >
        Cancel
      </button>
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={onSave}
        className={`${px} ${py} ${text} font-medium bg-[#006BFF] hover:bg-[#0056CC] rounded-full text-white transition-colors`}
      >
        Save
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileHeader({ onShareClick, onSocialLinksClick, socialLinks }: ProfileHeaderProps) {
  const [name,     setName]     = useState("Dr. Carol Morgan");
  const [bio,      setBio]      = useState("I'm Dr. Carol, a Certified Life Coach dedicated to helping individuals unlock their potential and achieve their goals.");
  const [location, setLocation] = useState("Los Angeles, CA");

  const [nameDraft,     setNameDraft]     = useState("");
  const [bioDraft,      setBioDraft]      = useState("");
  const [locationDraft, setLocationDraft] = useState("");

  const [editingName,     setEditingName]     = useState(false);
  const [editingBio,      setEditingBio]      = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);

  const [toast, setToast] = useState({ message: "", isVisible: false });

  const nameRef     = useRef<HTMLInputElement>(null);
  const bioRef      = useRef<HTMLTextAreaElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (editingName)     nameRef.current?.focus();     }, [editingName]);
  useEffect(() => { if (editingBio)      bioRef.current?.focus();      }, [editingBio]);
  useEffect(() => { if (editingLocation) locationRef.current?.focus(); }, [editingLocation]);

  function showToast(msg: string) { setToast({ message: msg, isVisible: true }); }

  function startEditName()     { setNameDraft(name);     setEditingName(true);     }
  function cancelName()        { setEditingName(false);                             }
  function saveName()          { if (nameDraft.trim()) setName(nameDraft.trim()); setEditingName(false); showToast("Name updated"); }

  function startEditBio()      { setBioDraft(bio);      setEditingBio(true);       }
  function cancelBio()         { setEditingBio(false);                              }
  function saveBio()           { if (bioDraft.trim()) setBio(bioDraft.trim()); setEditingBio(false); showToast("Bio updated"); }

  function startEditLocation() { setLocationDraft(location); setEditingLocation(true);  }
  function cancelLocation()    { setEditingLocation(false);                               }
  function saveLocation()      { if (locationDraft.trim()) setLocation(locationDraft.trim()); setEditingLocation(false); showToast("Location updated"); }

  return (
    <>
    <section className="bg-gradient-to-b from-blue-50 to-slate-50 py-8 px-6">
      <div className="max-w-3xl mx-auto flex flex-col items-center gap-3">

        {/* Avatar */}
        <div className="relative mb-1 group/avatar">
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-56 bg-[#002B66] text-white text-[12px] leading-relaxed rounded-xl px-3.5 py-2.5 text-center pointer-events-none opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200 z-[200] whitespace-normal shadow-xl">
            Upload a professional, high-quality photo to help build trust and attract more clients to your profile.
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-[7px] border-transparent border-t-[#002B66]" />
          </div>
          <div
            className="relative w-[88px] h-[88px] rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md cursor-pointer overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }}
          >
            DC
            <div className="absolute inset-0 rounded-full bg-black/45 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200">
              <CameraIcon className="w-7 h-7 text-white" />
            </div>
          </div>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-[#079455] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-sm z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FDFDFD] inline-block" />
            Available
          </span>
        </div>

        {/* ── Name ── */}
        {editingName ? (
          <div className="flex flex-col items-center gap-2 mt-2">
            <input
              ref={nameRef}
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelName(); }}
              className="text-[21px] font-extrabold text-[#202124] text-center bg-transparent border-0 border-b-2 border-[#006BFF] outline-none w-72 pb-0.5"
            />
            <EditActions onCancel={cancelName} onSave={saveName} />
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mt-2">
            <h1 className="text-[21px] font-extrabold text-[#202124]">{name}</h1>
            <button aria-label="Edit name" onClick={startEditName} className="text-[#95979C] hover:text-[#006BFF] transition-colors">
              <PencilIcon className="w-[14px] h-[14px]" />
            </button>
          </div>
        )}

        {/* ── Bio ── */}
        {editingBio ? (
          <div className="flex flex-col items-center gap-2 w-full max-w-sm">
            <textarea
              ref={bioRef}
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") cancelBio(); }}
              rows={3}
              className="w-full resize-none text-[13px] text-[#5A5C60] text-center leading-relaxed border border-[#66A6FF] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#B2D3FF]"
            />
            <EditActions onCancel={cancelBio} onSave={saveBio} />
          </div>
        ) : (
          <div className="flex items-start justify-center gap-1 max-w-sm">
            <p className="text-[13px] text-[#86888D] text-center leading-relaxed">{bio}</p>
            <button aria-label="Edit bio" onClick={startEditBio} className="text-[#95979C] hover:text-[#006BFF] transition-colors shrink-0 mt-1">
              <PencilIcon className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* ── Location + Socials + Share row ── */}
        <div className="flex items-center gap-12 flex-wrap justify-center">

          {/* Location */}
          <div className="flex items-center gap-1 text-[13px] text-[#86888D]">
            <MapPinIcon className="w-[15px] h-[15px] text-[#95979C] shrink-0" />
            {editingLocation ? (
              <>
                <input
                  ref={locationRef}
                  value={locationDraft}
                  onChange={(e) => setLocationDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveLocation(); if (e.key === "Escape") cancelLocation(); }}
                  className="text-[13px] text-[#5A5C60] bg-transparent border-0 border-b border-[#A1A1A1] focus:border-[#006BFF] outline-none w-32 pb-0.5"
                />
                <div className="ml-1">
                  <EditActions onCancel={cancelLocation} onSave={saveLocation} small />
                </div>
              </>
            ) : (
              <>
                <span>{location}</span>
                <button aria-label="Edit location" onClick={startEditLocation} className="text-[#95979C] hover:text-[#006BFF] transition-colors ml-0.5">
                  <PencilIcon className="w-3 h-3" />
                </button>
              </>
            )}
          </div>

          <div className="w-px h-4 bg-[#BFBFBF]" />

          {/* Social icons — rendered from live savedLinks state */}
          <div className="flex items-center gap-1.5">
            {socialLinks.map((link) => {
              const { icon: Icon, color } = PLATFORM_ICON[link.platform];
              return (
                <button
                  key={link.id}
                  aria-label={link.platform}
                  className={`w-8 h-8 rounded-full bg-[#FDFDFD] border border-[#DCDCDC] shadow-sm flex items-center justify-center ${color} hover:shadow-md transition-shadow`}
                >
                  <Icon />
                </button>
              );
            })}
            <button
              aria-label="Add social link"
              onClick={onSocialLinksClick}
              className="w-8 h-8 rounded-full bg-[#FDFDFD] border border-[#DCDCDC] shadow-sm flex items-center justify-center text-[#86888D] text-[18px] font-light leading-none hover:shadow-md transition-shadow"
            >
              +
            </button>
          </div>

          <div className="w-px h-4 bg-[#BFBFBF]" />

          {/* Share button */}
          <button
            onClick={onShareClick}
            className="flex items-center gap-2 px-5 py-2 bg-[#FDFDFD] border border-[#BFBFBF] rounded-full text-[13px] font-medium text-[#5A5C60] shadow-sm hover:bg-[#FBFBFB] transition-colors"
          >
            Share profile
            <ShareIcon className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>

    <Toast
      message={toast.message}
      isVisible={toast.isVisible}
      onHide={() => setToast((t) => ({ ...t, isVisible: false }))}
    />
    </>
  );
}
