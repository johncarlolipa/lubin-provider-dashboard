"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import Toast from "@/components/shared/Toast";
import { ALL_SKILLS } from "@/components/shared/skills";
import {
  PencilIcon,
  BriefcaseIcon,
  UserIcon,
  ShieldCheckIcon,
  IdentityCardIcon,
  TargetIcon,
  KeyIcon,
  GraduationCapIcon,
  ArrowPathIcon,
  CloudUploadIcon,
  InfoCircleIcon,
  CameraIcon,
  DocumentIcon,
  ClipboardListIcon,
  TrashIcon,
  PlusIcon,
  SmallCheckIcon,
  ImageIcon,
} from "@/components/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

type VerifStatus = "not-submitted" | "under-review" | "approved" | "rejected";

interface ExperienceEntry { id: number; title: string; company: string; period: string; current: boolean; }
interface EducationEntry  { id: number; degree: string; institution: string; year: string; }
interface CertEntry       { id: number; title: string; issuer: string; licenseNumber: string; }

// ─── Seed data ────────────────────────────────────────────────────────────────

const INITIAL_BIO = `Dr. Carol Morgan is a licensed clinical psychologist with over 10 years of experience helping individuals navigate life's challenges. She specializes in evidence-based treatments for anxiety, depression, and trauma, with a particular focus on cognitive-behavioral therapy and mindfulness-based interventions.

Dr. Newport received her doctoral degree from Stanford University and completed her clinical internship at UCSF Medical Center. She has published extensively in peer-reviewed journals and regularly speaks at professional conferences on topics related to mental health and wellness.`;

const SEED_EXPERIENCE: ExperienceEntry[] = [
  { id: 1, title: "Clinical Psychologist",   company: "Company A", period: "2024–present", current: true  },
  { id: 2, title: "Psychology Practitioner", company: "Company B", period: "2022-2024",    current: false },
  { id: 3, title: "Psychometrician",         company: "Company C", period: "2018-2022",    current: false },
];

const SEED_EDUCATION: EducationEntry[] = [
  { id: 1, degree: "Ph.D. in Clinical Psycho", institution: "Stanford University", year: "2008" },
  { id: 2, degree: "M.A. in Psychology",        institution: "UC Berkeley",         year: "2004" },
  { id: 3, degree: "B.A. in Psychology",        institution: "UCLA",                year: "2002" },
];

const SEED_SPECS  = ["Anxiety Disorders", "Depression", "Trauma & PTSD", "Cognitive Behavioral Therapy", "Mindfulness-Based Therapy"];
const SEED_SKILLS = ["Anxiety Disorders", "Depression", "Trauma & PTSD", "Cognitive Behavioral Therapy", "Mindfulness-Based Therapy"];

const SEED_CERTS: CertEntry[] = [
  { id: 1, title: "Licensed Clinical Psychologist", issuer: "California Board of Psychology", licenseNumber: "PSY 12345" },
  { id: 2, title: "Certified CBT Practitioner",     issuer: "Academy of Cognitive Therapy",   licenseNumber: "" },
];

// ─── Shared primitives ────────────────────────────────────────────────────────

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}

