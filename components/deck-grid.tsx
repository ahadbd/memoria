"use client";

import { useState, useTransition } from "react";
import { Search, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { deleteDeck } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Deck {
  id: string;
  title: string;
  count: number;
  due: number;
  mastery: number;
}

type SortKey = "updated" | "due" | "alpha";

export default function DeckGrid({ decks }: { decks: Deck[] }) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("updated");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = decks
    .filter(d => d.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "due") return b.due - a.due;
      if (sortBy === "alpha") return a.title.localeCompare(b.title);
      return 0; // "updated" is already sorted from server
    });

  const handleDelete = (deckId: string) => {
    startTransition(async () => {
      await deleteDeck(deckId);
      setConfirmDelete(null);
      router.refresh();
    });
  };

  const getDueBadge = (due: number) => {
    if (due >= 10) return { text: `${due} overdue`, cls: "bg-rose-500/20 text-rose-400 border-rose-500/30" };
    if (due > 0) return { text: `${due} due today`, cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    return { text: "All caught up", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
  };

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: "updated", label: "Recent" },
    { key: "due", label: "Most Due" },
    { key: "alpha", label: "A→Z" },
  ];

  return (
    <section className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <h2 className="text-xl font-bold tracking-tight">Your Decks</h2>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search decks..."
              className="pl-10 bg-slate-900/80 border-slate-700 h-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 p-1">
            {sortOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                  sortBy === opt.key
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filtered.map((deck) => {
            const badge = getDueBadge(deck.due);
            return (
              <motion.div
                key={deck.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-indigo-500/40 transition-all hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between h-52"
              >
                {/* Delete Confirmation Overlay */}
                <AnimatePresence>
                  {confirmDelete === deck.id && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 p-6"
                    >
                      <p className="text-sm font-semibold text-center">Delete <span className="text-rose-400">{deck.title}</span>?</p>
                      <p className="text-xs text-slate-500 text-center">This will permanently delete all {deck.count} cards.</p>
                      <div className="flex gap-3">
                        <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)} disabled={isPending}>Cancel</Button>
                        <Button size="sm" className="bg-rose-600 hover:bg-rose-500" onClick={() => handleDelete(deck.id)} disabled={isPending}>
                          {isPending ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold group-hover:text-indigo-400 transition-colors tracking-tight truncate">
                      {deck.title}
                    </h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">{deck.count} cards</p>
                  </div>

                  {/* Progress Ring */}
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <svg className="h-12 w-12 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-slate-800" />
                      <circle
                        cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3"
                        strokeDasharray={`${deck.mastery * 0.94} 94`}
                        strokeLinecap="round"
                        className={deck.mastery >= 80 ? "text-emerald-500" : deck.mastery >= 40 ? "text-amber-500" : "text-indigo-500"}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-300">{deck.mastery}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.cls}`}>
                    {badge.text}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => { e.preventDefault(); setConfirmDelete(deck.id); }}
                      className="p-2 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                    <Link href={`/study/${deck.id}`}>
                      <Button size="sm" className="font-bold bg-indigo-600/80 hover:bg-indigo-500 text-xs px-4 shadow-lg shadow-indigo-500/20">
                        Study
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 rounded-3xl border-2 border-dashed border-slate-800">
            <p className="text-slate-500 font-medium">
              {search ? `No decks matching "${search}"` : "No decks yet. Create your first one!"}
            </p>
            {!search && (
              <Link href="/create">
                <Button variant="outline" className="rounded-full">Create Deck</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
