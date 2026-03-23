"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@/components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = "upcoming" | "completed" | "cancelled";

interface Appointment {
  id: number;
  title: string;
  description: string;
  price: string;
  date: string;
  time: string;
  client: string;
  filter: FilterType;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const APPOINTMENTS: Appointment[] = [
  // Upcoming
  {
    id: 1,
    title: "Career Development",
    description: "One-on-one guidance to help you navigate your career path.",
    price: "₱120.00",
    date: "March 15, 2025",
    time: "10:00 AM",
    client: "Carol Morgan",
    filter: "upcoming",
  },
  {
    id: 2,
    title: "Financial Management",
    description: "Expert advice on personal finance and budgeting.",
    price: "₱120.00",
    date: "March 20, 2025",
    time: "9:00 AM",
    client: "Mike Brown",
    filter: "upcoming",
  },
  {
    id: 3,
    title: "Leadership Management",
    description: "Expert guidance on leadership strategies.",
    price: "₱120.00",
    date: "March 20, 2025",
    time: "9:00 AM",
    client: "Mike Brown",
    filter: "upcoming",
  },
  // Completed
  {
    id: 4,
    title: "Leadership Skills Workshop",
    description: "Developing key leadership skills for the modern workplace.",
    price: "₱75.00",
    date: "March 1, 2025",
    time: "2:00 PM",
    client: "Mike Brown",
    filter: "completed",
  },
  {
    id: 5,
    title: "Personal Growth Session",
    description: "Helping you build habits and reach your full potential.",
    price: "₱75.00",
    date: "March 1, 2025",
    time: "2:00 PM",
    client: "Mike Brown",
    filter: "completed",
  },
  {
    id: 6,
    title: "Career Development",
    description: "One-on-one guidance to help you navigate your career path.",
    price: "₱75.00",
    date: "March 1, 2025",
    time: "2:00 PM",
    client: "Mike Brown",
    filter: "completed",
  },
  // Cancelled
  {
    id: 7,
    title: "Anxiety Management",
    description: "Session focused on evidence-based techniques.",
    price: "₱120.00",
    date: "March 18, 2025",
    time: "3:00 PM",
    client: "Carol Morgan",
    filter: "cancelled",
  },
  {
    id: 8,
    title: "Time Management Workshop",
    description: "Learn proven techniques to prioritize tasks.",
    price: "₱90.00",
    date: "March 22, 2025",
    time: "10:00 AM",
    client: "Mike Brown",
    filter: "cancelled",
  },
];

const FILTER_OPTIONS: { key: FilterType; label: string }[] = [
  { key: "upcoming",  label: "Upcoming"  },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

interface FilterDropdownProps {
  value: FilterType;
  onChange: (val: FilterType) => void;
}

function FilterDropdown({ value, onChange }: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = FILTER_OPTIONS.find((o) => o.key === value)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 pl-4 pr-3 py-2 bg-[#FDFDFD] border border-[#DCDCDC] rounded-lg text-[13px] font-medium text-[#5A5C60] shadow-sm hover:bg-[#FBFBFB] transition-colors"
      >
        {current.label}
        <ChevronDownIcon
          className={`w-4 h-4 text-[#95979C] transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-[#FDFDFD] border border-[#DCDCDC] rounded-lg shadow-lg z-20 py-1 overflow-hidden">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => { onChange(opt.key); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[13px] transition-colors ${
                opt.key === value
                  ? "bg-[#E6F0FF] text-[#006BFF] font-medium"
                  : "text-[#5A5C60] hover:bg-[#FBFBFB]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Meta line ───────────────────────────────────────────────────────────────
// Shared date · time · client row, with configurable text colour.

interface MetaLineProps {
  date: string;
  time: string;
  client: string;
  colorClass: string; // e.g. "text-[#86888D]" | "text-[#006BFF]"
}

function MetaLine({ date, time, client, colorClass }: MetaLineProps) {
  return (
    <p className={`text-[12px] ${colorClass}`}>
      {date}
      <span className="mx-1.5 opacity-50">·</span>
      {time}
      <span className="mx-1.5 opacity-50">·</span>
      Client:{" "}
      <span className="font-semibold">{client}</span>
    </p>
  );
}

// ─── Card variants ────────────────────────────────────────────────────────────

function UpcomingCard({ a }: { a: Appointment }) {
  return (
    <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-5 shadow-sm">
      <div className="flex items-start gap-4">

        {/* Left */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-[15px] font-bold text-[#202124] leading-snug">{a.title}</h3>
          <p className="text-[13px] text-[#86888D] leading-relaxed">{a.description}</p>
          <MetaLine date={a.date} time={a.time} client={a.client} colorClass="text-[#86888D]" />
          <div className="pt-1">
            <button className="px-5 py-2.5 bg-[#006BFF] hover:bg-[#0056CC] text-white text-[13px] font-semibold rounded-lg transition-colors">
              Join the Meeting
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 shrink-0 self-stretch">
          <span className="text-[15px] font-bold text-[#202124]">{a.price}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCF4E6] text-[#079455]">
            Paid
          </span>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-1.5 border border-[#66A6FF] text-[#006BFF] text-[12px] font-medium rounded-lg hover:bg-[#E6F0FF] transition-colors">
              Reschedule
            </button>
            <button className="px-3.5 py-1.5 border border-[#D92D20] text-[#D92D20] text-[12px] font-medium rounded-lg hover:bg-[#FEE4E2] transition-colors">
              Cancel
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function CompletedCard({ a }: { a: Appointment }) {
  return (
    <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-5 shadow-sm">
      <div className="flex items-start gap-4">

        {/* Left — no description for completed */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-[15px] font-bold text-[#202124] leading-snug">{a.title}</h3>
          <MetaLine date={a.date} time={a.time} client={a.client} colorClass="text-[#006BFF]" />
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[15px] font-bold text-[#202124]">{a.price}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#DCF4E6] text-[#079455]">
            Completed
          </span>
          <div className="flex items-center gap-2 mt-1">
            <button className="px-3.5 py-1.5 border border-[#BFBFBF] text-[#5A5C60] text-[12px] font-medium rounded-lg hover:bg-[#FBFBFB] transition-colors">
              Receipt
            </button>
            <button className="px-3.5 py-1.5 bg-[#006BFF] hover:bg-[#0056CC] text-white text-[12px] font-semibold rounded-lg transition-colors">
              Book Again
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function CancelledCard({ a }: { a: Appointment }) {
  return (
    <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-5 shadow-sm">
      <div className="flex items-start gap-4">

        {/* Left */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <h3 className="text-[15px] font-bold text-[#002B66] leading-snug">{a.title}</h3>
          <p className="text-[13px] text-[#86888D] leading-relaxed">{a.description}</p>
          <MetaLine date={a.date} time={a.time} client={a.client} colorClass="text-[#006BFF]" />
        </div>

        {/* Right — price + Cancelled badge only, no action buttons */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-[15px] font-bold text-[#202124]">{a.price}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEE4E2] text-[#D92D20]">
            Cancelled
          </span>
        </div>

      </div>
    </div>
  );
}

// ─── Card dispatcher ──────────────────────────────────────────────────────────

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  if (appointment.filter === "completed") return <CompletedCard a={appointment} />;
  if (appointment.filter === "cancelled") return <CancelledCard a={appointment} />;
  return <UpcomingCard a={appointment} />;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ filter }: { filter: FilterType }) {
  const messages: Record<FilterType, string> = {
    upcoming:  "No upcoming appointments.",
    completed: "No completed appointments yet.",
    cancelled: "No cancelled appointments.",
  };
  return (
    <div className="flex items-center justify-center h-40 text-[#95979C] text-[13px]">
      {messages[filter]}
    </div>
  );
}

// ─── Appointments Tab (root) ──────────────────────────────────────────────────

export default function AppointmentsTab() {
  const [filter, setFilter] = useState<FilterType>("upcoming");
  const visible = APPOINTMENTS.filter((a) => a.filter === filter);

  return (
    <div className="flex flex-col gap-4">

      {/* Filter row */}
      <div className="flex justify-end">
        <FilterDropdown value={filter} onChange={setFilter} />
      </div>

      {/* Cards */}
      {visible.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      )}

    </div>
  );
}