interface IconBadgeProps { icon: React.ReactNode; bg: string; }
function IconBadge({ icon, bg }: IconBadgeProps) {
  return (
    <div className={`w-7 h-7 ${bg} rounded-md flex items-center justify-center shrink-0`}>
      {icon}
    </div>
  );
}

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}
function CardHeader({ icon, title, subtitle, action }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-[#EFEFEF]">
      <div className="flex items-start gap-3">
        {icon}
        <div>
          <h3 className="text-[14px] font-semibold text-[#202124] leading-snug">{title}</h3>
          {subtitle && <p className="text-[12px] text-[#86888D] mt-0.5 leading-snug">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ─── Cancel / Save footer ─────────────────────────────────────────────────────

function CardActions({ onCancel, onSave }: { onCancel: () => void; onSave: () => void }) {
  return (
    <div className="flex gap-3 px-5 pb-5 pt-1">
      <button
        onClick={onCancel}
        className="flex-1 py-2.5 border border-[#BFBFBF] rounded-lg text-[13px] font-semibold text-[#5A5C60] bg-[#FDFDFD] hover:bg-[#FBFBFB] transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="flex-1 py-2.5 bg-[#006BFF] hover:bg-[#0056CC] rounded-lg text-[13px] font-semibold text-white transition-colors"
      >
        Save
      </button>
    </div>
  );
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────

interface TagPillProps { label: string; onRemove: () => void; }
function TagPill({ label, onRemove }: TagPillProps) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#E6F0FF] text-[#004099] rounded-full text-[12px] font-medium">
      {label}
      <button onClick={onRemove} className="ml-0.5 text-[#66A6FF] hover:text-[#006BFF] font-bold leading-none">×</button>
    </span>
  );
}

// ─── Tags input with autocomplete ────────────────────────────────────────────

interface TagsInputProps {
  onAddTag: (tag: string) => void;
  existingTags: string[];
  placeholder: string;
}

function TagsInput({ onAddTag, existingTags, placeholder }: TagsInputProps) {
  const [value,  setValue]  = useState("");
  const [open,   setOpen]   = useState(false);
  const containerRef        = useRef<HTMLDivElement>(null);

  const filtered = value.length > 0
    ? ALL_SKILLS.filter(
        (s) => s.toLowerCase().includes(value.toLowerCase()) && !existingTags.includes(s)
      )
    : [];

  function commit(tag?: string) {
    const v = (tag ?? value).trim();
    if (v) onAddTag(v);
    setValue("");
    setOpen(false);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => { setValue(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter")  { e.preventDefault(); commit(); }
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder={placeholder}
        className="flex-1 border border-[#DCDCDC] rounded-lg px-3 py-2 text-[13px] text-[#5A5C60] placeholder-[#95979C] focus:outline-none focus:ring-1 focus:ring-[#66A6FF] focus:border-[#66A6FF]"
      />
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => commit()}
        className="px-4 py-2 bg-[#006BFF] hover:bg-[#0056CC] text-white text-[12px] font-semibold rounded-lg transition-colors whitespace-nowrap"
      >
        + Add
      </button>

      {/* Suggestions dropdown */}
      {open && filtered.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-[72px] mt-1 bg-[#FDFDFD] border border-[#DCDCDC] rounded-xl shadow-lg overflow-hidden max-h-44 overflow-y-auto">
          {filtered.map((skill) => (
            <button
              key={skill}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => commit(skill)}
              className="w-full text-left px-3 py-2 text-[13px] text-[#5A5C60] hover:bg-[#E6F0FF] hover:text-[#004099] transition-colors"
            >
              {highlightMatch(skill, value)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── File upload area ─────────────────────────────────────────────────────────

interface FileUploadAreaProps {
  accept?: string;
  hint?: string;
  label?: string;
  value?: File | null;
  onChange?: (f: File | null) => void;
}

function FileUploadArea({
  accept = "image/jpeg,image/png,.pdf",
  hint = "JPG, PNG, PDF",
  label = "Click to upload",
  value,
  onChange,
}: FileUploadAreaProps) {
  const [internalFile, setInternalFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const controlled = onChange !== undefined;
  const file = controlled ? (value ?? null) : internalFile;

  function setFile(f: File | null) {
    if (controlled) { onChange!(f); }
    else { setInternalFile(f); }
  }

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function clear() {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (file) {
    return (
      <div className="flex items-center gap-3 border-2 border-dashed border-green-400 bg-[#DCF4E6]/30 rounded-lg px-4 py-3">
        <div className="w-8 h-8 bg-[#DCF4E6] rounded-md flex items-center justify-center shrink-0">
          <ImageIcon className="w-4 h-4 text-[#079455]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-medium text-[#1A1A1D] truncate">{file.name}</p>
          <p className="text-[11px] text-[#95979C] mt-0.5">{formatSize(file.size)}</p>
        </div>
        <button onClick={clear} className="text-[#95979C] hover:text-[#5A5C60] text-xl leading-none shrink-0">
          ×
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      className="flex items-center justify-between border border-dashed border-[#BFBFBF] rounded-lg px-4 py-3 hover:border-[#66A6FF] hover:bg-[#E6F0FF]/20 transition-colors cursor-pointer"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
      />
      <div className="flex items-center gap-2.5">
        <CloudUploadIcon className="w-4 h-4 text-[#95979C] shrink-0" />
        <span className="text-[13px] text-[#86888D]">{label}</span>
      </div>
      <span className="text-[11px] text-[#95979C]">{hint}</span>
    </div>
  );
}

// ─── 1. Credential Verification ──────────────────────────────────────────────

function CredentialVerificationCard({ onSubmit }: { onSubmit: () => void }) {
  const [licenseFile,     setLicenseFile]     = useState<File | null>(null);
  const [licenseNumber,   setLicenseNumber]   = useState("");
  const [expirationDate,  setExpirationDate]  = useState("");
  const [submitted,       setSubmitted]       = useState(false);

  const canSubmit = !!licenseFile && licenseNumber.trim() !== "" && expirationDate !== "";

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
    onSubmit();
  }

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<ShieldCheckIcon className="w-4 h-4 text-white" />} bg="bg-indigo-500" />}
        title="Verify Your Professional Credentials"
        subtitle="Upload your professional documents to verify your qualifications and ensure patient trust on Lubin."
      />

      <div className="p-5 flex flex-col gap-5">

        {/* Success banner */}
        {submitted && (
          <div className="flex items-start gap-2.5 bg-[#DCF4E6] border border-[#079455]/30 rounded-lg px-4 py-3">
            <SmallCheckIcon className="w-4 h-4 text-[#079455] shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-[#079455]">Submitted for review!</p>
              <p className="text-[12px] text-[#079455] mt-0.5">Our team will review your credentials within 24–48 hours.</p>
            </div>
          </div>
        )}

        {/* Professional License */}
        <div>
          <label className="block text-[13px] font-semibold text-[#5A5C60] mb-2">
            Professional License <span className="text-[#D92D20]">*</span>
          </label>
          <FileUploadArea
            label="Upload License"
            hint="JPG, PNG or PDF · Max 16MB"
            value={licenseFile}
            onChange={setLicenseFile}
          />
        </div>

        {/* License Number + Expiration Date */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-semibold text-[#5A5C60] mb-1.5">
              License Number <span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="e.g. PSY-12345"
              className="w-full border border-[#DCDCDC] rounded-lg px-3 py-2 text-[13px] text-[#5A5C60] placeholder-[#95979C] focus:outline-none focus:ring-1 focus:ring-[#66A6FF] focus:border-[#66A6FF]"
            />
          </div>
          <div>
            <label className="block text-[12px] font-semibold text-[#5A5C60] mb-1.5">
              Expiration Date <span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              className="w-full border border-[#DCDCDC] rounded-lg px-3 py-2 text-[13px] text-[#86888D] focus:outline-none focus:ring-1 focus:ring-[#66A6FF] focus:border-[#66A6FF]"
            />
          </div>
        </div>

        {/* Supporting Documents */}
        <div>
          <p className="text-[13px] font-semibold text-[#5A5C60] mb-2">
            Supporting Documents <span className="text-[12px] font-normal text-[#95979C]">(Optional)</span>
          </p>
          <div className="flex flex-col gap-2.5">
            <FileUploadArea label="Diploma (Optional)" hint="JPG, PNG, PDF" />
            <FileUploadArea label="Certifications / Training Documents (Optional)" hint="JPG, PNG, PDF" />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitted}
          className={`w-full flex items-center justify-center gap-2 py-3 text-white text-[13px] font-semibold rounded-lg transition-colors ${
            canSubmit && !submitted
              ? "bg-[#006BFF] hover:bg-[#0056CC] cursor-pointer"
              : "bg-[#006BFF] opacity-40 cursor-not-allowed"
          }`}
        >
          <ArrowPathIcon className="w-4 h-4" />
          {submitted ? "Submitted for Review" : "Submit for Review"}
        </button>
      </div>
    </SectionCard>
  );
}

// ─── 2. Identity Verification ─────────────────────────────────────────────────

function IdentityVerificationCard({ onSubmit }: { onSubmit: () => void }) {
  const [govIdFile,   setGovIdFile]   = useState<File | null>(null);
  const [selfieFile,  setSelfieFile]  = useState<File | null>(null);
  const [submitted,   setSubmitted]   = useState(false);

  const canSubmit = !!govIdFile && !!selfieFile;

  function handleSubmit() {
    if (!canSubmit) return;
    setSubmitted(true);
    onSubmit();
  }

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<IdentityCardIcon className="w-4 h-4 text-white" />} bg="bg-[#079455]" />}
        title="Verify Your Identity"
        subtitle="Upload a government-issued ID and a selfie photo to confirm your identity."
      />

      <div className="p-5 flex flex-col gap-5">

        {/* Success banner */}
        {submitted && (
          <div className="flex items-start gap-2.5 bg-[#DCF4E6] border border-[#079455]/30 rounded-lg px-4 py-3">
            <SmallCheckIcon className="w-4 h-4 text-[#079455] shrink-0 mt-0.5" />
            <div>
              <p className="text-[13px] font-semibold text-[#079455]">Identity verification submitted!</p>
              <p className="text-[12px] text-[#079455] mt-0.5">Our team will verify your identity within 24–48 hours.</p>
            </div>
          </div>
        )}

        {/* Government-Issued ID */}
        <div>
          <label className="block text-[13px] font-semibold text-[#5A5C60] mb-1">
            Government-Issued ID <span className="text-[#D92D20]">*</span>
          </label>
          <p className="text-[11px] text-[#95979C] mb-2">Accepted: Passport, National ID, Driver&apos;s License</p>
          <FileUploadArea
            label="Upload Government ID"
            hint="JPG, PNG · Max 16MB"
            accept="image/jpeg,image/png"
            value={govIdFile}
            onChange={setGovIdFile}
          />
        </div>

        {/* Selfie Photo */}
        <div>
          <label className="block text-[13px] font-semibold text-[#5A5C60] mb-1">
            Selfie Photo <span className="text-[#D92D20]">*</span>
          </label>
          <p className="text-[11px] text-[#95979C] mb-2">Take or upload a clear selfie holding your ID.</p>
          <FileUploadArea
            label="Upload Selfie Photo"
            hint="JPG, PNG · Max 16MB"
            accept="image/jpeg,image/png"
            value={selfieFile}
            onChange={setSelfieFile}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit || submitted}
          className={`w-full flex items-center justify-center gap-2 py-3 text-white text-[13px] font-semibold rounded-lg transition-colors ${
            canSubmit && !submitted
              ? "bg-[#079455] hover:bg-[#057A45] cursor-pointer"
              : "bg-[#079455] opacity-40 cursor-not-allowed"
          }`}
        >
          <SmallCheckIcon className="w-4 h-4" />
          {submitted ? "Identity Submitted" : "Submit Identity Verification"}
        </button>
      </div>
    </SectionCard>
  );
}

// ─── 3. About Bio ─────────────────────────────────────────────────────────────

function AboutBioCard({ onSaved }: { onSaved?: () => void }) {
  const [committed, setCommitted] = useState(INITIAL_BIO);
  const [draft,     setDraft]     = useState(INITIAL_BIO);
  const [editing,   setEditing]   = useState(false);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) textareaRef.current?.focus();
  }, [editing]);

  const isDirty = draft !== committed;

  function startEdit() { setDraft(committed); setEditing(true); }
  function cancel()    { setDraft(committed); setEditing(false); }
  function save()      { setCommitted(draft); setEditing(false); onSaved?.(); }

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<UserIcon className="w-4 h-4 text-white" />} bg="bg-[#DCDCDC]" />}
        title="About Dr. Morgan"
        action={
          !editing ? (
            <button onClick={startEdit} className="text-[#95979C] hover:text-[#5A5C60] transition-colors mt-0.5">
              <PencilIcon className="w-3.5 h-3.5" />
            </button>
          ) : undefined
        }
      />

      <div className="p-5">
        {editing ? (
          <>
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={9}
              className="w-full text-[13px] text-[#5A5C60] leading-relaxed border-2 border-[#66A6FF] rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-[#B2D3FF] resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={cancel} className="flex-1 py-2.5 border border-[#BFBFBF] rounded-lg text-[13px] font-semibold text-[#5A5C60] bg-[#FDFDFD] hover:bg-[#FBFBFB] transition-colors">
                Cancel
              </button>
              {isDirty && (
                <button onClick={save} className="flex-1 py-2.5 bg-[#006BFF] hover:bg-[#0056CC] rounded-lg text-[13px] font-semibold text-white transition-colors">
                  Save
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            {committed.split("\n\n").map((para, i) => (
              <p key={i} className="text-[13px] text-[#5A5C60] leading-relaxed">{para}</p>
            ))}
          </div>
        )}
      </div>
    </SectionCard>
  );
}

// ─── 4. Areas of Specialization ───────────────────────────────────────────────

function SpecializationCard({ onSaved }: { onSaved?: () => void }) {
  const [committed, setCommitted] = useState<string[]>(SEED_SPECS);
  const [draft,     setDraft]     = useState<string[]>(SEED_SPECS);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(committed);

  function addTag(v: string) {
    if (!draft.includes(v)) setDraft((t) => [...t, v]);
  }

  function cancel() { setDraft([...committed]); }
  function save()   { setCommitted([...draft]); onSaved?.(); }

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<TargetIcon className="w-4 h-4 text-white" />} bg="bg-[#006BFF]" />}
        title="Areas of Specialization"
      />
      <div className="p-5 pb-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {draft.map((tag) => (
            <TagPill key={tag} label={tag} onRemove={() => setDraft((t) => t.filter((x) => x !== tag))} />
          ))}
        </div>
        <div className="mb-4">
          <TagsInput onAddTag={addTag} existingTags={draft} placeholder="Add specialization..." />
        </div>
      </div>
      {isDirty && <CardActions onCancel={cancel} onSave={save} />}
      {!isDirty && <div className="pb-5" />}
    </SectionCard>
  );
}

