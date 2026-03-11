import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function syncUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) return null;

  const dbUser = await prisma.user.upsert({
    where: { clerkId: userId },
    update: {
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    },
    create: {
      clerkId: userId,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
    },
  });

  return dbUser;
}

export async function updateStreak(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) return;

  const now = new Date();
  const lastStudy = user.lastStudyDate;

  if (!lastStudy) {
    await prisma.user.update({
      where: { id: userId },
      data: { streak: 1, lastStudyDate: now },
    });
    return;
  }

  const diffInHours = (now.getTime() - lastStudy.getTime()) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    // Already studied today, or within 24h
    return;
  } else if (diffInHours < 48) {
    // Continue streak
    await prisma.user.update({
      where: { id: userId },
      data: { streak: { increment: 1 }, lastStudyDate: now },
    });
  } else {
    // Reset streak
    await prisma.user.update({
      where: { id: userId },
      data: { streak: 1, lastStudyDate: now },
    });
  }
}

export async function createDeck(title: string, description: string, cards: { front: string, back: string }[]) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) throw new Error("User not found");

  return await prisma.$transaction(async (tx) => {
    const deck = await tx.deck.create({
      data: {
        title,
        description,
        userId: dbUser.id,
        cards: {
          create: cards.map(card => ({
            front: card.front,
            back: card.back,
            nextReview: new Date(),
          }))
        }
      }
    });
    return deck;
  });
}

export async function saveReviewResults(results: { cardId: string, rating: number, nextState: any }[]) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) throw new Error("User not found");

  return await prisma.$transaction(async (tx) => {
    for (const result of results) {
      await tx.card.update({
        where: { id: result.cardId },
        data: {
          stability: result.nextState.stability,
          difficulty: result.nextState.difficulty,
          elapsedDays: result.nextState.elapsedDays,
          scheduledDays: result.nextState.scheduledDays,
          reps: result.nextState.reps,
          lapses: result.nextState.lapses,
          state: result.nextState.state,
          lastReview: result.nextState.lastReview,
          nextReview: result.nextState.nextReview,
        }
      });

      await tx.review.create({
        data: {
          cardId: result.cardId,
          userId: dbUser.id,
          rating: result.rating,
        }
      });
    }

    // Update streak if it's been a new day
    await updateStreak(dbUser.id);
  });
}
