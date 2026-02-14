require('dotenv').config();
const { Pool } = require('pg');
const crypto = require('crypto');

console.log('🌱 Seed Script V7.0 (Native PG) Started');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Helpers
const cuid = () => 'c' + crypto.randomBytes(12).toString('hex');
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Listas de datos
const APELLIDOS = ['García', 'González', 'Rodríguez', 'Fernández', 'López', 'Martínez', 'Pérez', 'Álvarez', 'Gómez', 'Sánchez', 'Díaz', 'Romero', 'Sosa', 'Torres', 'Ruiz', 'Flores', 'Benítez', 'Ramírez', 'Acosta', 'Medina', 'Herrera', 'Silva', 'Moreno'];
const NOMBRES_M = ['Juan', 'José', 'Carlos', 'Jorge', 'Luis', 'Miguel', 'Héctor', 'Ramón', 'Daniel', 'Marcelo', 'Julio', 'Roberto', 'Alejandro', 'Fernando', 'Ricardo', 'Francisco', 'David', 'Pablo', 'Martín', 'Gabriel'];
const NOMBRES_F = ['María', 'Ana', 'Silvia', 'Claudia', 'Patricia', 'Mónica', 'Adriana', 'Gabriela', 'Susana', 'Verónica', 'Natalia', 'Graciela', 'Laura', 'Marta', 'Andrea', 'Cristina', 'Florencia', 'Daniela'];
const CALLES = ['Av. La Plata', 'Av. Boedo', 'San Juan', 'Directorio', 'Pedro Goyena', 'Rivadavia', 'Carabobo', 'Varela', 'Asamblea', 'Cobare', 'Santander', 'Avelino Díaz'];
const BARRIOS = ['Boedo', 'Caballito', 'Almagro', 'Flores', 'Parque Chacabuco', 'San Cristóbal'];
const DOMINIOS_EMAIL = ['gmail.com', 'hotmail.com', 'yahoo.com.ar', 'outlook.com'];

// Generadores
const getDni = () => getRandomInt(20000000, 50000000).toString();
const getPhone = () => `+54911${getRandomInt(3000, 9999)}${getRandomInt(1000, 9999)}`;
const getTaxId = (dni) => `20-${dni}-${getRandomInt(0, 9)}`;

