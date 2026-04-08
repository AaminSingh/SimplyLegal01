"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  FileText,
  Shield,
  Home,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Sparkles,
  User,
  Building2,
  MapPin,
  MessageSquare,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface WizardData {
  documentType: string;
  yourName: string;
  counterpartyName: string;
  jurisdiction: string;
  agreementType: string;
  purpose: string;
}

interface IntakeWizardProps {
  onClose: () => void;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const DOCUMENT_TYPES = [
  {
    id: "nda",
    label: "NDA",
    full: "Non-Disclosure Agreement",
    icon: Shield,
    desc: "Protect confidential information between parties",
    color: "indigo",
  },
  {
    id: "service",
    label: "Service Agreement",
    full: "Professional Service Agreement",
    icon: FileText,
    desc: "Define scope, deliverables, and payment terms",
    color: "purple",
  },
  {
    id: "lease",
    label: "Lease Agreement",
    full: "Residential / Commercial Lease",
    icon: Home,
    desc: "Residential or commercial property leasing",
    color: "emerald",
  },
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

const GENERATION_PHASES = [
  "Analyzing jurisdiction...",
  "Drafting clauses...",
  "Reviewing compliance...",
  "Finalizing document...",
];

const DOC_TYPE_LABELS: Record<string, string> = {
  nda: "Non-Disclosure Agreement",
  service: "Service Agreement",
  lease: "Lease Agreement",
};

const colorMap: Record<string, { border: string; bg: string; icon: string; shadow: string }> = {
  indigo: {
    border: "border-indigo-500",
    bg: "bg-indigo-500/10",
    icon: "text-indigo-400",
    shadow: "shadow-indigo-900/30",
  },
  purple: {
    border: "border-purple-500",
    bg: "bg-purple-500/10",
    icon: "text-purple-400",
    shadow: "shadow-purple-900/30",
  },
  emerald: {
    border: "border-emerald-500",
    bg: "bg-emerald-500/10",
    icon: "text-emerald-400",
    shadow: "shadow-emerald-900/30",
  },
};

// ─── Slide Variants ────────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
  }),
};

// ─── Step 1: Document Type ──────────────────────────────────────────────────────

