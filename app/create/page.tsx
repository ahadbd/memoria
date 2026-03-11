import DeckBuilder from "@/components/deck-builder";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group"
        >
          <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Dashboard
        </Link>
        <DeckBuilder />
      </div>
    </div>
  );
}
