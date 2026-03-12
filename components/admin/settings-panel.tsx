"use client";

import { useState } from "react";
import { Database, Globe, Shield, Server, Clock, Zap } from "lucide-react";

interface PlatformStats {
  totalUsers: number;
  totalDecks: number;
  totalCards: number;
  totalReviews: number;
  suspendedUsers: number;
  publicDecks: number;
  dbProvider: string;
  nodeEnv: string;
}

export function SettingsPanel({ stats }: { stats: PlatformStats }) {
  const [activeSection, setActiveSection] = useState("general");

  const sections = [
    { key: "general", label: "General", icon: Globe },
    { key: "database", label: "Database", icon: Database },
    { key: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="flex gap-6">
      {/* Settings Sidebar */}
      <nav className="w-48 shrink-0 space-y-1">
        {sections.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSection(s.key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSection === s.key
                ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/25"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
            }`}
          >
            <s.icon size={15} />
            {s.label}
          </button>
        ))}
      </nav>

      {/* Settings Content */}
      <div className="flex-1 space-y-6">
        {activeSection === "general" && (
          <>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Globe size={16} className="text-indigo-400" />
                Platform Overview
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Users", value: stats.totalUsers, icon: "👥" },
                  { label: "Decks", value: stats.totalDecks, icon: "📚" },
                  { label: "Cards", value: stats.totalCards, icon: "🃏" },
                  { label: "Reviews", value: stats.totalReviews, icon: "✅" },
                  { label: "Suspended", value: stats.suspendedUsers, icon: "🚫" },
                  { label: "Public Decks", value: stats.publicDecks, icon: "🌐" },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg bg-slate-950/60 border border-slate-800 p-3">
                    <div className="text-lg mb-1">{item.icon}</div>
                    <div className="text-xl font-black text-slate-100">{item.value.toLocaleString()}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Zap size={16} className="text-amber-400" />
                Application Info
              </h3>
              <div className="space-y-3">
                {[
                  { label: "App Name", value: "Memoria" },
                  { label: "Framework", value: "Next.js 16" },
                  { label: "Auth Provider", value: "Clerk" },
                  { label: "Algorithm", value: "FSRS (Free Spaced Repetition Scheduler)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                    <span className="text-sm text-slate-400">{item.label}</span>
                    <span className="text-sm font-mono font-bold text-slate-200">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === "database" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database size={16} className="text-emerald-400" />
              Database Configuration
            </h3>
            <div className="space-y-3">
              {[
                { label: "Provider", value: stats.dbProvider },
                { label: "ORM", value: "Prisma" },
                { label: "Total Records", value: (stats.totalUsers + stats.totalDecks + stats.totalCards + stats.totalReviews).toLocaleString() },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                  <span className="text-sm text-slate-400">{item.label}</span>
                  <span className="text-sm font-mono font-bold text-slate-200">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Table Sizes</h4>
              {[
                { name: "Users", count: stats.totalUsers, color: "bg-indigo-500" },
                { name: "Decks", count: stats.totalDecks, color: "bg-violet-500" },
                { name: "Cards", count: stats.totalCards, color: "bg-cyan-500" },
                { name: "Reviews", count: stats.totalReviews, color: "bg-amber-500" },
              ].map((table) => {
                const max = Math.max(stats.totalUsers, stats.totalDecks, stats.totalCards, stats.totalReviews, 1);
                const pct = Math.max((table.count / max) * 100, 2);
                return (
                  <div key={table.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{table.name}</span>
                      <span className="font-mono text-slate-500">{table.count.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div className={`h-full rounded-full ${table.color} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSection === "security" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-5">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Shield size={16} className="text-rose-400" />
                Security Settings
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Authentication", value: "Clerk (OAuth + Email)", status: "active" },
                  { label: "Admin Protection", value: "Role-based middleware", status: "active" },
                  { label: "API Protection", value: "Server-side auth checks", status: "active" },
                  { label: "Environment", value: stats.nodeEnv, status: stats.nodeEnv === "production" ? "active" : "warning" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                    <div>
                      <span className="text-sm text-slate-400">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-slate-200">{item.value}</span>
                      <div className={`h-2 w-2 rounded-full ${item.status === "active" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-3">
              <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
                <Clock size={16} />
                Moderation Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3 text-center">
                  <div className="text-2xl font-black text-rose-400">{stats.suspendedUsers}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Suspended Users</div>
                </div>
                <div className="rounded-lg bg-slate-950/60 border border-slate-800 p-3 text-center">
                  <div className="text-2xl font-black text-emerald-400">{stats.publicDecks}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Public Decks</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
