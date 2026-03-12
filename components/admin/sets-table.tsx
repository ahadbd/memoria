"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Search } from "lucide-react";
import { adminDeleteDeck } from "@/lib/actions";
import { useRouter } from "next/navigation";

interface StudySet {
  id: string;
  title: string;
  author: string;
  cards: number;
  isPublic: boolean;
  createdAt: string;
}

export function AdminSetsTable({ sets }: { sets: StudySet[] }) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const router = useRouter();

  const filtered = sets.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (deckId: string) => {
    startTransition(async () => {
      await adminDeleteDeck(deckId);
      setConfirmDelete(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search sets..."
          className="pl-10 bg-slate-900/80 border-slate-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/50 text-slate-400 text-left">
            <tr>
              <th className="p-4 font-bold text-xs uppercase tracking-widest">Title</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest">Author</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest text-center">Cards</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest">Visibility</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest">Created</th>
              <th className="p-4 font-bold text-xs uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(set => (
              <tr key={set.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                <td className="p-4">
                  <span className="font-bold text-slate-100">{set.title}</span>
                </td>
                <td className="p-4 text-slate-400">{set.author}</td>
                <td className="p-4 text-center font-mono text-slate-400">{set.cards}</td>
                <td className="p-4">
                  <Badge variant={set.isPublic ? "emerald" : "slate"} className="text-[10px]">
                    {set.isPublic ? "Public" : "Private"}
                  </Badge>
                </td>
                <td className="p-4 text-xs text-slate-500 font-mono">{set.createdAt}</td>
                <td className="p-4 text-right">
                  {confirmDelete === set.id ? (
                    <div className="flex items-center gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={() => setConfirmDelete(null)} disabled={isPending} className="h-7 text-xs">
                        Cancel
                      </Button>
                      <Button size="sm" className="h-7 text-xs bg-rose-600 hover:bg-rose-500" onClick={() => handleDelete(set.id)} disabled={isPending}>
                        {isPending ? "..." : "Confirm"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Delete Set"
                      onClick={() => setConfirmDelete(set.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4 text-rose-400" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-600">No study sets found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
