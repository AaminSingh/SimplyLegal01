"use client";

import { motion } from "framer-motion";
import {
  Scale,
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "templates", label: "Templates", icon: FileText, badge: "Pro" },
  { id: "documents", label: "My Documents", icon: FolderOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  activeView: string;
  onNavigate: (id: string) => void;
}

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col bg-slate-950 border-r border-slate-800/80 z-30">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-slate-800/80">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-indigo-600 shadow-lg shadow-indigo-900/60">
            <Scale className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-slate-950" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">SimplyLegal</span>
            <p className="text-[10px] text-slate-500 font-medium -mt-0.5">Legal Automation</p>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
          Main Menu
        </p>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3 }}
              onClick={() => onNavigate(item.id)}
              id={`nav-${item.id}`}
              className={`nav-link w-full text-left group ${isActive ? "active" : ""}`}
            >
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-400"
                    : "text-slate-500 group-hover:text-slate-300"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={isActive ? "text-slate-100" : ""}>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 ml-auto text-indigo-400 opacity-70" />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Upgrade Card */}
      <div className="px-3 pb-5">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="glass-card p-4 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/5 rounded-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-slate-200">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">
              Unlock AI drafting, e-signatures, and unlimited templates.
            </p>
            <button
              id="upgrade-btn"
              className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all duration-200 hover:shadow-md hover:shadow-indigo-900/50"
            >
              Get Pro Access
            </button>
          </div>
        </motion.div>

        {/* User Avatar */}
        <div className="flex items-center gap-3 mt-4 px-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold shrink-0">
            AJ
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">Alex Johnson</p>
            <p className="text-[10px] text-slate-500 truncate">alex@lexai.io</p>
          </div>
          <Settings className="w-3.5 h-3.5 text-slate-600 hover:text-slate-400 ml-auto cursor-pointer transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
}
