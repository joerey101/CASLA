const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function migrateCuit() {
    console.log("🚀 Iniciando migración de CUITs...");

    try {
        const members = await prisma.member.findMany({
            where: {
                taxId: null
            }
        });

        console.log(`📋 Encontrados ${members.length} socios sin CUIT.`);

        for (const member of members) {
            // Inferir CUIT Genérico: 20-DNI-0 (Solo para legacy)
            // En un caso real se calcularía el dígito verificador, pero para legacy basta con unicidad.
            const simulatedCuit = `20${member.dni}0`;

            // Check if this CUIT already exists (collision check)
            const exists = await prisma.member.findUnique({
                where: { taxId: simulatedCuit }
            });

            if (exists) {
                console.warn(`⚠️ Conflicto CUIT generado para Socio ${member.memberNumber} (${member.dni}). Saltando.`);
                continue;
            }

            await prisma.member.update({
                where: { id: member.id },
                data: { taxId: simulatedCuit }
            });
            console.log(`✅ Actualizado Socio ${member.memberNumber}: TaxID=${simulatedCuit}`);
        }

        console.log("🏁 Migración completada.");

    } catch (error) {
        console.error("❌ Error en migración:", error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateCuit();