// ─── 5. Skills ────────────────────────────────────────────────────────────────

function SkillsCard({ onSaved }: { onSaved?: () => void }) {
  const [committed, setCommitted] = useState<string[]>(SEED_SKILLS);
  const [draft,     setDraft]     = useState<string[]>(SEED_SKILLS);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(committed);

  function addTag(v: string) {
    if (!draft.includes(v)) setDraft((t) => [...t, v]);
  }

  function cancel() { setDraft([...committed]); }
  function save()   { setCommitted([...draft]); onSaved?.(); }

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<KeyIcon className="w-4 h-4 text-white" />} bg="bg-[#006BFF]" />}
        title="Skills"
      />
      <div className="p-5 pb-0">
        <div className="flex flex-wrap gap-2 mb-3">
          {draft.map((tag) => (
            <TagPill key={tag} label={tag} onRemove={() => setDraft((t) => t.filter((x) => x !== tag))} />
          ))}
        </div>
        <div className="mb-4">
          <TagsInput onAddTag={addTag} existingTags={draft} placeholder="Add skill..." />
        </div>
      </div>
      {isDirty && <CardActions onCancel={cancel} onSave={save} />}
      {!isDirty && <div className="pb-5" />}
    </SectionCard>
  );
}

// ─── 6. Licenses & Certifications ─────────────────────────────────────────────

