"use client";

import { useState } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@/components/icons";
import Toast from "@/components/shared/Toast";
import type { DaySchedule } from "@/components/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateTimeOptions(): string[] {
  const times: string[] = [];
  for (let h = 6; h <= 22; h++) {
    const period = h < 12 ? "AM" : "PM";
    const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
    times.push(`${display}:00 ${period}`);
    if (h < 22) times.push(`${display}:30 ${period}`);
  }
  return times;
}

const TIME_OPTIONS = generateTimeOptions();

const TIMEZONES = [
  "Asia/Manila (UTC+8)",
  "Asia/Tokyo (UTC+9)",
  "Asia/Singapore (UTC+8)",
  "Australia/Sydney (UTC+11)",
  "Europe/London (UTC+0)",
  "Europe/Paris (UTC+1)",
  "America/New_York (UTC-5)",
  "America/Chicago (UTC-6)",
  "America/Denver (UTC-7)",
  "America/Los_Angeles (UTC-8)",
];

const INITIAL_SCHEDULE: DaySchedule[] = [
  { day: "Monday",    enabled: true,  startTime: "9:00 AM",  endTime: "5:00 PM" },
  { day: "Tuesday",   enabled: true,  startTime: "9:00 AM",  endTime: "5:00 PM" },
  { day: "Wednesday", enabled: false, startTime: "9:00 AM",  endTime: "5:00 PM" },
  { day: "Thursday",  enabled: true,  startTime: "10:00 AM", endTime: "3:00 PM" },
  { day: "Friday",    enabled: true,  startTime: "9:00 AM",  endTime: "5:00 PM" },
  { day: "Saturday",  enabled: false, startTime: "9:00 AM",  endTime: "5:00 PM" },
  { day: "Sunday",    enabled: false, startTime: "9:00 AM",  endTime: "5:00 PM" },
];

const SETTINGS_ITEMS = [
  "Default Availability",
  "Specific Day Overrides",
  "Time Zone Guide",
];

// ─── Sub-components ───────────────────────────────────────────────────────────

interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative inline-flex h-[22px] w-[38px] shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#006BFF] focus-visible:ring-offset-1 ${
        enabled ? "bg-[#006BFF]" : "bg-[#BFBFBF]"
      }`}
    >
      <span
        className={`inline-block h-[16px] w-[16px] transform rounded-full bg-[#FDFDFD] shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-[18px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}

interface TimeSelectProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

function TimeSelect({ value, onChange, disabled }: TimeSelectProps) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="appearance-none h-8 pl-3 pr-7 bg-[#FDFDFD] border border-[#DCDCDC] rounded-md text-[13px] text-[#5A5C60] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#66A6FF] focus:border-[#66A6FF] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {TIME_OPTIONS.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-1.5 w-3.5 h-3.5 text-[#95979C] pointer-events-none" />
    </div>
  );
}

// ─── Weekly Schedule ──────────────────────────────────────────────────────────

interface WeeklyScheduleProps {
  schedule: DaySchedule[];
  onToggleDay: (index: number) => void;
  onChangeTime: (index: number, field: "startTime" | "endTime", value: string) => void;
}

