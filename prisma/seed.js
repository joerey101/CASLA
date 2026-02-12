const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); // Need dotenv to read env vars in seed script

// Prisma 7 with config file might need explicit datasource URL in constructor 
// if schema doesn't have it.
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // --- 1. Clean existing data ---
    // Try-catch blocks to handle potential table missing errors if migration failed
    try { await prisma.accessLog.deleteMany(); } catch (e) { console.log("AccessLog table might not exist"); }
    try { await prisma.member.deleteMany(); } catch (e) { console.log("Member table might not exist"); }
    try { await prisma.user.deleteMany(); } catch (e) { console.log("User table might not exist"); }
    try { await prisma.match.deleteMany(); } catch (e) { console.log("Match table might not exist"); }

    console.log('Cleaned data (if tables existed).');

    // --- 2. Create Users (Auth) ---
    await prisma.user.createMany({
        data: [
            {
                email: 'admin@casla.com.ar',
                password: 'CaslaAdmin',
                role: 'ADMIN',
                name: 'Administrador General',
            },
            {
                email: 'supervisor@casla.com.ar',
                password: 'CaslaSuper',
                role: 'SUPERVISOR',
                name: 'Supervisor Tarde',
            },
            {
                email: 'operador@casla.com.ar',
                password: 'CaslaOper',
                role: 'OPERATOR',
                name: 'Operador Caja 4',
            },
        ],
    });

    console.log(`Created administrative users.`);

    // --- 3. Create Matches ---
    await prisma.match.createMany({
        data: [
            { rival: "Estudiantes (RC)", date: new Date('2026-02-19T21:15:00'), time: "21:15", tournament: "Copa LPF", isLocal: true },
            { rival: "Instituto", date: new Date('2026-02-24T18:00:00'), time: "18:00", tournament: "Copa LPF", isLocal: true },
            { rival: "Independiente", date: new Date('2026-03-07T19:15:00'), time: "19:15", tournament: "Clásico", isLocal: true, isClassic: true },
        ],
    });

    console.log('Created matches.');

    // --- 4. Create Members (Patronymic Data) ---
    const names = ["Juan", "Maria", "Pedro", "Ana", "Luis", "Sofia", "Carlos", "Lucia", "Miguel", "Elena", "Diego", "Valentina", "Javier", "Camila", "Fernando", "Martina", "Roberto", "Julia", "Daniel", "Paula"];
    const lastnames = ["Perez", "Garcia", "Lopez", "Martinez", "Gonzalez", "Rodriguez", "Fernandez", "Torres", "Ramirez", "Flores", "Acosta", "Benitez", "Castro", "Diaz", "Escobar", "Gimenez", "Herrera", "Ibarra", "Juarez", "Luna"];
    const categories = ["Activo Pleno", "Activo Simple", "Cadete", "Infantil", "Vitalicio", "Socio Interior"];

    const membersData = [];

    // Fixed Member for Demo (Juan Carlos Cuervo)
    membersData.push({
        dni: "32456789",
        memberNumber: "90123",
        fullName: "Juan Carlos Cuervo",
        category: "Activo Pleno",
        status: "ACTIVO - AL DÍA",
        seniority: "12 años",
        seatLocation: "Platea Norte Baja",
        sector: "C",
        gate: "4",
        accessPoint: "Av. La Plata",
        qrToken: "initial-token-123",
        qrExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    });

    // Random Members
    for (let i = 0; i < 50; i++) {
        const name = names[Math.floor(Math.random() * names.length)];
        const lastname = lastnames[Math.floor(Math.random() * lastnames.length)];
        const categoria = categories[Math.floor(Math.random() * categories.length)];
        const memberId = 90124 + i;

        membersData.push({
            dni: (30000000 + i).toString(),
            memberNumber: memberId.toString(),
            fullName: `${name} ${lastname}`,
            category: categoria,
            status: Math.random() > 0.1 ? "ACTIVO - AL DÍA" : "MOROSO",
            seniority: `${Math.floor(Math.random() * 20) + 1} años`,
            seatLocation: Math.random() > 0.7 ? "Platea Sur" : "Popular Local",
            sector: "General",
            gate: Math.random() > 0.5 ? "10" : "4",
        });
    }

    for (const m of membersData) {
        await prisma.member.create({ data: m });
    }

    console.log(`Created ${membersData.length} members.`);

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
