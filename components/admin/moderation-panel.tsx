"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldAlert, Eye, EyeOff, Trash2, UserX, UserCheck } from "lucide-react";
import { toggleSuspendUser, adminDeleteDeck, adminToggleDeckVisibility } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface SuspendedUser {
  id: string;
  name: string;
  email: string;
  streak: number;
  decks: number;
  reviews: number;
  suspendedSince: string;
}

interface FlaggedDeck {
  id: string;
  title: string;
  author: string;
  cards: number;
  isPublic: boolean;
  createdAt: string;
}

export function ModerationPanel({
  suspendedUsers,
  publicDecks,
}: {
  suspendedUsers: SuspendedUser[];
  publicDecks: FlaggedDeck[];
}) {
  const [tab, setTab] = useState<"users" | "decks">("users");
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const router = useRouter();

  const tabs = [
    { key: "users" as const, label: "Suspended Users", count: suspendedUsers.length },
    { key: "decks" as const, label: "Public Decks", count: publicDecks.length },
  ];

  const filteredUsers = suspendedUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredDecks = publicDecks.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnsuspend = (userId: string) => {
    startTransition(async () => {
      await toggleSuspendUser(userId);
      setConfirmAction(null);
      router.refresh();
    });
  };

  const handleToggleVisibility = (deckId: string) => {
    startTransition(async () => {
      await adminToggleDeckVisibility(deckId);
      router.refresh();
    });
  };

  const handleDeleteDeck = (deckId: string) => {
    startTransition(async () => {
      await adminDeleteDeck(deckId);
      setConfirmAction(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === t.key
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
            }`}
          >
            {t.label}
            <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-black ${
              tab === t.key ? "bg-indigo-500/30 text-indigo-300" : "bg-slate-800 text-slate-500"
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder={tab === "users" ? "Search suspended users..." : "Search public decks..."}
          className="pl-10 bg-slate-900/80 border-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Suspended Users Tab */}
      {tab === "users" && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-widest">User</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">Decks</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">Reviews</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">Streak</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest">Suspended Since</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-rose-500/20 flex items-center justify-center">
                        <UserX size={14} className="text-rose-400" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-100">{user.name}</span>
                        <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center font-mono text-slate-400">{user.decks}</td>
                  <td className="p-4 text-center font-mono text-slate-400">{user.reviews}</td>
                  <td className="p-4 text-center font-mono text-slate-400">{user.streak}</td>
                  <td className="p-4 text-xs text-slate-500 font-mono">{user.suspendedSince}</td>
                  <td className="p-4 text-right">
                    {confirmAction === `unsuspend-${user.id}` ? (
                      <div className="flex items-center gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => setConfirmAction(null)} disabled={isPending} className="h-7 text-xs">
                          Cancel
                        </Button>
                        <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500" onClick={() => handleUnsuspend(user.id)} disabled={isPending}>
                          {isPending ? "..." : "Confirm"}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Unsuspend User"
                        onClick={() => setConfirmAction(`unsuspend-${user.id}`)}
                        className="h-8 gap-1.5 text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        <UserCheck size={14} />
                        Unsuspend
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <ShieldAlert size={32} className="mx-auto text-slate-700 mb-3" />
                    <p className="text-slate-600 text-sm">No suspended users</p>
                    <p className="text-slate-700 text-xs mt-1">All users are currently active</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Public Decks Tab */}
      {tab === "decks" && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="p-4 font-bold text-xs uppercase tracking-widest">Deck</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest">Author</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">Cards</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest">Visibility</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest">Created</th>
                <th className="p-4 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDecks.map((deck) => (
                <tr key={deck.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-slate-100">{deck.title}</span>
                  </td>
                  <td className="p-4 text-slate-400">{deck.author}</td>
                  <td className="p-4 text-center font-mono text-slate-400">{deck.cards}</td>
                  <td className="p-4">
                    <Badge variant={deck.isPublic ? "emerald" : "slate"} className="text-[10px]">
                      {deck.isPublic ? "Public" : "Private"}
                    </Badge>
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-mono">{deck.createdAt}</td>
                  <td className="p-4 text-right">
                    {confirmAction === `delete-${deck.id}` ? (
                      <div className="flex items-center gap-2 justify-end">
                        <Button size="sm" variant="outline" onClick={() => setConfirmAction(null)} disabled={isPending} className="h-7 text-xs">
                          Cancel
                        </Button>
                        <Button size="sm" className="h-7 text-xs bg-rose-600 hover:bg-rose-500" onClick={() => handleDeleteDeck(deck.id)} disabled={isPending}>
                          {isPending ? "..." : "Delete"}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          title={deck.isPublic ? "Make Private" : "Make Public"}
                          onClick={() => handleToggleVisibility(deck.id)}
                          disabled={isPending}
                          className="h-8 w-8"
                        >
                          {deck.isPublic ? (
                            <EyeOff className="h-4 w-4 text-amber-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-emerald-400" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete Deck"
                          onClick={() => setConfirmAction(`delete-${deck.id}`)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-rose-400" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredDecks.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <Eye size={32} className="mx-auto text-slate-700 mb-3" />
                    <p className="text-slate-600 text-sm">No public decks</p>
                    <p className="text-slate-700 text-xs mt-1">All decks are currently private</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