function crearSocioFake(index, apellidoFamiliar = null) {
    const isMale = Math.random() > 0.5;
    const nombre = isMale ? getRandom(NOMBRES_M) : getRandom(NOMBRES_F);
    const apellido = apellidoFamiliar || getRandom(APELLIDOS);
    const fullName = `${nombre} ${apellido}`;
    const dni = getDni();

    return {
        id: cuid(),
        dni,
        memberNumber: (90000 + index).toString(),
        fullName,
        email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${getRandomInt(1, 99)}@${getRandom(DOMINIOS_EMAIL)}`,
        phone: getPhone(),
        taxId: getTaxId(dni),
        alternativePhone: Math.random() > 0.7 ? getPhone() : null,
        addressBilling: `${getRandom(CALLES)} ${getRandomInt(100, 5000)}, ${getRandom(BARRIOS)}, CABA`,
        birthDate: new Date(getRandomInt(1960, 2005), getRandomInt(0, 11), getRandomInt(1, 28)),
        category: Math.random() > 0.8 ? 'Vitalicio' : 'Activo Pleno',
        status: Math.random() > 0.9 ? 'MOROSO' : 'ACTIVO - AL DÍA',
        seniority: `${getRandomInt(1, 30)} años`,
        avatarUrl: isMale ? '/images/avatar_male_casla.png' : '/images/avatar_female_casla.png',
        seatLocation: Math.random() > 0.5 ? 'Platea Norte Baja' : 'Popular Local',
        sector: `Sector ${getRandom(['A', 'B', 'C', 'D'])}`,
        gate: `Puerta ${getRandomInt(1, 12)}`,
        accessPoint: 'Av. La Plata',
        password: 'socios123',
        qrToken: `seed-token-${dni}-${Date.now()}`,
        qrExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

async function main() {
    const client = await pool.connect();

    try {
        console.log('🚀 Conectado a DB vía pg');

        // Upsert Event
        await client.query(`
      INSERT INTO "Event" (id, title, description, category, type, date, location, price, "isActive", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      ON CONFLICT (id) DO NOTHING
    `, ['evt-seed-001', 'San Lorenzo vs. Huracán', 'Clásico de Barrio - Liga 2026', 'FUTBOL', 'MATCH', new Date('2026-03-15T17:00:00Z'), 'Estadio Pedro Bidegain', 15000, true]);

        let totalSocios = 0;

        for (let i = 0; i < 35; i++) {
            const data = crearSocioFake(i);

            // Insert Titular
            try {
                await client.query(`
          INSERT INTO "Member" (
            id, dni, "memberNumber", "fullName", email, phone, "taxId", "alternativePhone", "addressBilling", "birthDate",
            category, status, seniority, "avatarUrl", "seatLocation", sector, gate, "accessPoint",
            password, "qrToken", "qrExpiresAt", "createdAt", "updatedAt"
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18,
            $19, $20, $21, $22, $23
          )
        `, [
                    data.id, data.dni, data.memberNumber, data.fullName, data.email, data.phone, data.taxId, data.alternativePhone, data.addressBilling, data.birthDate,
                    data.category, data.status, data.seniority, data.avatarUrl, data.seatLocation, data.sector, data.gate, data.accessPoint,
                    data.password, data.qrToken, data.qrExpiresAt, data.createdAt, data.updatedAt
                ]);

                console.log(`👤 Creado: ${data.fullName} (${data.dni})`);
                totalSocios++;

                // Interactions
                const interactionsCount = getRandomInt(0, 3);
                for (let k = 0; k < interactionsCount; k++) {
                    await client.query(`
             INSERT INTO "Interaction" (id, "memberId", type, category, subject, notes, outcome, "staffId", "createdAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           `, [cuid(), data.id, getRandom(['CALL', 'EMAIL']), getRandom(['RECLAMO', 'CONSULTA']), 'Interacción Seed', 'Nota auto', 'PENDIENTE', 'seed', new Date()]);
                }

                // Payments
                await client.query(`
            INSERT INTO "Payment" (id, "memberId", amount, concept, status, "createdAt")
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [cuid(), data.id, 25000, 'Cuota Enero 2026', 'COMPLETED', new Date()]);

                // Family
                if (Math.random() > 0.6) {
                    const surname = data.fullName.split(' ')[1];
                    const count = getRandomInt(1, 2);
                    for (let j = 0; j < count; j++) {
                        const famData = crearSocioFake(1000 + totalSocios, surname);
                        famData.category = 'Cadete';

                        await client.query(`
                    INSERT INTO "Member" (
                        id, dni, "memberNumber", "fullName", email, phone, "taxId", "addressBilling",
                        category, status, password, "qrToken", "createdAt", "updatedAt"
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8,
                        $9, $10, $11, $12, NOW(), NOW()
                    )
                 `, [famData.id, famData.dni, famData.memberNumber, famData.fullName, famData.email, famData.phone, famData.taxId, data.addressBilling,
                        famData.category, 'ACTIVO - AL DÍA', 'socios123', famData.qrToken]);

                        // Link Parent -> Child (in FamilyMember table)
                        await client.query(`
                    INSERT INTO "FamilyMember" (id, "memberId", "fullName", relationship, "memberNumber", category)
                    VALUES ($1, $2, $3, $4, $5, $6)
                 `, [cuid(), data.id, famData.fullName, 'Hijo/a', famData.memberNumber, famData.category]);

                        // Link Child -> Parent
                        await client.query(`
                    INSERT INTO "FamilyMember" (id, "memberId", "fullName", relationship, "memberNumber", category)
                    VALUES ($1, $2, $3, $4, $5, $6)
                 `, [cuid(), famData.id, data.fullName, 'Padre/Madre', data.memberNumber, data.category]);

                        console.log(`   ↳ 👶 ${famData.fullName}`);
                        totalSocios++;
                    }
                }

            } catch (err) {
                console.warn('Error inserting:', err.message);
            }
        }

        console.log(`✅ Seed PG Finalizado. Total: ${totalSocios}`);

    } catch (e) {
        console.error(e);
    } finally {
        client.release();
        pool.end();
    }
}

main();
