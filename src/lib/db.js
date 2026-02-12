import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

let prisma;
try {
    prisma = globalForPrisma.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} catch (e) {
    // Prisma 7 may fail during build-time module evaluation — this is expected.
    // API routes have mock-data fallbacks for when prisma is null.
    console.warn('PrismaClient init skipped (build-time):', e.message);
    prisma = null;
}

export { prisma };
export default prisma;
