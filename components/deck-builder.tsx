"use client";

import { useState } from "react";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createDeck } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function DeckBuilder() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cards, setCards] = useState([{ front: "", back: "" }]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [magicContent, setMagicContent] = useState("");
  const router = useRouter();

  const addCard = () => {
    setCards([...cards, { front: "", back: "" }]);
  };

  const removeCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const updateCard = (index: number, field: "front" | "back", value: string) => {
    const newCards = [...cards];
    newCards[index][field] = value;
    setCards(newCards);
  };

  const handleMagicGenerate = async () => {
    if (!magicContent) return;
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ content: magicContent }),
      });
      const data = await response.json();
      if (data.cards) {
        setCards([...cards, ...data.cards]);
      }
    } catch (error) {
      console.error("Failed to generate cards:", error);
    } finally {
      setIsGenerating(false);
      setMagicContent("");
    }
  };

  const handleSave = async () => {
    if (!title || cards.length === 0) return;
    setIsSaving(true);
    try {
      await createDeck(title, description, cards);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Failed to save deck:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight text-white">Create New Deck</h2>
        <div className="space-y-2">
          <Input 
            placeholder="Deck Title (e.g., Modern Web Dev)" 
            className="text-xl h-14 bg-slate-900/80 border-slate-700"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea 
            placeholder="Enter a description..." 
            className="bg-slate-900/80 border-slate-700 resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-6 space-y-4 relative overflow-hidden group">
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
            className="bg-slate-950/50 border-slate-800 mb-4 h-32"
            value={magicContent}
            onChange={(e) => setMagicContent(e.target.value)}
          />
          <Button 
            onClick={handleMagicGenerate}
            disabled={isGenerating || !magicContent}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing with Gemini...
              </>
            ) : "Generate Flashcards"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Flashcards ({cards.length})</h3>
          <Button variant="outline" size="sm" onClick={addCard}>
            <Plus className="h-4 w-4 mr-2" />
            Add Card
          </Button>
        </div>

        <div className="space-y-4">
          {cards.map((card, index) => (
            <div key={index} className="flex gap-4 items-start p-4 rounded-xl bg-slate-900 border border-slate-800 group transition-all hover:border-slate-700">
              <span className="mt-2 text-slate-600 font-mono text-xs">{index + 1}</span>
              <div className="flex-1 grid gap-4 grid-cols-2">
                <Textarea 
                  placeholder="Front" 
                  className="bg-slate-950 border-slate-800 resize-none h-24"
                  value={card.front}
                  onChange={(e) => updateCard(index, "front", e.target.value)}
                />
                <Textarea 
                  placeholder="Back" 
                  className="bg-slate-950 border-slate-800 resize-none h-24"
                  value={card.back}
                  onChange={(e) => updateCard(index, "back", e.target.value)}
                />
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="mt-2 text-slate-500 hover:text-rose-400"
                onClick={() => removeCard(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800 flex justify-end">
        <Button 
          size="lg" 
          className="px-12 font-bold"
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
