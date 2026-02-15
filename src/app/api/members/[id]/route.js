import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function PATCH(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await req.json();

        // White-list of editable fields 
        const allowedFields = [
            'fullName', 'email', 'secondaryEmail', 'phone',
            'alternativePhone', 'addressBilling', 'city', 'zipCode',
            'category', 'status', 'seatLocation', 'sector', 'gate',
            'birthDate', 'taxId', 'dni'
        ];

        const updateData = {};
        allowedFields.forEach(field => {
            if (body[field] !== undefined) {
                // Transform empty strings to null for optional database fields
                let value = body[field] === "" ? null : body[field];

                // Convert birthDate string (YYYY-MM-DD) to Date object for Prisma
                if (field === 'birthDate' && value) {
                    try {
                        value = new Date(value);
                        // Validate date to avoid "Invalid Date" errors
                        if (isNaN(value.getTime())) value = null;
                        else value = value.toISOString();
                    } catch (e) {
                        value = null;
                    }
                }

                updateData[field] = value;
            }
        });

        const updatedMember = await prisma.member.update({
            where: { id },
            data: updateData,
            include: {
                familyMembers: true,
                bookings: {
                    include: { space: true },
                    orderBy: { date: 'desc' }
                }
            }
        });

        return NextResponse.json(updatedMember);
    } catch (error) {
        console.error("Error updating member:", error);
        return NextResponse.json({ error: `Error al actualizar: ${error.message}` }, { status: 500 });
    }
}

export async function GET(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { id } = await params;
        const member = await prisma.member.findUnique({
            where: { id },
            include: {
                familyMembers: true,
                bookings: {
                    include: { space: true },
                    orderBy: { date: 'desc' }
                },
                payments: {
                    orderBy: { createdAt: 'desc' },
                    take: 10
                },
                interactions: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!member) {
            return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 });
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error("Error fetching member:", error);
        return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
    }
}
