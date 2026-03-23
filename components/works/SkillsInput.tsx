"use client";

import { useState, useRef, useEffect } from "react";
import { SearchIcon } from "@/components/icons";
import { ALL_SKILLS } from "@/components/shared/skills";

// ─── Props ────────────────────────────────────────────────────────────────────

interface SkillsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  chipVariant?: "blue-light" | "blue-bordered";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SkillsInput({ tags, onChange, chipVariant = "blue-light" }: SkillsInputProps) {
  const [input,     setInput]     = useState("");
  const [open,      setOpen]      = useState(false);
  const containerRef              = useRef<HTMLDivElement>(null);

  const filtered = ALL_SKILLS.filter(
    (s) =>
      s.toLowerCase().includes(input.toLowerCase()) &&
      !tags.includes(s)
  );

  function addTag(tag: string) {
    const v = tag.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
    setOpen(false);
  }

  function commitFromInput() {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
    setOpen(false);
  }

  function removeTag(tag: string) {
    onChange(tags.filter((t) => t !== tag));
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const chipClass =
    chipVariant === "blue-bordered"
      ? "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#E6F0FF] text-[#004099] border border-[#B2D3FF]"
      : "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-[#E6F0FF] text-[#004099]";

  return (
    <div>
      {/* Tag chips */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {tags.map((tag) => (
            <span key={tag} className={chipClass}>
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-[#66A6FF] hover:text-[#006BFF] leading-none text-sm ml-0.5"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input + dropdown */}
      <div ref={containerRef} className="relative">
        <div className="flex items-center gap-2 bg-[#FDFDFD] border border-[#DCDCDC] rounded-lg px-3 py-2.5 focus-within:border-[#66A6FF] focus-within:ring-1 focus-within:ring-[#B2D3FF] transition-colors">
          <SearchIcon className="w-4 h-4 text-[#95979C] shrink-0" />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commitFromInput(); }
              if (e.key === "Escape") { setOpen(false); }
            }}
            placeholder="Search or add a skill..."
            className="flex-1 text-[13px] text-[#5A5C60] placeholder-[#95979C] outline-none bg-transparent"
          />
        </div>

        {/* Suggestions dropdown */}
        {open && input.length > 0 && filtered.length > 0 && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl shadow-lg overflow-hidden max-h-44 overflow-y-auto">
            {filtered.map((skill) => (
              <button
                key={skill}
                onMouseDown={(e) => e.preventDefault()} // keep input focused
                onClick={() => addTag(skill)}
                className="w-full text-left px-3 py-2 text-[13px] text-[#5A5C60] hover:bg-[#E6F0FF] hover:text-[#004099] transition-colors"
              >
                {/* Highlight the matched portion */}
                {highlightMatch(skill, input)}
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-[11px] text-[#95979C] mt-1.5">Press Enter to add a custom skill</p>
    </div>
  );
}

// ─── Highlight matching text ──────────────────────────────────────────────────

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-[#006BFF]">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
}