interface CertItemProps {
  cert: CertEntry;
  onRemove: () => void;
  onLicenseChange: (val: string) => void;
  file: File | null;
  onFileChange: (f: File | null) => void;
}

function CertItem({ cert, onRemove, onLicenseChange, file, onFileChange }: CertItemProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="relative border border-dashed border-[#BFBFBF] rounded-lg p-4">
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 text-[#95979C] hover:text-[#5A5C60] text-lg leading-none"
        aria-label="Remove certification"
      >
        ×
      </button>

      <div className="flex items-start gap-3">
        <div className="w-7 h-7 bg-[#E6F0FF] border border-[#B2D3FF] rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-[#006BFF]" />
        </div>
        <div className="flex-1 min-w-0 pr-5">
          <p className="text-[13px] font-semibold text-[#202124]">{cert.title}</p>
          <p className="text-[12px] text-[#006BFF] mt-0.5">{cert.issuer}</p>
          <input
            value={cert.licenseNumber}
            onChange={(e) => onLicenseChange(e.target.value)}
            placeholder="License # (optional)"
            className="mt-1.5 w-full text-[12px] text-[#86888D] placeholder-[#95979C] border-none outline-none bg-transparent"
          />
          <div className="mt-2 pt-2 border-t border-[#EFEFEF]">
            {/* Hidden file input */}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,.pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileChange(f); }}
            />
            {file ? (
              <div className="flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5 text-[#079455] shrink-0" />
                <span className="text-[12px] text-[#079455] font-medium truncate flex-1">{file.name}</span>
                <span className="text-[11px] text-[#95979C] shrink-0">{formatSize(file.size)}</span>
                <button
                  onClick={() => { onFileChange(null); if (inputRef.current) inputRef.current.value = ""; }}
                  className="text-[#95979C] hover:text-[#5A5C60] text-base leading-none shrink-0"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <button
                  onClick={() => inputRef.current?.click()}
                  className="flex items-center gap-1.5 text-[12px] text-[#95979C] hover:text-[#006BFF] transition-colors"
                >
                  <CloudUploadIcon className="w-3.5 h-3.5" />
                  Upload proof of certification
                </button>
                <span className="text-[11px] text-[#95979C]">JPG, PNG, PDF</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LicensesCertificationsCard({ onSaved }: { onSaved?: () => void }) {
  const [committed, setCommitted] = useState<CertEntry[]>(SEED_CERTS);
  const [draft,     setDraft]     = useState<CertEntry[]>(SEED_CERTS);
  const [files,     setFiles]     = useState<Record<number, File | null>>({});

  const isDirty = JSON.stringify(draft) !== JSON.stringify(committed) || Object.keys(files).length > 0;

  function addCert() {
    setDraft((c) => [...c, { id: Date.now(), title: "New Certification", issuer: "Issuing Body", licenseNumber: "" }]);
  }

  function updateLicense(id: number, val: string) {
    setDraft((c) => c.map((x) => x.id === id ? { ...x, licenseNumber: val } : x));
  }

  function setFile(id: number, f: File | null) {
    setFiles((prev) => {
      const next = { ...prev };
      if (f) next[id] = f;
      else delete next[id];
      return next;
    });
  }

  function cancel() {
    setDraft(committed.map((c) => ({ ...c })));
    setFiles({});
  }

  function save() {
    setCommitted(draft.map((c) => ({ ...c })));
    setFiles({});
    onSaved?.();
  }

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<ShieldCheckIcon className="w-4 h-4 text-white" />} bg="bg-[#006BFF]" />}
        title="Licenses & Certifications"
      />
      <div className="p-5 flex flex-col gap-3">
        {draft.map((cert) => (
          <CertItem
            key={cert.id}
            cert={cert}
            onRemove={() => setDraft((c) => c.filter((x) => x.id !== cert.id))}
            onLicenseChange={(val) => updateLicense(cert.id, val)}
            file={files[cert.id] ?? null}
            onFileChange={(f) => setFile(cert.id, f)}
          />
        ))}
        <button
          onClick={addCert}
          className="w-full py-2.5 border border-dashed border-[#B2D3FF] rounded-lg text-[13px] font-medium text-[#006BFF] hover:border-[#66A6FF] hover:bg-[#E6F0FF]/30 transition-colors"
        >
          + Add Certification
        </button>
      </div>
      {isDirty && <CardActions onCancel={cancel} onSave={save} />}
      {!isDirty && <div className="pb-2" />}
    </SectionCard>
  );
}

