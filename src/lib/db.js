import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

let prisma = globalForPrisma.prisma || null;

if (!prisma) {
    const dbUrl = process.env.DATABASE_URL || '';

    try {
        if (dbUrl.startsWith('postgres') || dbUrl.startsWith('postgresql')) {
            // === PRODUCTION: Neon PostgreSQL ===
            // We use the @prisma/adapter-pg which is not a native module
            const { Pool } = require('pg');
            const { PrismaPg } = require('@prisma/adapter-pg');
            const pool = new Pool({ connectionString: dbUrl });
            const adapter = new PrismaPg(pool);
            prisma = new PrismaClient({ adapter });
            console.log('[DB] Connected to PostgreSQL (Production)');
        } else if (dbUrl.startsWith('file:') || (dbUrl === '' && process.env.NODE_ENV !== 'production')) {
            // === LOCAL DEV: SQLite (only if not in production build without URL) ===
            try {
                // We only require better-sqlite3 here so it doesn't break Vercel build
                const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
                const { resolve } = require('path');

                let sqliteUrl = dbUrl || 'file:./dev.db';
                if (sqliteUrl.startsWith('file:./') || sqliteUrl.startsWith('file:dev.db')) {
                    const dbPath = sqliteUrl.replace('file:', '');
                    const absolutePath = resolve(process.cwd(), dbPath);
                    sqliteUrl = `file:${absolutePath}`;
                }

                const adapter = new PrismaBetterSqlite3({ url: sqliteUrl });
                prisma = new PrismaClient({ adapter });
                console.log('[DB] Connected to SQLite (Local):', sqliteUrl);
            } catch (sqError) {
                console.warn('[DB] SQLite adapter load failed (common in Vercel build):', sqError.message);
                prisma = null;
            }
        } else {
            console.warn('[DB] No DATABASE_URL found and not in local dev mode. Prisma disabled.');
            prisma = null;
        }

        if (prisma) globalForPrisma.prisma = prisma;
    } catch (e) {
        console.warn('[DB] PrismaClient init failed:', e.message);
        prisma = null;
    }
}

export { prisma };
export default prisma;