function WeeklySchedule({ schedule, onToggleDay, onChangeTime }: WeeklyScheduleProps) {
  return (
    <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#EFEFEF]">
        <h3 className="text-[14px] font-semibold text-[#202124]">Weekly Schedule</h3>
      </div>
      <ul>
        {schedule.map((day, i) => (
          <li
            key={day.day}
            className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 sm:px-5 py-3 ${
              i < schedule.length - 1 ? "border-b border-[#EFEFEF]" : ""
            }`}
          >
            {/* Row 1: Toggle + Day label */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Toggle enabled={day.enabled} onChange={() => onToggleDay(i)} />
              <span
                className={`w-[88px] text-[13px] font-medium shrink-0 ${
                  day.enabled ? "text-[#1A1A1D]" : "text-[#95979C]"
                }`}
              >
                {day.day}
              </span>
            </div>

            {/* Row 2 (mobile) / inline (desktop): Time range or Not available */}
            {day.enabled ? (
              <div className="flex items-center gap-1.5 sm:gap-2 pl-[46px] sm:pl-0">
                <TimeSelect
                  value={day.startTime}
                  onChange={(val) => onChangeTime(i, "startTime", val)}
                />
                <span className="text-[13px] text-[#95979C]">to</span>
                <TimeSelect
                  value={day.endTime}
                  onChange={(val) => onChangeTime(i, "endTime", val)}
                />
              </div>
            ) : (
              <span className="text-[13px] text-[#66A6FF] font-medium pl-[46px] sm:pl-0">Not available</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Timezone Card ────────────────────────────────────────────────────────────

interface TimezoneCardProps {
  timezone: string;
  onChange: (val: string) => void;
}

function TimezoneCard({ timezone, onChange }: TimezoneCardProps) {
  return (
    <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl shadow-sm p-5">
      <h3 className="text-[14px] font-semibold text-[#202124] mb-3">Timezone</h3>
      <div className="relative">
        <select
          value={timezone}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-[#FDFDFD] border border-[#DCDCDC] rounded-lg px-3 py-2.5 pr-9 text-[13px] text-[#5A5C60] cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#66A6FF] focus:border-[#66A6FF] transition-colors"
        >
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
        <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#95979C] pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Settings Card ────────────────────────────────────────────────────────────

function SettingsCard() {
  return (
    <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#EFEFEF]">
        <h3 className="text-[14px] font-semibold text-[#202124]">Settings</h3>
      </div>
      <ul>
        {SETTINGS_ITEMS.map((item, i) => (
          <li key={item}>
            <button
              className={`w-full flex items-center justify-between px-5 py-3.5 text-[13px] text-[#5A5C60] hover:bg-[#FBFBFB] transition-colors text-left ${
                i < SETTINGS_ITEMS.length - 1 ? "border-b border-[#EFEFEF]" : ""
              }`}
            >
              <span>{item}</span>
              <ChevronRightIcon className="w-4 h-4 text-[#95979C] shrink-0" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Set Unavailability ───────────────────────────────────────────────────────

function UnavailabilitySection() {
  return (
    <div className="bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl shadow-sm p-5">
      <h3 className="text-[14px] font-semibold text-[#202124] mb-1">Set your Unavailability</h3>
      <p className="text-[13px] text-[#86888D] mb-4">
        Block off specific hours when you are unavailable.
      </p>
      <button className="px-4 py-2 border border-[#BFBFBF] rounded-lg text-[13px] font-medium text-[#5A5C60] bg-[#FDFDFD] hover:bg-[#FBFBFB] transition-colors">
        Add Changes
      </button>
    </div>
  );
}

// ─── Availability Tab (root) ──────────────────────────────────────────────────

interface AvailabilityTabProps {
  onPreview?: () => void;
}

export default function AvailabilityTab({ onPreview }: AvailabilityTabProps = {}) {
  const [schedule, setSchedule] = useState<DaySchedule[]>(INITIAL_SCHEDULE);
  const [timezone, setTimezone] = useState("Asia/Manila (UTC+8)");
  const [toast,    setToast]    = useState({ message: "", isVisible: false });

  function handleSaveChanges() {
    setToast({ message: "Availability saved", isVisible: true });
  }

  function handleToggleDay(index: number) {
    setSchedule((prev) =>
      prev.map((day, i) => (i === index ? { ...day, enabled: !day.enabled } : day))
    );
  }

  function handleChangeTime(index: number, field: "startTime" | "endTime", value: string) {
    setSchedule((prev) =>
      prev.map((day, i) => (i === index ? { ...day, [field]: value } : day))
    );
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-[18px] font-bold text-[#202124]">Availability</h2>
          <p className="text-[13px] text-[#86888D] mt-0.5">
            Manage your weekly availability and timezone preferences
          </p>
        </div>
        <div className="flex items-center gap-2 sm:shrink-0">
          <button
            onClick={onPreview}
            className="flex-1 sm:flex-none px-4 py-[9px] border border-[#BFBFBF] rounded-lg text-[13px] font-medium text-[#5A5C60] bg-[#FDFDFD] hover:bg-[#FBFBFB] transition-colors"
          >
            Preview
          </button>
          <button onClick={handleSaveChanges} className="flex-1 sm:flex-none px-4 py-[9px] rounded-lg text-[13px] font-medium text-white bg-[#006BFF] hover:bg-[#0056CC] transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Two-column grid: schedule | timezone + settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* Left — Weekly Schedule (2 cols) */}
        <div className="lg:col-span-2">
          <WeeklySchedule
            schedule={schedule}
            onToggleDay={handleToggleDay}
            onChangeTime={handleChangeTime}
          />
        </div>

        {/* Right — Timezone + Settings (1 col) */}
        <div className="flex flex-col gap-4">
          <TimezoneCard timezone={timezone} onChange={setTimezone} />
          <SettingsCard />
        </div>
      </div>

      {/* Set Unavailability */}
      <UnavailabilitySection />

      <Toast message={toast.message} isVisible={toast.isVisible} onHide={() => setToast((t) => ({ ...t, isVisible: false }))} />
    </div>
  );
}