// ─── R1. Verification Status ──────────────────────────────────────────────────

const STATUS_OPTIONS: { key: VerifStatus; label: string }[] = [
  { key: "not-submitted", label: "Not Submitted" },
  { key: "under-review",  label: "Under Review"  },
  { key: "approved",      label: "Approved"       },
  { key: "rejected",      label: "Rejected"       },
];

const STATUS_ACTIVE_STYLE: Record<VerifStatus, string> = {
  "not-submitted": "bg-[#FEE4E2] text-[#D92D20] border-[#D92D20]",
  "under-review":  "bg-yellow-100 text-yellow-700 border-yellow-200",
  "approved":      "bg-[#DCF4E6] text-[#079455] border-green-200",
  "rejected":      "bg-[#FEE4E2] text-[#D92D20] border-red-200",
};

interface VerificationStatusCardProps {
  credStatus: VerifStatus;
  idStatus: VerifStatus;
  setCredStatus: (s: VerifStatus) => void;
  setIdStatus: (s: VerifStatus) => void;
}

const STATUS_ICON: Record<VerifStatus, string> = {
  "not-submitted": "×",
  "under-review":  "○",
  "approved":      "✓",
  "rejected":      "×",
};

const STATUS_TEXT_COLOR: Record<VerifStatus, string> = {
  "not-submitted": "text-[#D92D20]",
  "under-review":  "text-[#D17F0E]",
  "approved":      "text-[#079455]",
  "rejected":      "text-[#D92D20]",
};

