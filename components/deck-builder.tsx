"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDeck } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { experimental_useObject } from "@ai-sdk/react";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";

export default function DeckBuilder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [isSaving, setIsSaving] = useState(false);
  const [magicContent, setMagicContent] = useState("");
  const router = useRouter();

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }]);
  };

  const removeCard = (index: number) => {
    if (cards.length <= 1) return;
    setCards(cards.filter((_, i) => i !== index));
  };

  const updateCard = (index: number, field: "front" | "back", value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const clearAll = () => {
    setCards([{ front: "", back: "" }]);
  };

  const { submit, isLoading: isGenerating, object } = experimental_useObject({
    api: '/api/generate',
    schema: z.object({
      cards: z.array(
        z.object({
          front: z.string(),
          back: z.string(),
        })
      ),
    }),
    onFinish: ({ object }) => {
      if (object?.cards) {
        setCards((prev) => {
          const validOldCards = prev.filter(c => c.front !== "" || c.back !== "");
          return [...validOldCards, ...object.cards as {front: string, back: string}[]];
        });
        setMagicContent("");
      }
    }
  });

  const handleMagicGenerate = async () => {
    if (!magicContent) return;
    submit({ content: magicContent });
  };

  const handleSave = async () => {
    if (!title || cards.length === 0) return;
    setIsSaving(true);
    try {
      await createDeck(title, description, cards.filter(c => c.front && c.back));
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Failed to save deck:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const nonEmptyCards = cards.filter(c => c.front || c.back);

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Title Section */}
      <div className="space-y-4">
        <h2 className="text-3xl font-black tracking-tight text-white">Create New Deck</h2>
        <div className="space-y-3">
          <Input
            placeholder="Deck Title (e.g., Modern Web Dev)"
            className="text-xl h-14 bg-slate-900/80 border-slate-700 focus:border-indigo-500/50 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Enter a description..."
            className="bg-slate-900/80 border-slate-700 resize-none focus:border-indigo-500/50 transition-colors"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Magic Generate */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 p-6 space-y-4 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
           <Sparkles size={100} />
        </div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-indigo-300 flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Magic Generate
          </h3>
          <p className="text-sm text-slate-400 mb-4">Paste your notes or text here, and Gemini will create flashcards for you!</p>
          <Textarea
            placeholder="Paste your notes here..."
            className="bg-slate-950/50 border-slate-800 mb-4 h-32 focus:border-indigo-500/50 transition-colors"
            value={magicContent}
            onChange={(e) => setMagicContent(e.target.value)}
          />
          <Button
            onClick={handleMagicGenerate}
            disabled={isGenerating || !magicContent}
            className="w-full bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 font-bold transition-all hover:shadow-indigo-500/40"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing with Gemini...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Flashcards
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Flashcards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold">
            Flashcards
            <span className="ml-2 px-2.5 py-0.5 text-sm rounded-full bg-indigo-500/20 text-indigo-400 font-bold">{cards.length}</span>
          </h3>
          <div className="flex gap-2">
            {nonEmptyCards.length > 1 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="text-slate-500 hover:text-rose-400">
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={addCard} className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
              <Plus className="h-4 w-4 mr-2" />
              Add Card
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence>
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: "auto", scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4 items-start p-4 rounded-xl bg-slate-900 border border-slate-800 group transition-all hover:border-slate-700"
              >
                <span className="mt-2 text-slate-600 font-mono text-xs w-6 text-center">{index + 1}</span>
                <div className="flex-1 grid gap-4 grid-cols-2">
                  <Textarea
                    placeholder="Front (Question)"
                    className="bg-slate-950 border-slate-800 resize-none h-24 focus:border-indigo-500/50 transition-colors"
                    value={card.front}
                    onChange={(e) => updateCard(index, "front", e.target.value)}
                  />
                  <Textarea
                    placeholder="Back (Answer)"
                    className="bg-slate-950 border-slate-800 resize-none h-24 focus:border-indigo-500/50 transition-colors"
                    value={card.back}
                    onChange={(e) => updateCard(index, "back", e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="mt-2 text-slate-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={() => removeCard(index)}
                  disabled={cards.length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Save */}
      <div className="pt-8 border-t border-slate-800 flex justify-end">
        <Button
          size="lg"
          className="px-12 font-bold bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
          onClick={handleSave}
          disabled={isSaving || !title || cards.length === 0}
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : "Save Deck"}
        </Button>
      </div>
    </div>
  );
}
