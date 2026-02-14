const { PrismaClient } = require('@prisma/client');

async function getPrisma() {
    const dbUrl = process.env.DATABASE_URL || '';

    if (dbUrl.startsWith('postgres')) {
        const { Pool } = require('pg');
        const { PrismaPg } = require('@prisma/adapter-pg');
        const pool = new Pool({
            connectionString: dbUrl,
            ssl: { rejectUnauthorized: false }
        });
        const adapter = new PrismaPg(pool);
        return new PrismaClient({ adapter });
    } else {
        const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
        const { resolve } = require('path');
        let sqliteUrl = dbUrl || 'file:./dev.db';
        if (sqliteUrl.startsWith('file:./') || sqliteUrl.startsWith('file:dev.db')) {
            const dbPath = sqliteUrl.replace('file:', '');
            const absolutePath = resolve(process.cwd(), dbPath);
            sqliteUrl = `file:${absolutePath}`;
        }
        const adapter = new PrismaBetterSqlite3({ url: sqliteUrl });
        return new PrismaClient({ adapter });
    }
}

async function main() {
    const prisma = await getPrisma();
    console.log('🌱 Seeding database...');

    try {
        // Clear some data to avoid duplicates if re-running
        // (Be careful with deleteMany in production, but okay for this demo seed)
        // await prisma.member.deleteMany(); 

        // 1. Create/update test member "Mariano"
        const mariano = await prisma.member.upsert({
            where: { dni: '33000000' },
            update: {},
            create: {
                dni: '33000000',
                memberNumber: '85001',
                fullName: 'Mariano Pérez',
                email: 'mariano@gmail.com',
                phone: '+5491155001234',
                category: 'Activo Pleno',
                status: 'ACTIVO - AL DÍA',
                seniority: '8 años',
                avatarUrl: '/images/avatar_male_casla.png',
                seatLocation: 'Platea Norte Baja',
                sector: 'Sector C - Fila 12',
                gate: 'Puerta 4',
                accessPoint: 'Av. La Plata',
                password: 'socio123',
            },
        });
        console.log(`✅ Member created: ${mariano.fullName}`);

        // Checking if events already exist to avoid multi-seed errors
        const eventCount = await prisma.event.count();
        if (eventCount === 0) {
            const events = await Promise.all([
                prisma.event.create({
                    data: {
                        title: 'Abono 2026',
                        description: 'Torneo Liga Profesional 2026 - Comprá tu abono y asegurá tu lugar',
                        category: 'FUTBOL',
                        type: 'ABONO',
                        date: new Date('2026-03-01'),
                        location: 'Estadio Pedro Bidegain',
                        imageUrl: '/images/estadio.jpg',
                        sectors: JSON.stringify(['Popular Local', 'Popular Visitante', 'Platea Norte', 'Platea Sur', 'Platea Preferencial']),
                        payPlans: JSON.stringify(['1 pago', '3 cuotas sin interés', '6 cuotas sin interés']),
                        maxPerUser: 4,
                        price: 250000,
                    },
                }),
                prisma.event.create({
                    data: {
                        title: 'San Lorenzo vs Estudiantes de Rio Cuarto',
                        description: 'Liga Profesional de Fútbol - Fecha 5',
                        category: 'FUTBOL',
                        type: 'MATCH',
                        date: new Date('2026-02-19'),
                        location: 'Estadio Pedro Bidegain',
                        imageUrl: '/images/match-estudiantes.jpg',
                        sectors: JSON.stringify(['Popular Local', 'Platea Norte', 'Platea Sur']),
                        payPlans: JSON.stringify(['1 pago']),
                        maxPerUser: 6,
                        price: 15000,
                    },
                }),
                prisma.event.create({
                    data: {
                        title: 'San Lorenzo vs Racing Club',
                        description: 'Liga Profesional de Fútbol - Fecha 8',
                        category: 'FUTBOL',
                        type: 'MATCH',
                        date: new Date('2026-03-12'),
                        location: 'Estadio Pedro Bidegain',
                        imageUrl: '/images/match-racing.jpg',
                        sectors: JSON.stringify(['Popular Local', 'Platea Norte', 'Platea Sur']),
                        payPlans: JSON.stringify(['1 pago']),
                        maxPerUser: 6,
                        price: 20000,
                    },
                }),
            ]);
            console.log(`✅ ${events.length} events created`);
        } else {
            console.log('⏩ Events skip, already exist');
        }

        // Family members
        const familyCount = await prisma.familyMember.count({ where: { memberId: mariano.id } });
        if (familyCount === 0) {
            await prisma.familyMember.createMany({
                data: [
                    {
                        memberId: mariano.id,
                        fullName: 'Laura Pérez',
                        relationship: 'Cónyuge',
                        memberNumber: '85002',
                        category: 'Activo Pleno',
                    },
                    {
                        memberId: mariano.id,
                        fullName: 'Tomás Pérez',
                        relationship: 'Hijo',
                        memberNumber: '85003',
                        category: 'Cadete',
                    },
                ]
            });
            console.log(`✅ Family members created`);
        }

        // Payments
        const paymentCount = await prisma.payment.count({ where: { memberId: mariano.id } });
        if (paymentCount === 0) {
            await prisma.payment.createMany({
                data: [
                    {
                        memberId: mariano.id,
                        amount: 25000,
                        concept: 'Cuota Enero 2026',
                        status: 'COMPLETED',
                        createdAt: new Date('2026-01-05'),
                    },
                    {
                        memberId: mariano.id,
                        amount: 25000,
                        concept: 'Cuota Febrero 2026',
                        status: 'COMPLETED',
                        createdAt: new Date('2026-02-05'),
                    }
                ]
            });
            console.log(`✅ Payment history created`);
        }

        console.log('\n🎉 Seed completed!');
    } catch (e) {
        console.error('❌ Seed error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
