import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { spaceId, memberId, date, timeSlot } = body;

        if (!spaceId || !memberId || !date || !timeSlot) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Verify Member exists
        const member = await prisma.member.findUnique({ where: { id: memberId } });
        if (!member) {
            return NextResponse.json({ error: 'Socio no encontrado' }, { status: 404 });
        }

        // 2. Check Availability (Prevent race condition optimally with transaction or check)
        // For simplicity: Check then create (Prisma doesn't easily lock rows in simple mode)

        const searchDate = new Date(date);
        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

        const existingBooking = await prisma.booking.findFirst({
            where: {
                spaceId,
                timeSlot,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: 'CONFIRMED'
            }
        });

        if (existingBooking) {
            return NextResponse.json({ error: 'El turno seleccionado ya no está disponible.' }, { status: 409 });
        }

        // 3. Create Booking
        const newBooking = await prisma.booking.create({
            data: {
                spaceId,
                memberId,
                date: new Date(date), // Store exact date
                timeSlot,
                status: 'CONFIRMED',
                createdBy: 'STAFF' // Default to STAFF for now as dashboard is operator facing
            }
        });

        return NextResponse.json(newBooking);

    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: 'Error al crear la reserva.' }, { status: 500 });
    }
}
