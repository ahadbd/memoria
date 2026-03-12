import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log('Success! User count:', userCount);
  } catch (e) {
    console.error('FINAL ERROR LOG:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
