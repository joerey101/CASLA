require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seedDemo() {
    console.log('🌱 Seeding Ficha 360 Demo Data...');

    // 1. Find or Create the main member (Maria Fernandez / 26123123)
    const maria = await prisma.member.upsert({
        where: { dni: '26123123' },
        update: {
            joinedAt: new Date('1986-04-01'),
            secondaryEmail: 'fernandez.maria.personal@gmail.com',
            alternativePhone: '+54 9 11 5555-4444',
            city: 'Boedo, CABA',
            zipCode: '1232',
            seniority: '38 años'
        },
        create: {
            dni: '26123123',
            taxId: '20261231230',
            fullName: 'MARIA FERNANDEZ',
            memberNumber: '91042',
            category: 'Activo Pleno',
            status: 'ACTIVO - AL DÍA',
            joinedAt: new Date('1986-04-01'),
            secondaryEmail: 'fernandez.maria.personal@gmail.com',
            alternativePhone: '+54 9 11 5555-4444',
            city: 'Boedo, CABA',
            zipCode: '1232',
            seniority: '38 años'
        }
    });

    // 2. Add a family member (e.g. Son)
    // First, ensure the son exists as a member too for navigation
    const son = await prisma.member.upsert({
        where: { dni: '45123456' },
        update: {},
        create: {
            dni: '45123456',
            taxId: '20451234560',
            fullName: 'JUAN FERNANDEZ',
            memberNumber: '95001',
            category: 'Cadete',
            status: 'ACTIVO - AL DÍA',
            joinedAt: new Date('2015-01-10'),
            seniority: '9 años'
        }
    });

    // Link them in FamilyMember table
    await prisma.familyMember.deleteMany({ where: { memberId: maria.id } }); // Clear duplicates
    await prisma.familyMember.create({
        data: {
            memberId: maria.id,
            fullName: 'JUAN FERNANDEZ',
            relationship: 'Hijo/a',
            memberNumber: '95001',
            category: 'Cadete'
        }
    });

    console.log('✅ Demo data updated for MARIA FERNANDEZ (26123123).');
    await prisma.$disconnect();
}

seedDemo().catch(e => {
    console.error(e);
    process.exit(1);
});
