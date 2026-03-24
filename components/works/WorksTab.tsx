"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { DotsVerticalIcon, PlayIcon, TrashIcon, PencilIcon, PlusIcon } from "@/components/icons";
import AddWorkSidebar from "./AddWorkSidebar";
import EditWorkSidebar from "./EditWorkSidebar";
import RemoveWorkSidebar from "./RemoveWorkSidebar";
import Toast from "@/components/shared/Toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkItem {
  id: number;
  title: string;
  tags: string[];
  gradient: string;
  thumbnails: string[];
  hasVideo?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_WORKS: WorkItem[] = [
  {
    id: 1,
    title: "Career Development",
    tags: ["Self Awareness", "Time Management"],
    gradient: "from-indigo-600 via-blue-500 to-blue-400",
    thumbnails: [],
  },
  {
    id: 2,
    title: "Leadership Management",
    tags: ["Self Awareness", "Time Management"],
    gradient: "from-pink-400 to-rose-400",
    thumbnails: [],
  },
  {
    id: 3,
    title: "Personal Development",
    tags: ["Self Awareness", "Time Management"],
    gradient: "from-teal-400 to-cyan-300",
    thumbnails: [],
  },
  {
    id: 4,
    title: "Leadership Management",
    tags: ["Self Awareness", "Time Management"],
    gradient: "from-green-400 to-emerald-400",
    thumbnails: [],
  },
  {
    id: 5,
    title: "Career Development",
    tags: ["Self Awareness", "Time Management"],
    gradient: "from-orange-400 to-yellow-300",
    thumbnails: [],
    hasVideo: true,
  },
];

// ─── Work Card Menu ───────────────────────────────────────────────────────────

interface CardMenuProps {
  isOpen: boolean;
  onEdit: () => void;
  onRemove: () => void;
  onClose: () => void;
}

function CardMenu({ isOpen, onEdit, onRemove, onClose }: CardMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-9 right-0 z-30 w-36 bg-[#FDFDFD] rounded-xl shadow-xl border border-[#EFEFEF] overflow-hidden"
    >
      <button
        onClick={onEdit}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors text-left"
      >
        <PencilIcon className="w-3.5 h-3.5 text-[#86888D] shrink-0" />
        Edit
      </button>
      <div className="mx-3 h-px bg-[#EFEFEF]" />
      <button
        onClick={onRemove}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#D92D20] hover:bg-[#FEE4E2] transition-colors text-left"
      >
        <TrashIcon className="w-3.5 h-3.5 text-[#D92D20] shrink-0" />
        Remove
      </button>
    </div>
  );
}

// ─── Work Card ────────────────────────────────────────────────────────────────

interface WorkCardProps {
  work: WorkItem;
  onEditClick:   (work: WorkItem) => void;
  onRemoveClick: (work: WorkItem) => void;
}

