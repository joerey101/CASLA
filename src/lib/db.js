import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

let prisma = globalForPrisma.prisma || null;

if (!prisma) {
    const dbUrl = process.env.DATABASE_URL || '';

    try {
        if (dbUrl.includes('postgres') || dbUrl.includes('postgresql')) {
            // === PRODUCTION: Neon PostgreSQL ===
            const { Pool } = require('pg');
            const { PrismaPg } = require('@prisma/adapter-pg');
            const pool = new Pool({
                connectionString: dbUrl,
                ssl: { rejectUnauthorized: false }
            });
            const adapter = new PrismaPg(pool);
            prisma = new PrismaClient({ adapter });
            console.log('[DB] Connected: PostgreSQL');
        } else if (dbUrl.startsWith('file:') || (dbUrl === '' && process.env.NODE_ENV !== 'production')) {
            // === LOCAL DEV: SQLite ===
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
            console.log('[DB] Connected: SQLite');
        } else {
            // No URL during build/other env: do NOT create an invalid client
            console.warn('[DB] No valid configuration found (missing DATABASE_URL). Prisma disabled for this build step.');
            prisma = null;
        }

        if (prisma) globalForPrisma.prisma = prisma;
    } catch (e) {
        console.warn('[DB] Prisma init warning:', e.message);
        prisma = null;
    }
}

export { prisma };
export default prisma;
