"use client";

import { useState } from "react";
import {
  LubinLogoMark,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  VideoIcon,
  GlobeIcon,
} from "@/components/icons";
import Footer from "@/components/layout/Footer";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AvailabilityPreviewProps {
  onExit: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS_OF_WEEK   = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_ABBREV     = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES    = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const TIME_SLOTS_12H = [
  "11:00 am","12:00 pm","1:00 pm","2:00 pm",
  "3:00 pm","4:00 pm","5:00 pm","6:00 pm",
];
const TIME_SLOTS_24H = [
  "11:00","12:00","13:00","14:00",
  "15:00","16:00","17:00","18:00",
];

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AvailabilityPreview({ onExit }: AvailabilityPreviewProps) {
  const today = new Date();

  const [viewYear,      setViewYear]      = useState(today.getFullYear());
  const [viewMonth,     setViewMonth]     = useState(today.getMonth());
  const [selectedDate,  setSelectedDate]  = useState(today.getDate());
  const [timeFormat,    setTimeFormat]    = useState<"12h" | "24h">("12h");

  // ── Calendar grid ──────────────────────────────────────────────────────────

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  // ── Month navigation ───────────────────────────────────────────────────────

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
    setSelectedDate(1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
    setSelectedDate(1);
  }

  // ── Derived ────────────────────────────────────────────────────────────────

  const selectedDow  = new Date(viewYear, viewMonth, selectedDate).getDay();
  const timeSlots    = timeFormat === "12h" ? TIME_SLOTS_12H : TIME_SLOTS_24H;
  const isCurrentMonth =
    viewMonth === today.getMonth() && viewYear === today.getFullYear();

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBFB]">

      {/* ── Preview Navbar ── */}
      <header className="bg-[#FDFDFD] border-b border-[#DCDCDC] h-14 flex items-center px-6 relative shrink-0">
        {/* Logo */}
        <div className="flex items-center">
          <LubinLogoMark fill="#002B66" height={20} />
        </div>

        {/* Center pill */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="border border-[#BFBFBF] rounded-full px-4 py-1.5 text-[13px] text-[#5A5C60] bg-[#FDFDFD]">
            This is a preview of your availability.
          </span>
        </div>

        {/* Avatar */}
        <div className="ml-auto">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[12px] font-bold shadow-sm"
            style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }}
          >
            CM
          </div>
        </div>
      </header>

      {/* ── Exit Preview ── */}
      <div className="px-6 pt-4 pb-1">
        <button
          onClick={onExit}
          className="flex items-center gap-1 text-[13px] text-[#5A5C60] hover:text-[#202124] transition-colors"
        >
          <ChevronLeftIcon className="w-3.5 h-3.5" />
          Exit Preview
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex items-start gap-6 px-6 py-6 max-w-[1100px] mx-auto w-full">

        {/* Left: Coach card */}
        <div className="w-[200px] shrink-0 flex flex-col gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white text-[14px] font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)" }}
          >
            CM
          </div>

          <h2 className="text-[15px] font-bold text-[#202124] leading-snug">Carol Morgan</h2>

          <p className="text-[12px] text-[#86888D] leading-relaxed">
            I&apos;m Dr. Carol, a Certified Life Coach dedicated to helping individuals unlock their potential.
          </p>

          <div className="flex flex-col gap-2.5 mt-1">
            <div className="flex items-center gap-2 text-[12px] text-[#5A5C60]">
              <ClockIcon className="w-3.5 h-3.5 text-[#95979C] shrink-0" />
              <span>1h</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#5A5C60]">
              <VideoIcon className="w-3.5 h-3.5 text-[#95979C] shrink-0" />
              <span>Cal Video</span>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#5A5C60]">
              <GlobeIcon className="w-3.5 h-3.5 text-[#95979C] shrink-0" />
              <span>Asia/Manila</span>
            </div>
          </div>
        </div>

        {/* Middle: Calendar */}
        <div className="flex-1 bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl p-5 shadow-sm">

          {/* Month header */}
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[17px] font-bold text-[#202124]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            <div className="flex items-center gap-0.5">
              <button
                onClick={prevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#86888D] hover:bg-[#EFEFEF] transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#86888D] hover:bg-[#EFEFEF] transition-colors"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_OF_WEEK.map((d) => (
              <div
                key={d}
                className="text-center text-[11px] font-semibold text-[#95979C] py-1.5 tracking-wide"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Date rows */}
          {rows.map((row, ri) => (
            <div key={ri} className="grid grid-cols-7 border-t border-[#EFEFEF]">
              {row.map((day, ci) => {
                const isSelected   = day === selectedDate;
                const isTodayCell  = isCurrentMonth && day === today.getDate();
                return (
                  <div
                    key={ci}
                    className="h-14 flex items-start justify-start pl-1.5 pt-1.5"
                  >
                    {day !== null && (
                      <button
                        onClick={() => setSelectedDate(day)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-medium transition-colors ${
                          isSelected
                            ? "bg-[#006BFF] text-white font-semibold"
                            : isTodayCell
                            ? "border border-[#66A6FF] text-[#006BFF]"
                            : "text-[#5A5C60] hover:bg-[#EFEFEF]"
                        }`}
                      >
                        {day}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Right: Time slots */}
        <div className="w-[190px] shrink-0">
          {/* Day label + 12h/24h toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] font-bold text-[#202124]">
              {DAY_ABBREV[selectedDow]} {selectedDate}
            </span>
            <div className="flex items-center rounded-lg border border-[#DCDCDC] bg-[#FBFBFB] overflow-hidden text-[11px] font-semibold">
              <button
                onClick={() => setTimeFormat("12h")}
                className={`px-2.5 py-1 transition-colors ${
                  timeFormat === "12h"
                    ? "bg-[#FDFDFD] text-[#1A1A1D] shadow-sm"
                    : "text-[#95979C] hover:text-[#5A5C60]"
                }`}
              >
                12h
              </button>
              <button
                onClick={() => setTimeFormat("24h")}
                className={`px-2.5 py-1 transition-colors ${
                  timeFormat === "24h"
                    ? "bg-[#FDFDFD] text-[#1A1A1D] shadow-sm"
                    : "text-[#95979C] hover:text-[#5A5C60]"
                }`}
              >
                24h
              </button>
            </div>
          </div>

          {/* Time slot list */}
          <div className="flex flex-col gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                className="w-full py-3 bg-[#FDFDFD] border border-[#DCDCDC] rounded-lg text-[13px] font-medium text-[#006BFF] hover:border-[#66A6FF] hover:bg-[#E6F0FF] transition-colors"
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
}