function WorkCard({ work, onEditClick, onRemoveClick }: WorkCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleEdit   = useCallback(() => { setMenuOpen(false); onEditClick(work);   }, [work, onEditClick]);
  const handleRemove = useCallback(() => { setMenuOpen(false); onRemoveClick(work); }, [work, onRemoveClick]);

  const hasThumb  = work.thumbnails.length > 0;
  const extraFiles = work.thumbnails.length - 1;

  // Tags: show first 2, then +N badge
  const visibleTags = work.tags.slice(0, 2);
  const extraTags   = work.tags.length - 2;

  return (
    <div>
      {/* Thumbnail */}
      <div className={`relative h-[150px] rounded-xl mb-3 overflow-hidden ${!hasThumb ? `bg-gradient-to-br ${work.gradient}` : "bg-[#EFEFEF]"}`}>

        {/* Uploaded image */}
        {hasThumb && (
          <img
            src={work.thumbnails[0]}
            alt={work.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Video play overlay */}
        {work.hasVideo && !hasThumb && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-11 h-11 rounded-full bg-[#FDFDFD]/25 backdrop-blur-sm flex items-center justify-center">
              <PlayIcon className="w-5 h-5 text-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* +N badge for extra files */}
        {extraFiles > 0 && (
          <div className="absolute bottom-2 right-2 bg-[#202124]/70 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            +{extraFiles}
          </div>
        )}

        {/* Three-dots button + dropdown */}
        <div className="absolute top-2.5 right-2.5">
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            className="w-7 h-7 bg-[#FDFDFD] rounded-lg shadow-sm flex items-center justify-center text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors"
          >
            <DotsVerticalIcon className="w-[14px] h-[14px]" />
          </button>

          <CardMenu
            isOpen={menuOpen}
            onEdit={handleEdit}
            onRemove={handleRemove}
            onClose={() => setMenuOpen(false)}
          />
        </div>
      </div>

      {/* Tags — max 2 visible, then +N — no wrap so +N stays inline */}
      <div className="flex items-center gap-1.5 overflow-hidden mb-1.5">
        {visibleTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E6F0FF] text-[#006BFF]"
          >
            {tag}
          </span>
        ))}
        {extraTags > 0 && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#EFEFEF] text-[#86888D]">
            +{extraTags}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-[14px] font-bold text-[#202124] leading-snug">{work.title}</h3>
    </div>
  );
}

// ─── Add proof of work card ───────────────────────────────────────────────────

function AddWorkCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center justify-center h-[150px] w-full rounded-xl border-2 border-dashed border-[#BFBFBF] hover:border-[#66A6FF] hover:bg-[#E6F0FF]/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-full border-2 border-[#BFBFBF] group-hover:border-[#66A6FF] flex items-center justify-center mb-3 transition-colors">
        <PlusIcon className="w-4 h-4 text-[#95979C] group-hover:text-[#006BFF] transition-colors" />
      </div>
      <p className="text-[13px] font-semibold text-[#5A5C60] mb-1">Add proof of work</p>
      <p className="text-[12px] text-[#95979C] text-center leading-snug px-4">
        Highlight your best skills and experience.
      </p>
    </button>
  );
}

// ─── Works Tab (root) ─────────────────────────────────────────────────────────

const GRADIENTS = [
  "from-indigo-600 via-blue-500 to-blue-400",
  "from-pink-400 to-rose-400",
  "from-teal-400 to-cyan-300",
  "from-green-400 to-emerald-400",
  "from-orange-400 to-yellow-300",
  "from-purple-500 to-indigo-400",
  "from-red-400 to-orange-300",
];

export default function WorksTab() {
  const [works,      setWorks]      = useState<WorkItem[]>(INITIAL_WORKS);
  const [addOpen,    setAddOpen]    = useState(false);
  const [editWork,   setEditWork]   = useState<WorkItem | null>(null);
  const [removeWork, setRemoveWork] = useState<WorkItem | null>(null);
  const [toast,      setToast]      = useState<string | null>(null);

  function handleAdd(title: string, tags: string[], thumbnails: string[]) {
    const gradient = GRADIENTS[works.length % GRADIENTS.length];
    setWorks((prev) => [...prev, { id: Date.now(), title, tags, gradient, thumbnails }]);
    setToast("Work added successfully");
  }

  function handleEditSave(id: number, title: string, tags: string[], thumbnails: string[]) {
    setWorks((prev) => prev.map((w) => w.id === id ? { ...w, title, tags, thumbnails } : w));
    setToast("Work updated successfully");
  }

  function handleRemoveConfirm(id: number) {
    setWorks((prev) => prev.filter((w) => w.id !== id));
    setToast("Work removed successfully");
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-x-5 gap-y-6">

        {/* Add card — always first */}
        <AddWorkCard onClick={() => setAddOpen(true)} />

        {/* Work items */}
        {works.map((work) => (
          <WorkCard
            key={work.id}
            work={work}
            onEditClick={setEditWork}
            onRemoveClick={setRemoveWork}
          />
        ))}

      </div>

      <AddWorkSidebar
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAdd}
      />

      <EditWorkSidebar
        work={editWork}
        onClose={() => setEditWork(null)}
        onSave={handleEditSave}
      />

      <RemoveWorkSidebar
        work={removeWork}
        onClose={() => setRemoveWork(null)}
        onConfirm={handleRemoveConfirm}
      />

      <Toast
        message={toast ?? ""}
        isVisible={!!toast}
        onHide={() => setToast(null)}
      />
    </>
  );
}