const STATUS_SUBLABEL: Record<VerifStatus, string> = {
  "not-submitted": "No documents submitted yet",
  "under-review":  "Documents submitted, under review",
  "approved":      "Verification approved",
  "rejected":      "Verification rejected — resubmit required",
};

function VerificationStatusCard({ credStatus, idStatus, setCredStatus, setIdStatus }: VerificationStatusCardProps) {
  const statusLabel = (s: VerifStatus) => STATUS_OPTIONS.find((o) => o.key === s)!.label;

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<ShieldCheckIcon className="w-4 h-4 text-white" />} bg="bg-[#BFBFBF]" />}
        title="Verification Status"
      />
      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-3.5 h-3.5 text-[#95979C]" />
            <span className="text-[12px] font-semibold text-[#5A5C60]">Credential Verification</span>
          </div>
          <p className={`text-[11px] font-medium pl-5 ${STATUS_TEXT_COLOR[credStatus]}`}>
            {STATUS_ICON[credStatus]} {statusLabel(credStatus)}
          </p>
          <p className="text-[11px] text-[#95979C] pl-5">{STATUS_SUBLABEL[credStatus]}</p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <IdentityCardIcon className="w-3.5 h-3.5 text-[#95979C]" />
            <span className="text-[12px] font-semibold text-[#5A5C60]">Identity Verification</span>
          </div>
          <p className={`text-[11px] font-medium pl-5 ${STATUS_TEXT_COLOR[idStatus]}`}>
            {STATUS_ICON[idStatus]} {statusLabel(idStatus)}
          </p>
          <p className="text-[11px] text-[#95979C] pl-5">{STATUS_SUBLABEL[idStatus]}</p>
        </div>

        <div className="flex items-start gap-2 bg-[#E6F0FF] border border-[#E6F0FF] rounded-lg px-3 py-2.5">
          <InfoCircleIcon className="w-3.5 h-3.5 text-[#006BFF] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#004099] leading-snug">
            Our team reviews verification documents within 24–48 hours.
          </p>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-[#95979C] uppercase tracking-wider mb-2">
            Preview Status (Demo)
          </p>
          <div className="mb-2">
            <p className="text-[10px] text-[#95979C] mb-1">Credentials</p>
            <div className="flex flex-wrap gap-1">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.key} onClick={() => setCredStatus(opt.key)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors ${credStatus === opt.key ? STATUS_ACTIVE_STYLE[opt.key] : "bg-[#FDFDFD] text-[#95979C] border-[#DCDCDC] hover:bg-[#FBFBFB]"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#95979C] mb-1">Identity</p>
            <div className="flex flex-wrap gap-1">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.key} onClick={() => setIdStatus(opt.key)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors ${idStatus === opt.key ? STATUS_ACTIVE_STYLE[opt.key] : "bg-[#FDFDFD] text-[#95979C] border-[#DCDCDC] hover:bg-[#FBFBFB]"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── R2. Experience ───────────────────────────────────────────────────────────

function ExperienceCard({ onSaved }: { onSaved?: () => void }) {
  const [committed, setCommitted] = useState<ExperienceEntry[]>(SEED_EXPERIENCE);
  const [draft,     setDraft]     = useState<ExperienceEntry[]>(SEED_EXPERIENCE);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(committed);

  function addEntry() {
    setDraft((e) => [...e, { id: Date.now(), title: "New Role", company: "Company", period: "Year", current: false }]);
  }

  function cancel() { setDraft([...committed]); }
  function save()   { setCommitted([...draft]); onSaved?.(); }

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<BriefcaseIcon className="w-4 h-4 text-white" />} bg="bg-[#006BFF]" />}
        title="Experience"
      />
      <div className="p-4 pb-0 flex flex-col">
        {draft.map((entry, i) => (
          <div key={entry.id}>
            <div className="flex items-start justify-between gap-2 py-3">
              <div className="flex items-start gap-2.5">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  entry.current ? "bg-[#006BFF]" : "border-2 border-[#BFBFBF] bg-[#FDFDFD]"
                }`}>
                  {entry.current && <SmallCheckIcon className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#202124] leading-snug">{entry.title}</p>
                  <p className="text-[11px] text-[#95979C] mt-0.5">{entry.company}, {entry.period}</p>
                </div>
              </div>
              <button
                onClick={() => setDraft((e) => e.filter((x) => x.id !== entry.id))}
                className="text-[#BFBFBF] hover:text-[#86888D] text-lg leading-none shrink-0 mt-0.5"
              >
                ×
              </button>
            </div>
            {i < draft.length - 1 && <div className="h-px bg-[#EFEFEF] mx-0" />}
          </div>
        ))}

        <button
          onClick={addEntry}
          className="my-3 w-full py-2 border border-dashed border-[#B2D3FF] bg-[#E6F0FF]/40 rounded-lg text-[12px] font-medium text-[#006BFF] hover:border-[#66A6FF] hover:bg-[#E6F0FF] transition-colors"
        >
          + Add Entry
        </button>
      </div>
      {isDirty && <CardActions onCancel={cancel} onSave={save} />}
      {!isDirty && <div className="pb-1" />}
    </SectionCard>
  );
}

// ─── R3. Education ────────────────────────────────────────────────────────────

function EducationCard({ onSaved }: { onSaved?: () => void }) {
  const [committed, setCommitted] = useState<EducationEntry[]>(SEED_EDUCATION);
  const [draft,     setDraft]     = useState<EducationEntry[]>(SEED_EDUCATION);

  const isDirty = JSON.stringify(draft) !== JSON.stringify(committed);

  function addEntry() {
    setDraft((e) => [...e, { id: Date.now(), degree: "New Role", institution: "Company", year: "Year" }]);
  }

  function cancel() { setDraft([...committed]); }
  function save()   { setCommitted([...draft]); onSaved?.(); }

  return (
    <SectionCard>
      <CardHeader
        icon={<IconBadge icon={<GraduationCapIcon className="w-4 h-4 text-white" />} bg="bg-[#006BFF]" />}
        title="Education"
      />
      <div className="p-4 pb-0 flex flex-col">
        {draft.map((entry, i) => (
          <div key={entry.id}>
            <div className="flex items-start justify-between gap-2 py-3">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-[#006BFF] flex items-center justify-center shrink-0 mt-0.5">
                  <SmallCheckIcon className="w-3 h-3 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#202124] leading-snug">{entry.degree}</p>
                  <p className="text-[11px] text-[#95979C] mt-0.5">{entry.institution}, {entry.year}</p>
                </div>
              </div>
              <button
                onClick={() => setDraft((e) => e.filter((x) => x.id !== entry.id))}
                className="text-[#BFBFBF] hover:text-[#86888D] text-lg leading-none shrink-0 mt-0.5"
              >
                ×
              </button>
            </div>
            {i < draft.length - 1 && <div className="h-px bg-[#EFEFEF]" />}
          </div>
        ))}

        <button
          onClick={addEntry}
          className="my-3 w-full py-2 border border-dashed border-[#B2D3FF] bg-[#E6F0FF]/40 rounded-lg text-[12px] font-medium text-[#006BFF] hover:border-[#66A6FF] hover:bg-[#E6F0FF] transition-colors"
        >
          + Add Entry
        </button>
      </div>
      {isDirty && <CardActions onCancel={cancel} onSave={save} />}
      {!isDirty && <div className="pb-1" />}
    </SectionCard>
  );
}

// ─── About Tab (root) ─────────────────────────────────────────────────────────

export default function AboutTab() {
  const [credStatus, setCredStatus] = useState<VerifStatus>("not-submitted");
  const [idStatus,   setIdStatus]   = useState<VerifStatus>("not-submitted");
  const [toast,      setToast]      = useState({ message: "", isVisible: false });

  function showToast(msg: string) { setToast({ message: msg, isVisible: true }); }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Verification section: sticky status card lives here ── */}
      <div className="grid grid-cols-3 gap-5 items-start">

        {/* Left: only the two verification cards */}
        <div className="col-span-2 flex flex-col gap-5">
          <CredentialVerificationCard onSubmit={() => setCredStatus("under-review")} />
          <IdentityVerificationCard   onSubmit={() => setIdStatus("under-review")} />
        </div>

        {/* Right: status card, sticky within this row */}
        <div className="col-span-1">
          <div className="sticky top-6">
            <VerificationStatusCard
              credStatus={credStatus}
              idStatus={idStatus}
              setCredStatus={setCredStatus}
              setIdStatus={setIdStatus}
            />
          </div>
        </div>

      </div>

      {/* ── Rest of profile ── */}
      <div className="grid grid-cols-3 gap-5 items-start">

        <div className="col-span-2 flex flex-col gap-5">
          <AboutBioCard             onSaved={() => showToast("Bio saved")} />
          <SpecializationCard       onSaved={() => showToast("Specializations saved")} />
          <SkillsCard               onSaved={() => showToast("Skills saved")} />
          <LicensesCertificationsCard onSaved={() => showToast("Certifications saved")} />
        </div>

        <div className="col-span-1 flex flex-col gap-5">
          <ExperienceCard onSaved={() => showToast("Experience saved")} />
          <EducationCard  onSaved={() => showToast("Education saved")} />
        </div>

      </div>

      <Toast message={toast.message} isVisible={toast.isVisible} onHide={() => setToast((t) => ({ ...t, isVisible: false }))} />
    </div>
  );
}
