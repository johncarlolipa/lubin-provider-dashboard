"use client";

import { useState, useEffect, useRef } from "react";
import { VideoIcon, PlusIcon } from "@/components/icons";
import SkillsInput from "./SkillsInput";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FilePreview {
  url: string;
  isVideo: boolean;
}

interface AddWorkSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, tags: string[], thumbnails: string[]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddWorkSidebar({ isOpen, onClose, onAdd }: AddWorkSidebarProps) {
  const [title,    setTitle]    = useState("");
  const [tags,     setTags]     = useState<string[]>([]);
  const [previews, setPreviews] = useState<FilePreview[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Side effects ────────────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setTags([]);
      setPreviews([]);
    }
  }, [isOpen]);

  // ── File handling ───────────────────────────────────────────────────────────

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const items: FilePreview[] = Array.from(fileList).map((f) => ({
      url: URL.createObjectURL(f),
      isVideo: f.type.startsWith("video"),
    }));
    setPreviews((prev) => [...prev, ...items]);
  }

  function removeFile(index: number) {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!title.trim() || previews.length === 0) return;
    onAdd(title.trim(), tags, previews.map((p) => p.url));
    onClose();
  }

  const canSubmit = title.trim().length > 0 && previews.length > 0 && tags.length > 0;

  // ── Render ──────────────────────────────────────────────────────────────────

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#FDFDFD] shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-[#002B66] px-5 py-4 flex items-start justify-between shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-white leading-snug">Add Proof of Work</h2>
            <p className="text-[12px] text-[#95979C] mt-0.5">Showcase your best skills and experience.</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-[#95979C] hover:text-white text-xl leading-none mt-0.5">
            ×
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6 bg-[#FBFBFB]">

          {/* ── Photos & Videos ── */}
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A1D] mb-2 block">
              Photos &amp; Videos <span className="text-[#D92D20]">*</span>
            </label>

            {/* Hidden file input — multiple */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,video/mp4,video/quicktime"
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />

            {previews.length === 0 ? (
              /* Empty state — big drop zone */
              <div
                onClick={() => fileInputRef.current?.click()}
                className="bg-[#FDFDFD] border-2 border-dashed border-[#DCDCDC] rounded-xl flex flex-col items-center justify-center py-10 px-6 cursor-pointer hover:border-[#66A6FF] hover:bg-[#E6F0FF]/20 transition-colors"
              >
                <div className="w-10 h-10 bg-[#EFEFEF] rounded-full flex items-center justify-center mb-3">
                  <PlusIcon className="w-5 h-5 text-[#95979C]" />
                </div>
                <p className="text-[13px] font-medium text-[#5A5C60] mb-1">Click to upload or drag &amp; drop</p>
                <p className="text-[12px] text-[#95979C] text-center">Images (JPG, PNG) &amp; Videos (MP4, MOV)</p>
              </div>
            ) : (
              /* File grid */
              <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-3">
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((item, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-[#EFEFEF]">
                      {item.isVideo ? (
                        <div className="w-full h-full flex items-center justify-center bg-[#1A1A1D]">
                          <VideoIcon className="w-7 h-7 text-[#BFBFBF]" />
                        </div>
                      ) : (
                        <img src={item.url} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-[#202124]/70 hover:bg-[#202124] rounded-full flex items-center justify-center text-white text-[11px] leading-none transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {/* Add more cell */}
                  <button
                    onClick={() => { if (fileInputRef.current) { fileInputRef.current.value = ""; fileInputRef.current.click(); } }}
                    className="aspect-square rounded-lg border-2 border-dashed border-[#BFBFBF] flex flex-col items-center justify-center gap-1 hover:border-[#66A6FF] hover:bg-[#E6F0FF]/30 transition-colors"
                  >
                    <span className="text-[22px] text-[#95979C] leading-none">+</span>
                    <span className="text-[10px] text-[#95979C]">Add more</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Work Title ── */}
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A1D] mb-2 block">
              Work Title <span className="text-[#D92D20]">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Career Development"
              className="w-full text-[13px] text-[#5A5C60] placeholder-[#95979C] bg-[#FDFDFD] border border-[#DCDCDC] rounded-lg px-3 py-2.5 outline-none focus:border-[#66A6FF] focus:ring-1 focus:ring-[#B2D3FF] transition-colors"
            />
          </div>

          {/* ── Skills / Tags ── */}
          <div>
            <label className="text-[13px] font-semibold text-[#1A1A1D] mb-2 block">Skills / Tags <span className="text-[#D92D20]">*</span></label>
            <SkillsInput tags={tags} onChange={setTags} chipVariant="blue-light" />
          </div>

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
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`flex-1 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-colors ${
              canSubmit ? "bg-[#006BFF] hover:bg-[#0056CC]" : "bg-[#66A6FF] cursor-not-allowed"
            }`}
          >
            Add Work
          </button>
        </div>
      </aside>
    </>
  );
}
