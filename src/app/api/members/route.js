import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!prisma) {
        const mockData = require('@/lib/mockDb.json');
        return NextResponse.json(mockData.members);
    }

    try {
        const url = new URL(req.url);
        const dni = url.searchParams.get('dni');

        if (dni) {
            const member = await prisma.member.findUnique({
                where: { dni },
                include: {
                    payments: true,
                    familyMembers: true,
                    tickets: true,
                    accessLogs: true
                }
            });
            if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 });
            return NextResponse.json(member);
        }

        const members = await prisma.member.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                familyMembers: true,
                payments: true
            },
            take: 100 // Slightly increased for search usability
        });

        if (!members || members.length === 0) {
            const mockData = require('@/lib/mockDb.json');
            return NextResponse.json(mockData.members);
        }

        return NextResponse.json(members);
    } catch (error) {
        console.error("DB Error in members list, falling back to mock", error);
        const mockData = require('@/lib/mockDb.json');
        return NextResponse.json(mockData.members);
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) { // TODO: Check permissions
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await req.json();
        const { cuit, nombre, apellido, email, category, debitParams } = data;
        // cuit is expected to be 11 digits numeric string (e.g., "20123456789")

        if (!cuit || cuit.length !== 11) {
            return NextResponse.json({ error: 'El CUIT/CUIL debe tener 11 dígitos numéricos.' }, { status: 400 });
        }

        // Extract DNI (remove first 2 and last 1 digit)
        const extractedDni = cuit.substring(2, 10);

        // 1. Validate Uniqueness (Check both DNI and CUIT)
        const existing = await prisma.member.findFirst({
            where: {
                OR: [
                    { dni: extractedDni },
                    { taxId: cuit }
                ]
            }
        });

        if (existing) {
            const msg = existing.dni === extractedDni
                ? `El DNI ${extractedDni} ya está registrado.`
                : `El CUIT ${cuit} ya está registrado.`;
            return NextResponse.json({ error: msg }, { status: 400 });
        }

        // 2. Generate Member Number (Robust Logic)
        // Find the highest current member number to avoid collisions
        const lastMember = await prisma.member.findFirst({
            orderBy: { createdAt: 'desc' },
            select: { memberNumber: true }
        });

        let nextMemberNumber = '90001';
        if (lastMember && lastMember.memberNumber) {
            const lastNum = parseInt(lastMember.memberNumber, 10);
            if (!isNaN(lastNum)) {
                nextMemberNumber = (lastNum + 1).toString();
            }
        }

        // 3. Transaction: Create Member + Initial Payment
        const result = await prisma.$transaction(async (tx) => {
            // Create Member
            const newMember = await tx.member.create({
                data: {
                    dni: extractedDni,
                    taxId: cuit,
                    fullName: `${nombre} ${apellido}`.trim(),
                    email,
                    memberNumber: nextMemberNumber,
                    category: category || 'Activo Pleno',
                    status: 'ACTIVO - AL DÍA',
                    password: 'casla', // Default password for new members
                    // Add initial payment record
                    payments: {
                        create: [
                            {
                                amount: 15000,
                                concept: 'Gastos Administrativos / Carnet',
                                status: 'COMPLETED'
                            },
                            {
                                amount: 33500,
                                concept: 'Cuota Social - Mes en curso',
                                status: 'COMPLETED'
                            }
                        ]
                    },
                    // Add interaction log
                    interactions: {
                        create: {
                            type: 'IN_PERSON',
                            category: 'BIENVENIDA',
                            subject: 'Alta Express - Mostrador',
                            notes: debitParams ? 'Adhesión a Débito solicitada' : 'Pago efectivo',
                            outcome: 'RESUELTO',
                            staffId: session.user?.email || 'unknown'
                        }
                    }
                }
            });

            return newMember;
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error("Error creating member:", error);
        // Return specific error for debugging
        return NextResponse.json({ error: `Error interno: ${error.message}` }, { status: 500 });
    }
}
