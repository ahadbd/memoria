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
