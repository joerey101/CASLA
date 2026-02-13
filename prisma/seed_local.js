process.env.DATABASE_URL = 'file:dev.db';
const { PrismaClient } = require('@prisma/client');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');

const adapter = new PrismaBetterSqlite3({
    url: 'file:dev.db'
});
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Start seeding local...');

    // Create Admin User
    await prisma.user.upsert({
        where: { email: 'admin@casla.com.ar' },
        update: {},
        create: {
            email: 'admin@casla.com.ar',
            password: 'CaslaAdmin',
            role: 'ADMIN',
            name: 'Administrador General',
        },
    });

    // Create One Member
    await prisma.member.upsert({
        where: { memberNumber: '90123' },
        update: {},
        create: {
            dni: "32456789",
            memberNumber: "90123",
            fullName: "Juan Carlos Cuervo",
            category: "Activo Pleno",
            status: "ACTIVO - AL DÍA",
            seniority: "12 años",
            qrToken: "initial-token-123",
        }
    });

    console.log('Seeding finished.');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