function StepDocType({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-1">Select Document Type</h2>
        <p className="text-sm text-slate-500">Choose the type of legal document you want to create</p>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {DOCUMENT_TYPES.map((doc) => {
          const Icon = doc.icon;
          const colors = colorMap[doc.color];
          const isSelected = selected === doc.id;
          return (
            <motion.button
              key={doc.id}
              id={`doc-type-${doc.id}`}
              onClick={() => onSelect(doc.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`relative w-full text-left rounded-xl border p-4 transition-all duration-200 ${
                isSelected
                  ? `${colors.border} ${colors.bg} shadow-lg ${colors.shadow}`
                  : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600/80 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-11 h-11 rounded-xl border transition-all duration-200 ${
                    isSelected
                      ? `${colors.bg} ${colors.border.replace("border-", "border-")}`
                      : "bg-slate-700/50 border-slate-600/40"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isSelected ? colors.icon : "text-slate-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm transition-colors ${isSelected ? "text-slate-100" : "text-slate-300"}`}>
                    {doc.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{doc.desc}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 shrink-0"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Basic Information ──────────────────────────────────────────────────

function StepBasicInfo({
  data,
  onChange,
}: {
  data: Pick<WizardData, "yourName" | "counterpartyName" | "jurisdiction">;
  onChange: (key: keyof WizardData, value: string) => void;
}) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-1">Basic Information</h2>
        <p className="text-sm text-slate-500">Tell us about the parties involved in this agreement</p>
      </div>
      <div className="space-y-5">
        {/* Your Name */}
        <div>
          <label htmlFor="your-name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Your Name / Company
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="your-name"
              type="text"
              value={data.yourName}
              onChange={(e) => onChange("yourName", e.target.value)}
              placeholder="e.g. Acme Corp or John Smith"
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3
                         text-sm text-slate-200 placeholder:text-slate-600
                         focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/40
                         transition-all duration-200"
            />
          </div>
        </div>

        {/* Counterparty Name */}
        <div>
          <label htmlFor="counterparty-name" className="block text-sm font-medium text-slate-300 mb-1.5">
            Counterparty Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="counterparty-name"
              type="text"
              value={data.counterpartyName}
              onChange={(e) => onChange("counterpartyName", e.target.value)}
              placeholder="e.g. Globex Inc or Jane Doe"
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3
                         text-sm text-slate-200 placeholder:text-slate-600
                         focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/40
                         transition-all duration-200"
            />
          </div>
        </div>

        {/* State / Jurisdiction */}
        <div>
          <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-300 mb-1.5">
            State / Jurisdiction
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              id="jurisdiction"
              value={data.jurisdiction}
              onChange={(e) => onChange("jurisdiction", e.target.value)}
              className="w-full appearance-none bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-10 py-3
                         text-sm text-slate-200
                         focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/40
                         transition-all duration-200 cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-400">Select a state...</option>
              {US_STATES.map((state) => (
                <option key={state} value={state} className="bg-slate-900 text-slate-200">
                  {state}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none rotate-90" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: AI Questions ───────────────────────────────────────────────────────

function StepAIQuestions({
  data,
  onChange,
}: {
  data: Pick<WizardData, "agreementType" | "purpose">;
  onChange: (key: keyof WizardData, value: string) => void;
}) {
  const options = [
    { id: "mutual", label: "Mutual", desc: "Both parties share obligations equally" },
    { id: "one-way", label: "One-Way", desc: "Only one party is bound by the terms" },
  ];

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">AI-Powered Questions</span>
        </div>
        <h2 className="text-xl font-bold text-slate-100 mb-1">Agreement Details</h2>
        <p className="text-sm text-slate-500">Help our AI draft the most accurate clauses for you</p>
      </div>

      <div className="space-y-6">
        {/* Q1: Mutual vs One-Way */}
        <div>
          <p className="text-sm font-semibold text-slate-300 mb-3">
            Is this a mutual agreement or one-way?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {options.map((opt) => {
              const isSelected = data.agreementType === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`agreement-type-${opt.id}`}
                  onClick={() => onChange("agreementType", opt.id)}
                  className={`relative text-left rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-900/20"
                      : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600/80"
                  }`}
                >
                  {/* Radio indicator */}
                  <div className="flex items-center gap-2.5 mb-2">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                        isSelected ? "border-indigo-400 bg-indigo-500" : "border-slate-600 bg-transparent"
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <span className={`text-sm font-semibold transition-colors ${isSelected ? "text-slate-100" : "text-slate-300"}`}>
                      {opt.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-6.5">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Q2: Purpose textarea */}
        <div>
          <label htmlFor="agreement-purpose" className="block text-sm font-semibold text-slate-300 mb-1.5">
            What is the primary purpose of this agreement?
          </label>
          <p className="text-xs text-slate-600 mb-3">
            Be specific — our AI uses this to tailor the exact language of your contract.
          </p>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500 pointer-events-none" />
            <textarea
              id="agreement-purpose"
              value={data.purpose}
              onChange={(e) => onChange("purpose", e.target.value)}
              rows={4}
              placeholder="e.g. Protect proprietary source code shared during a software evaluation..."
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-10 pr-4 py-3
                         text-sm text-slate-200 placeholder:text-slate-600 resize-none
                         focus:outline-none focus:border-indigo-500/70 focus:ring-1 focus:ring-indigo-500/40
                         transition-all duration-200"
            />
          </div>
          <p className="text-right text-xs text-slate-700 mt-1">{data.purpose.length} / 300</p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Review & Generate ─────────────────────────────────────────────────

function SummaryRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-800/60 last:border-0">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/50 shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-slate-600 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-200 truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function StepGenerate({ data, onGenerate }: { data: WizardData; onGenerate: () => void }) {
  const [phase, setPhase] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseText, setPhaseText] = useState(GENERATION_PHASES[0]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const selectedDoc = DOCUMENT_TYPES.find((d) => d.id === data.documentType);

  const handleGenerate = async () => {
    setPhase("loading");
    setPhaseIdx(0);
    setPhaseText(GENERATION_PHASES[0]);
    setErrorMsg(null);

    // Animate through phases while waiting for the API
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < GENERATION_PHASES.length - 1) {
        setPhaseIdx(idx);
        setPhaseText(GENERATION_PHASES[idx]);
      }
    }, 1400);

    try {
      const response = await fetch("/backend/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_type: DOC_TYPE_LABELS[data.documentType] ?? data.documentType,
          party_name: `${data.yourName} and ${data.counterpartyName}`,
          state: data.jurisdiction,
          agreement_type: data.agreementType || undefined,
          purpose: data.purpose || undefined,
        }),
      });

      clearInterval(interval);

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({ detail: `Server error ${response.status}` }));
        throw new Error(errBody.detail ?? `Request failed with status ${response.status}`);
      }

      // Trigger PDF download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const docLabel = DOC_TYPE_LABELS[data.documentType] ?? "Contract";
      anchor.href = url;
      anchor.download = `${docLabel.replace(/\s+/g, "_")}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);

      setPhaseIdx(GENERATION_PHASES.length - 1);
      setPhaseText(GENERATION_PHASES[GENERATION_PHASES.length - 1]);
      setTimeout(() => {
        setPhase("done");
        onGenerate();
      }, 600);
    } catch (err: unknown) {
      clearInterval(interval);
      setErrorMsg(err instanceof Error ? err.message : "Failed to generate contract. Is the backend running?");
      setPhase("error");
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100 mb-1">Review & Generate</h2>
        <p className="text-sm text-slate-500">Everything looks good? Let our AI draft your document.</p>
      </div>

      {/* Summary Card */}
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl px-4 mb-6">
        <SummaryRow icon={FileText} label="Document Type" value={selectedDoc?.full ?? data.documentType} />
        <SummaryRow icon={User} label="Your Name / Company" value={data.yourName} />
        <SummaryRow icon={Building2} label="Counterparty" value={data.counterpartyName} />
        <SummaryRow icon={MapPin} label="Jurisdiction" value={data.jurisdiction} />
        <SummaryRow
          icon={Shield}
          label="Agreement Type"
          value={data.agreementType === "mutual" ? "Mutual" : data.agreementType === "one-way" ? "One-Way" : "—"}
        />
        <SummaryRow icon={MessageSquare} label="Purpose" value={data.purpose} />
      </div>

      {/* Generate Button / Loading / Done */}
      <AnimatePresence mode="wait">
        {phase === "idle" && (
          <motion.button
            key="btn-generate"
            id="btn-generate-contract"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl 
                       bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm
                       shadow-lg shadow-indigo-900/40 hover:shadow-indigo-700/50 
                       transition-all duration-200 hover:scale-[1.01] active:scale-100"
          >
            <Sparkles className="w-4 h-4" />
            Generate Contract
          </motion.button>
        )}

        {phase === "loading" && (
          <motion.div
            key="loading-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full rounded-xl overflow-hidden"
          >
            {/* Shimmer base */}
            <div className="relative w-full py-3.5 bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden">
              {/* Animated shimmer sweep */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.15) 50%, transparent 100%)",
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
              />
              {/* Indigo progress bar */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500"
                animate={{ width: [`${(phaseIdx / GENERATION_PHASES.length) * 100}%`, `${((phaseIdx + 1) / GENERATION_PHASES.length) * 100}%`] }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
              />
              <div className="relative flex items-center justify-center gap-3">
                <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phaseText}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="text-sm font-semibold text-slate-300"
                  >
                    {phaseText}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            key="done-state"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center gap-2 py-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.1 }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 shadow-lg shadow-emerald-900/40"
            >
              <Check className="w-5 h-5 text-white" />
            </motion.div>
            <p className="text-sm font-bold text-emerald-400">Document Ready!</p>
            <p className="text-xs text-slate-500">Your PDF has been downloaded.</p>
          </motion.div>
        )}

        {phase === "error" && (
          <motion.div
            key="error-state"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center gap-3 py-4 px-4 rounded-xl bg-red-500/10 border border-red-500/30"
          >
            <p className="text-sm font-bold text-red-400">Generation Failed</p>
            <p className="text-xs text-slate-400 text-center leading-relaxed">{errorMsg}</p>
            <button
              onClick={() => setPhase("idle")}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200 underline transition-colors"
            >
              Try again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Progress Bar ───────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
          Step {current} of {total}
        </span>
        <span className="text-xs text-slate-600">{Math.round((current / total) * 100)}% complete</span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          initial={false}
          animate={{ width: `${(current / total) * 100}%` }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
        />
      </div>
      {/* Step dots */}
      <div className="flex items-center justify-between mt-3">
        {Array.from({ length: total }, (_, i) => {
          const stepNum = i + 1;
          const isComplete = stepNum < current;
          const isCurrent = stepNum === current;
          return (
            <div key={stepNum} className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                  isComplete
                    ? "bg-indigo-500 text-white"
                    : isCurrent
                    ? "bg-indigo-500/20 border-2 border-indigo-500 text-indigo-400"
                    : "bg-slate-800 border-2 border-slate-700 text-slate-600"
                }`}
              >
                {isComplete ? <Check className="w-3 h-3" /> : stepNum}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Wizard ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

export default function IntakeWizard({ onClose }: IntakeWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [isGenerated, setIsGenerated] = useState(false);
  const [data, setData] = useState<WizardData>({
    documentType: "",
    yourName: "",
    counterpartyName: "",
    jurisdiction: "",
    agreementType: "",
    purpose: "",
  });

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const updateData = (key: keyof WizardData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!data.documentType;
      case 2: return !!(data.yourName && data.counterpartyName && data.jurisdiction);
      case 3: return !!(data.agreementType && data.purpose.trim());
      case 4: return true;
      default: return false;
    }
  };

  const goNext = () => {
    if (currentStep < TOTAL_STEPS && canProceed()) {
      setDirection(1);
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
    }
  };

  const stepLabels = ["Type", "Info", "Details", "Generate"];

  return (
    // Backdrop
    <motion.div
      id="intake-wizard-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(2, 6, 23, 0.85)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Card */}
      <motion.div
        id="intake-wizard-card"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800/80 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">Smart Intake</p>
              <p className="text-[11px] text-slate-600">{stepLabels[currentStep - 1]}</p>
            </div>
          </div>
          <button
            id="btn-close-wizard"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-all duration-150"
            aria-label="Close wizard"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pt-6 pb-0">
          <ProgressBar current={currentStep} total={TOTAL_STEPS} />

          {/* Animated step content */}
          <div className="overflow-hidden min-h-[340px]">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {currentStep === 1 && (
                  <StepDocType
                    selected={data.documentType}
                    onSelect={(id) => updateData("documentType", id)}
                  />
                )}
                {currentStep === 2 && (
                  <StepBasicInfo
                    data={{ yourName: data.yourName, counterpartyName: data.counterpartyName, jurisdiction: data.jurisdiction }}
                    onChange={updateData}
                  />
                )}
                {currentStep === 3 && (
                  <StepAIQuestions
                    data={{ agreementType: data.agreementType, purpose: data.purpose }}
                    onChange={updateData}
                  />
                )}
                {currentStep === 4 && (
                  <StepGenerate
                    data={data}
                    onGenerate={() => setIsGenerated(true)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-5 mt-2 border-t border-slate-800/80 bg-slate-900/50">
          <button
            id="btn-wizard-back"
            onClick={goBack}
            disabled={currentStep === 1}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
              ${currentStep === 1
                ? "text-slate-700 cursor-not-allowed"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          {currentStep < TOTAL_STEPS ? (
            <button
              id="btn-wizard-next"
              onClick={goNext}
              disabled={!canProceed()}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${canProceed()
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 hover:scale-[1.02] active:scale-100"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              id="btn-wizard-close-done"
              onClick={onClose}
              disabled={!isGenerated}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${isGenerated
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40 hover:scale-[1.02]"
                  : "bg-slate-800 text-slate-600 cursor-not-allowed"
                }`}
            >
              <Check className="w-4 h-4" />
              Done
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
