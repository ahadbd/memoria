import StudySession from "@/components/study-session";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { saveReviewResults } from "@/lib/actions";

interface StudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudyPage({ params }: StudyPageProps) {
  const { id } = await params;

  const deck = await prisma.deck.findUnique({
    where: { id },
    include: {
      cards: {
        orderBy: {
          nextReview: 'asc'
        }
      }
    }
  });

  if (!deck) {
    notFound();
  }

  // Map Prisma models to the Flashcard interface expected by StudySession
  const formattedCards = deck.cards.map(card => ({
    id: card.id,
    front: card.front,
    back: card.back,
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsedDays,
    scheduledDays: card.scheduledDays,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    lastReview: card.lastReview,
    nextReview: card.nextReview,
  }));

  const handleSessionComplete = async (results: any[]) => {
    "use server";
    await saveReviewResults(results);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-white transition-colors group"
          >
            <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Dashboard
          </Link>
          <div className="text-right">
            <h1 className="text-xl font-bold text-white uppercase tracking-tight">{deck.title}</h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Study Session</p>
          </div>
        </div>
        
        <StudySession 
          cards={formattedCards} 
          onSessionComplete={handleSessionComplete}
        />
      </div>
    </div>
  );
}
