"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import IntakeWizard from "@/components/IntakeWizard";
import DocumentViewer from "@/components/DocumentViewer";

type View = "dashboard" | "viewer" | "templates" | "documents" | "settings";

export default function Home() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleNavigate = (id: string) => {
    // Sidebar nav always goes back to top-level views and exits viewer
    setActiveView(id as View);
  };

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard
            onCreateDocument={() => setWizardOpen(true)}
            onOpenDocument={() => setActiveView("viewer")}
          />
        );
      case "viewer":
        return <DocumentViewer onBack={() => setActiveView("dashboard")} />;
      default:
        return (
          <main className="min-h-screen bg-slate-950 pl-64 flex items-center justify-center">
            <div className="text-center">
              <p className="text-slate-600 text-sm mb-2">Coming Soon</p>
              <h2 className="text-2xl font-bold text-slate-300 capitalize">{activeView}</h2>
              <button
                onClick={() => setActiveView("dashboard")}
                className="mt-6 btn-primary"
              >
                ← Back to Dashboard
              </button>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar activeView={activeView} onNavigate={handleNavigate} />
      {renderView()}

      {/* Smart Intake Wizard — portal-style overlay */}
      <AnimatePresence>
        {wizardOpen && (
          <IntakeWizard onClose={() => setWizardOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
