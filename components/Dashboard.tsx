"use client";

import { motion } from "framer-motion";
import {
  Plus,
  MoreVertical,
  FileSignature,
  Clock,
  CheckCircle2,
  FileSearch,
  TrendingUp,
  Shield,
  Zap,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type DocumentStatus = "Draft" | "Signed" | "Pending Review";

interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  date: string;
  status: DocumentStatus;
}

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const recentDocuments: DocumentRecord[] = [
  {
    id: "doc-1",
    name: "Freelance NDA",
    type: "Non-Disclosure Agreement",
    date: "Oct 24, 2026",
    status: "Draft",
  },
  {
    id: "doc-2",
    name: "Apartment Lease",
    type: "Residential Lease",
    date: "Oct 22, 2026",
    status: "Signed",
  },
  {
    id: "doc-3",
    name: "Service Agreement",
    type: "Professional Services",
    date: "Oct 20, 2026",
    status: "Pending Review",
  },
];

const stats = [
  {
    id: "stat-total",
    label: "Total Documents",
    value: "24",
    delta: "+3 this week",
    icon: FileSignature,
    color: "indigo",
  },
  {
    id: "stat-pending",
    label: "Pending Review",
    value: "5",
    delta: "2 due today",
    icon: Clock,
    color: "amber",
  },
  {
    id: "stat-signed",
    label: "Signed",
    value: "18",
    delta: "+12 this month",
    icon: CheckCircle2,
    color: "emerald",
  },
  {
    id: "stat-ai",
    label: "AI Drafts",
    value: "9",
    delta: "Avg 4min saved",
    icon: Zap,
    color: "purple",
  },
];

// ─── Status Badge ──────────────────────────────────────────────────────────────
const statusConfig: Record<
  DocumentStatus,
  { label: string; className: string; dot: string }
> = {
  Draft: {
    label: "Draft",
    className: "bg-slate-700/60 text-slate-300 border border-slate-600/40",
    dot: "bg-slate-400",
  },
  Signed: {
    label: "Signed",
    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    dot: "bg-emerald-400",
  },
  "Pending Review": {
    label: "Pending Review",
    className: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    dot: "bg-amber-400",
  },
};

