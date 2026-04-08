"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Share2,
  PenTool,
  ChevronLeft,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  FileText,
  MousePointerClick,
  Copy,
  CheckCheck,
  Clock,
  Shield,
  Upload,
  Loader2,
  AlertCircle,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Paragraph {
  id: string;
  heading: string;
  text: string;
  plainEnglish: string;
  tag?: string;
}

// ─── Dummy Legal Content ────────────────────────────────────────────────────────

const paragraphs: Paragraph[] = [
  {
    id: "p1",
    heading: "1. Definition of Confidential Information",
    tag: "Definitions",
    text: `"Confidential Information" means any and all technical and non-technical information provided by either party to the other, including but not limited to: patent and patent applications, trade secrets, proprietary information, techniques, sketches, drawings, models, inventions, know-how, processes, apparatus, equipment, algorithms, software programs, software source documents, and formulae related to the current, future and proposed products and services of each of the parties, and includes, without limitation, respective information concerning research, experimental work, development, design details and specifications, engineering, financial information, procurement requirements, purchasing, manufacturing, customer lists, investors, employees, business and contractual relationships, business forecasts, sales and merchandising, and marketing plans and information the disclosing party designates as being proprietary or confidential or which should reasonably be understood to be confidential given the nature of the information and the circumstances surrounding disclosure.`,
    plainEnglish: `**What this means for you:** This clause defines what counts as "secret" in this agreement. Basically, it covers almost everything — your code, business plans, client lists, financial data, and any other sensitive information either party shares. If it feels private or business-sensitive, assume it's covered. The key takeaway: don't share anything you learn from the other party with outsiders.`,
  },
  {
    id: "p2",
    heading: "2. Obligations of Receiving Party",
    tag: "Obligations",
    text: `The Receiving Party agrees to: (a) hold the Confidential Information in strict confidence and to take all reasonable precautions to protect such Confidential Information (including, without limitation, all precautions the Receiving Party employs with respect to its own confidential materials); (b) not to divulge any such Confidential Information or any information derived therefrom to any third party without prior written consent of the Disclosing Party; (c) not to make any use whatsoever at any time of such Confidential Information except to evaluate internally whether the parties desire to enter into the Proposed Transaction; and (d) not to copy or reverse engineer any such Confidential Information.`,
    plainEnglish: `**What this means for you:** This is the "keep it secret, keep it safe" section. If you receive confidential info, you must: (1) guard it as carefully as your own secrets, (2) never share it with anyone else without written permission, (3) only use it to evaluate whether you want to work together — not for any other purpose, and (4) never copy or reverse-engineer it. Bottom line: treat it like it's yours to protect, not to use.`,
  },
  {
    id: "p3",
    heading: "3. Term and Termination",
    tag: "Duration",
    text: `This Agreement shall commence on the Effective Date and shall remain in effect for a period of two (2) years thereafter, unless earlier terminated by either party upon thirty (30) days' prior written notice to the other party. Notwithstanding the foregoing, the obligations of each Receiving Party with respect to Confidential Information disclosed prior to the termination of this Agreement shall survive such termination and continue in perpetuity or until such time as the Confidential Information enters the public domain through no fault of the Receiving Party.`,
    plainEnglish: `**What this means for you:** This deal lasts **2 years** from the start date. Either party can end it early with 30 days' written notice. However — and this is important — even after the agreement ends, you must *keep* protecting any secrets you learned during the deal. The confidentiality duty lives on forever (or until the info becomes public knowledge through no fault of yours). Ending the contract doesn't free you from keeping secrets.`,
  },
  {
    id: "p4",
    heading: "4. Remedies",
    tag: "Enforcement",
    text: `Each party acknowledges that any breach of this Agreement by the Receiving Party may cause irreparable harm to the Disclosing Party for which monetary damages would be an inadequate remedy and that, in addition to any other remedies that may be available, in law, in equity or otherwise, the Disclosing Party shall be entitled to seek injunctive relief against the threatened breach of this Agreement or the continuation of any such breach by the Receiving Party, without the requirement of posting bail or other security or proving actual monetary damages.`,
    plainEnglish: `**What this means for you:** If you break this agreement, the other party can take you to court immediately — and they don't have to prove how much money they lost first. They can get a court order forcing you to stop the breach right away (called an "injunction"). This clause exists because leaking secrets is hard to put a dollar value on, so courts give extra protection here. In plain terms: *don't break this agreement — the legal consequences are swift and serious.*`,
  },
];

// ─── AI Feedback State ──────────────────────────────────────────────────────────

type FeedbackState = "none" | "up" | "down";

// ─── Paragraph Block ────────────────────────────────────────────────────────────

