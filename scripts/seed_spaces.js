require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false } // Matches app config for Neon
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const spaces = [
    { name: 'Quincho 1', category: 'QUINCHO', capacity: 20, price: 50000 },
    { name: 'Quincho 2', category: 'QUINCHO', capacity: 20, price: 50000 },
    { name: 'Cancha Tenis A', category: 'TENIS', capacity: 4, price: 12000 },
    { name: 'Cancha Tenis B', category: 'TENIS', capacity: 4, price: 12000 },
    { name: 'Pileta Libre', category: 'PILETA', capacity: 50, price: 5000 },
    { name: 'Cancha Futbol 5', category: 'FUTBOL', capacity: 10, price: 25000 },
];

async function seedSpaces() {
    console.log("🌱 Seeding Spaces...");

    for (const space of spaces) {
        const existing = await prisma.space.findFirst({
            where: { name: space.name }
        });

        if (!existing) {
            await prisma.space.create({
                data: space
            });
            console.log(`✅ Created: ${space.name}`);
        } else {
            console.log(`ℹ️ Skipped: ${space.name} (exists)`);
        }
    }
    console.log("🏁 Spaces Seeded.");
}

seedSpaces()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