function StatusBadge({ status }: { status: DocumentStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`badge gap-1.5 ${cfg.className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const colorMap: Record<string, { bg: string; icon: string; glow: string }> = {
  indigo: {
    bg: "bg-indigo-500/10 border-indigo-500/20",
    icon: "text-indigo-400",
    glow: "shadow-indigo-900/20",
  },
  amber: {
    bg: "bg-amber-500/10 border-amber-500/20",
    icon: "text-amber-400",
    glow: "shadow-amber-900/20",
  },
  emerald: {
    bg: "bg-emerald-500/10 border-emerald-500/20",
    icon: "text-emerald-400",
    glow: "shadow-emerald-900/20",
  },
  purple: {
    bg: "bg-purple-500/10 border-purple-500/20",
    icon: "text-purple-400",
    glow: "shadow-purple-900/20",
  },
};

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  const Icon = stat.icon;
  const colors = colorMap[stat.color];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
      id={stat.id}
      className="glass-card p-5 hover:border-slate-700/80 transition-colors duration-200 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl border ${colors.bg}`}
        >
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-700 group-hover:text-slate-500 transition-colors duration-200" />
      </div>
      <p className="text-2xl font-bold text-slate-100 mb-1">{stat.value}</p>
      <p className="text-sm text-slate-400 font-medium">{stat.label}</p>
      <p className="text-xs text-slate-600 mt-1">{stat.delta}</p>
    </motion.div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export default function Dashboard({
  onCreateDocument,
  onOpenDocument,
}: {
  onCreateDocument?: () => void;
  onOpenDocument?: () => void;
}) {
  return (
    <main className="min-h-screen bg-slate-950 pl-64">
      <div className="max-w-6xl mx-auto px-8 py-10">

        {/* ── Top Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                ✦ AI Ready
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
              Good morning, Alex 👋
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Tuesday, October 8, 2026 · 3 documents need your attention
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button id="btn-search" className="btn-ghost">
              <FileSearch className="w-4 h-4" />
              Search docs
            </button>
            <button id="btn-create-doc" className="btn-primary" onClick={onCreateDocument}>
              <Plus className="w-4 h-4" />
              Create New Document
            </button>
          </div>
        </motion.div>

        {/* ── Hero Banner ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          id="hero-banner"
          className="relative rounded-2xl overflow-hidden mb-8 glow-indigo"
          style={{
            background:
              "linear-gradient(135deg, #1e1b4b 0%, #1e2a4a 40%, #0f172a 100%)",
          }}
        >
          {/* Background Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-20 w-40 h-40 bg-purple-600/15 rounded-full blur-2xl translate-y-1/2" />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative px-10 py-10 flex items-center justify-between">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-medium text-indigo-300/80">
                  Bank-grade encryption · SOC 2 Compliant
                </span>
              </div>
              <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                Welcome back.{" "}
                <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Let&apos;s draft something secure.
                </span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                Your AI assistant is ready. Start a new contract, review pending documents, or
                explore 200+ legal templates.
              </p>
              <div className="flex items-center gap-3">
                <button id="btn-hero-create" className="btn-primary" onClick={onCreateDocument}>
                  <Plus className="w-4 h-4" />
                  Create New Document
                </button>
                <button id="btn-hero-templates" className="btn-ghost border border-slate-700/60 hover:border-slate-600">
                  <TrendingUp className="w-4 h-4" />
                  Browse Templates
                </button>
              </div>
            </div>

            {/* Decorative Card Stack */}
            <div className="hidden xl:flex flex-col gap-2 mr-4 opacity-70">
              {[
                { label: "NDA Agreement", tag: "AI Drafted", color: "indigo" },
                { label: "Service Contract", tag: "Signed", color: "emerald" },
                { label: "Lease Agreement", tag: "In Review", color: "amber" },
              ].map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-sm border border-slate-700/40 rounded-xl px-4 py-3 min-w-48"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-600/30 flex items-center justify-center">
                    <FileSignature className="w-3 h-3 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-200">{card.label}</p>
                    <p className="text-[10px] text-slate-500">{card.tag}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <StatCard key={stat.id} stat={stat} index={i} />
          ))}
        </div>

        {/* ── Recent Documents Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          id="recent-documents"
          className="glass-card overflow-hidden"
        >
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
            <div>
              <h3 className="text-base font-semibold text-slate-100">Recent Documents</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your latest files and their current status
              </p>
            </div>
            <button id="btn-view-all" onClick={onOpenDocument} className="btn-ghost text-xs">
              View all
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/60">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentDocuments.map((doc, i) => (
                  <motion.tr
                    key={doc.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.35 }}
                    id={doc.id}
                    onClick={onOpenDocument}
                    className="table-row-hover group cursor-pointer"
                  >
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 shrink-0 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/10 transition-all duration-200">
                          <FileSignature className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors duration-200" />
                        </div>
                        <span className="text-sm font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                          {doc.name}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">{doc.type}</span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-600" />
                        {doc.date}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={doc.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1 text-[10px] font-medium text-indigo-400 mr-1">
                          <ExternalLink className="w-3 h-3" />
                          Open
                        </span>
                        <button
                          id={`actions-${doc.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-300 hover:bg-slate-700/60 transition-all duration-150"
                          aria-label={`Actions for ${doc.name}`}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800/80 bg-slate-900/20">
            <p className="text-xs text-slate-600">
              Showing 3 of 24 documents
            </p>
            <div className="flex items-center gap-2">
              <button id="btn-prev-page" className="btn-ghost text-xs px-3 py-1.5 opacity-40 cursor-not-allowed">
                Previous
              </button>
              <button id="btn-next-page" className="btn-ghost text-xs px-3 py-1.5">
                Next
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Actions Row ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.4 }}
          className="mt-6 grid grid-cols-3 gap-4"
        >
          {[
            {
              id: "quick-nda",
              icon: FileSignature,
              title: "New NDA",
              desc: "Draft in under 2 minutes with AI",
              color: "indigo",
            },
            {
              id: "quick-lease",
              icon: Shield,
              title: "Lease Agreement",
              desc: "Residential or commercial templates",
              color: "emerald",
            },
            {
              id: "quick-service",
              icon: Zap,
              title: "Service Contract",
              desc: "Freelance & agency-ready contracts",
              color: "purple",
            },
          ].map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                id={action.id}
                onClick={onCreateDocument}
                className="glass-card p-4 text-left hover:border-slate-700/80 transition-all duration-200 group hover:scale-[1.01] active:scale-100"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-sm font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                    {action.title}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 ml-auto transition-colors" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-11">{action.desc}</p>
              </button>
            );
          })}
        </motion.div>
      </div>
    </main>
  );
}