function ParagraphBlock({
  para,
  isActive,
  onClick,
}: {
  para: Paragraph;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <div
      id={`para-${para.id}`}
      onClick={onClick}
      className={`relative group cursor-pointer rounded-lg px-5 py-4 mb-1 transition-all duration-200 border-l-4 ${
        isActive
          ? "bg-indigo-50 border-indigo-400 shadow-sm"
          : "border-transparent hover:bg-gray-100 hover:border-gray-300"
      }`}
    >
      {/* Tag */}
      {para.tag && (
        <span
          className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mb-2 transition-colors ${
            isActive
              ? "bg-indigo-100 text-indigo-600"
              : "bg-gray-100 text-gray-400 group-hover:bg-gray-200"
          }`}
        >
          {para.tag}
        </span>
      )}

      {/* Section heading */}
      <h3
        className={`text-sm font-bold mb-2 transition-colors leading-snug ${
          isActive ? "text-indigo-700" : "text-gray-800 group-hover:text-gray-900"
        }`}
      >
        {para.heading}
      </h3>

      {/* Body text */}
      <p
        className={`text-sm leading-7 transition-colors ${
          isActive ? "text-gray-700" : "text-gray-600"
        }`}
        style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
      >
        {para.text}
      </p>

      {/* Hover hint */}
      {!isActive && (
        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <span className="flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5 shadow-sm">
            <MousePointerClick className="w-2.5 h-2.5" />
            Analyze
          </span>
        </div>
      )}
    </div>
  );
}

// ─── AI Assistant Panel ─────────────────────────────────────────────────────────

function AIPanel({
  paragraph,
  onDismiss,
}: {
  paragraph: Paragraph | null;
  onDismiss: () => void;
}) {
  const [feedback, setFeedback] = useState<FeedbackState>("none");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (paragraph) {
      navigator.clipboard.writeText(paragraph.plainEnglish.replace(/\*\*/g, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Reset feedback when paragraph changes
  const handleFeedback = (type: "up" | "down") => {
    setFeedback((prev) => (prev === type ? "none" : type));
  };

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!paragraph ? (
          /* Empty state */
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center h-full text-center px-8 py-12"
          >
            {/* Animated orb */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-indigo-400" />
              </div>
              <motion.div
                className="absolute inset-0 rounded-2xl"
                style={{ boxShadow: "0 0 0 0 rgba(99,102,241,0.4)" }}
                animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0.3)", "0 0 0 12px rgba(99,102,241,0)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
              />
            </div>
            <h3 className="text-sm font-bold text-slate-200 mb-2">
              AI Plain English
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-48">
              Click any paragraph on the left to see an instant AI translation in plain English.
            </p>

            {/* Hint pills */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {["Definitions", "Obligations", "Duration", "Enforcement"].map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-medium text-slate-600 bg-slate-800 border border-slate-700/60 rounded-full px-2.5 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Active analysis card */
          <motion.div
            key={paragraph.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="flex flex-col h-full"
          >
            {/* Card header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 shrink-0">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider leading-none mb-0.5">
                    Plain English
                  </p>
                  <p className="text-[11px] text-slate-600">AI Translation</p>
                </div>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/60 rounded-lg px-2.5 py-1.5 transition-all duration-150"
              >
                {copied ? (
                  <>
                    <CheckCheck className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copy
                  </>
                )}
              </button>
            </div>

            {/* Referring clause tag */}
            <div className="mb-3">
              <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-2.5 py-1 uppercase tracking-wider">
                {paragraph.tag} · {paragraph.heading.split(".")[0].trim()}
              </span>
            </div>

            {/* Translation body */}
            <div className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4 overflow-y-auto">
              {paragraph.plainEnglish.split("\n\n").map((chunk, i) => (
                <p
                  key={i}
                  className="text-sm text-slate-300 leading-relaxed mb-3 last:mb-0"
                  dangerouslySetInnerHTML={{
                    __html: chunk
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-100 font-semibold">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="text-slate-200 italic">$1</em>')
                  }}
                />
              ))}
            </div>

            {/* Key takeaway chip */}
            <div className="flex items-start gap-2.5 bg-amber-500/8 border border-amber-500/20 rounded-xl p-3.5 mb-4">
              <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/80 leading-relaxed">
                <span className="font-semibold text-amber-300">Legal note:</span> This is a simplified explanation for clarity only. Always consult a licensed attorney for binding legal advice.
              </p>
            </div>

            {/* Feedback row */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <p className="text-xs text-slate-600">Was this helpful?</p>
              <div className="flex items-center gap-1.5">
                <button
                  id="feedback-thumbs-up"
                  onClick={() => handleFeedback("up")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    feedback === "up"
                      ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  {feedback === "up" ? "Thanks!" : "Yes"}
                </button>
                <button
                  id="feedback-thumbs-down"
                  onClick={() => handleFeedback("down")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    feedback === "down"
                      ? "bg-red-500/15 border border-red-500/30 text-red-400"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  {feedback === "down" ? "Noted" : "No"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Review Panel ───────────────────────────────────────────────────────────────

function ReviewPanel({
  loading,
  result,
  error,
  onClear,
}: {
  loading: boolean;
  result: string | null;
  error: string | null;
  onClear: () => void;
}) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-sm font-semibold text-slate-300">Analyzing document…</p>
        <p className="text-xs text-slate-500 text-center">
          The AI is reviewing your contract for issues and improvements.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-6">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-sm font-bold text-red-400">Review Failed</p>
        <p className="text-xs text-slate-400 text-center leading-relaxed">{error}</p>
        <button onClick={onClear} className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">
          Dismiss
        </button>
      </div>
    );
  }

  if (result) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30">
              <Sparkles className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider leading-none mb-0.5">
                AI Review
              </p>
              <p className="text-[11px] text-slate-600">Contract Analysis</p>
            </div>
          </div>
          <button
            onClick={onClear}
            className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
          >
            Clear ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          {result.split("\n").map((line, i) => (
            <p
              key={i}
              className={`text-sm leading-relaxed mb-2 last:mb-0 ${
                line.startsWith("#") || /^\d+\./.test(line)
                  ? "font-semibold text-slate-100"
                  : "text-slate-300"
              }`}
            >
              {line || <br />}
            </p>
          ))}
        </div>
        <div className="flex items-start gap-2.5 bg-amber-500/8 border border-amber-500/20 rounded-xl p-3.5 mt-4">
          <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-300/80 leading-relaxed">
            <span className="font-semibold text-amber-300">Legal note:</span> This AI analysis is for informational purposes only. Always consult a licensed attorney for binding legal advice.
          </p>
        </div>
      </div>
    );
  }

  return null;
}

// ─── Document Viewer ────────────────────────────────────────────────────────────

interface DocumentViewerProps {
  onBack: () => void;
}

export default function DocumentViewer({ onBack }: DocumentViewerProps) {
  const [activeParagraphId, setActiveParagraphId] = useState<string | null>(null);
  const [shareToast, setShareToast] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewResult, setReviewResult] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeParagraph = paragraphs.find((p) => p.id === activeParagraphId) ?? null;
  const isReviewMode = reviewLoading || !!reviewResult || !!reviewError;

  const handleShare = () => {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleReviewUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input so same file can be re-selected
    e.target.value = "";

    setReviewLoading(true);
    setReviewResult(null);
    setReviewError(null);
    setActiveParagraphId(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/backend/review", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({ detail: `Server error ${response.status}` }));
        throw new Error(errBody.detail ?? `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      setReviewResult(data.analysis);
    } catch (err: unknown) {
      setReviewError(err instanceof Error ? err.message : "Review failed. Is the backend running?");
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-slate-950 pl-64">

      {/* ── Top Action Bar ── */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/80">
        {/* Left: back + title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            id="btn-back-dashboard"
            onClick={onBack}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-all duration-150 shrink-0"
            aria-label="Back to dashboard"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0">
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold text-slate-100 truncate leading-tight">
                Freelance NDA — Draft
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[10px] text-slate-600">
                  <Clock className="w-2.5 h-2.5" />
                  Last edited today
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[10px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                  Draft
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Hidden file input for review upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt"
            className="hidden"
            onChange={handleReviewUpload}
          />
          <button
            id="btn-review-upload"
            onClick={() => fileInputRef.current?.click()}
            className="btn-ghost text-xs px-3 py-2"
            aria-label="Upload document for AI review"
          >
            <Upload className="w-3.5 h-3.5" />
            Review Doc
          </button>
          <button
            id="btn-download-pdf"
            className="btn-ghost text-xs px-3 py-2"
            aria-label="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
          <button
            id="btn-share-doc"
            onClick={handleShare}
            className="btn-ghost text-xs px-3 py-2"
            aria-label="Share document"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share
          </button>
          <button
            id="btn-sign-document"
            className="btn-primary text-xs px-4 py-2"
            aria-label="Sign document"
          >
            <PenTool className="w-3.5 h-3.5" />
            Sign Document
          </button>
        </div>
      </div>

      {/* Share toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: -8, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -8, x: "-50%" }}
            className="fixed top-16 left-1/2 z-50 flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            Share link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Split View ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT: Legal Document Pane (60%) */}
        <div className="w-[60%] overflow-y-auto bg-gray-50" style={{ height: "calc(100vh - 57px)" }}>
          <div className="max-w-2xl mx-auto py-10 px-6">

            {/* Paper document container */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.10)] border border-gray-100 overflow-hidden">

              {/* Document header */}
              <div className="border-b border-gray-100 px-10 py-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-bold text-indigo-600 tracking-widest uppercase">
                      SimplyLegal · Verified Document
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">Doc ID: NDA-2026-001</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                  NON-DISCLOSURE AGREEMENT
                </h2>
                <p className="text-sm text-gray-500 text-center mb-5">
                  This Agreement is entered into as of{" "}
                  <span className="font-semibold text-gray-700">October 8, 2026</span>
                </p>

                {/* Parties */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Disclosing Party</p>
                    <p className="text-sm font-bold text-gray-800">Acme Corp</p>
                    <p className="text-xs text-gray-500 mt-0.5">Delaware, United States</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Receiving Party</p>
                    <p className="text-sm font-bold text-gray-800">Globex Inc</p>
                    <p className="text-xs text-gray-500 mt-0.5">California, United States</p>
                  </div>
                </div>
              </div>

              {/* Preamble */}
              <div className="px-10 pt-6 pb-2">
                <p className="text-sm text-gray-600 leading-7 mb-2" style={{ fontFamily: "'Georgia', serif" }}>
                  <span className="font-semibold text-gray-800">WHEREAS,</span> the parties desire to explore a potential business relationship (the{" "}
                  <span className="italic">"Proposed Transaction"</span>) and, in connection therewith, each party may disclose certain confidential and proprietary information to the other party; and
                </p>
                <p className="text-sm text-gray-600 leading-7 mb-6" style={{ fontFamily: "'Georgia', serif" }}>
                  <span className="font-semibold text-gray-800">NOW, THEREFORE,</span> in consideration of the mutual covenants and agreements hereinafter set forth, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the parties agree as follows:
                </p>

                {/* Click hint banner */}
                <div className="flex items-center gap-2.5 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-6">
                  <MousePointerClick className="w-4 h-4 text-indigo-500 shrink-0" />
                  <p className="text-xs text-indigo-600 font-medium">
                    Click any clause below to instantly decode it into plain English →
                  </p>
                </div>
              </div>

              {/* Clause paragraphs */}
              <div className="px-5 pb-8">
                {paragraphs.map((para) => (
                  <ParagraphBlock
                    key={para.id}
                    para={para}
                    isActive={activeParagraphId === para.id}
                    onClick={() =>
                      setActiveParagraphId((prev) =>
                        prev === para.id ? null : para.id
                      )
                    }
                  />
                ))}
              </div>

              {/* Signature block */}
              <div className="border-t border-gray-100 px-10 py-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-5">Signatures</p>
                <div className="grid grid-cols-2 gap-8">
                  {["Acme Corp", "Globex Inc"].map((party) => (
                    <div key={party}>
                      <div className="h-12 border-b-2 border-dashed border-gray-200 mb-2 flex items-end pb-1">
                        <span className="text-xs text-gray-300 italic">Sign here</span>
                      </div>
                      <p className="text-xs font-semibold text-gray-500">{party}</p>
                      <p className="text-[10px] text-gray-400">Authorized Representative</p>
                      <p className="text-[10px] text-gray-400 mt-1">Date: ___________</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-gray-400 mt-4 mb-8">
              Generated by SimplyLegal · For review purposes only · Not a substitute for legal counsel
            </p>
          </div>
        </div>

        {/* RIGHT: AI Assistant Pane (40%) */}
        <div
          className="w-[40%] border-l border-slate-800/80 bg-slate-900/40"
          style={{ height: "calc(100vh - 57px)" }}
        >
          <div className="sticky top-0 h-full flex flex-col px-5 py-5">
            {/* Right pane header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isReviewMode ? "bg-amber-500" : "bg-indigo-500"}`} />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {isReviewMode ? "AI Review" : "AI Assistant"}
                </span>
              </div>
              {!isReviewMode && activeParagraph && (
                <button
                  id="btn-clear-analysis"
                  onClick={() => setActiveParagraphId(null)}
                  className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
                >
                  Clear ✕
                </button>
              )}
            </div>

            {/* Scrollable AI panel content */}
            <div className="flex-1 overflow-y-auto">
              {isReviewMode ? (
                <ReviewPanel
                  loading={reviewLoading}
                  result={reviewResult}
                  error={reviewError}
                  onClear={() => {
                    setReviewResult(null);
                    setReviewError(null);
                  }}
                />
              ) : (
                <AIPanel
                  paragraph={activeParagraph}
                  onDismiss={() => setActiveParagraphId(null)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
