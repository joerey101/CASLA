import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) { // Auth check can be relaxed if public view is needed
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const spaceId = searchParams.get('spaceId');

    if (!date || !spaceId) {
        return NextResponse.json({ error: 'Date and SpaceId are required' }, { status: 400 });
    }

    try {
        // Find existing bookings for this space and date
        // Note: Dates in DB are usually UTC or local storage. Ideally, handle timezones strictly.
        // For simple day matching, we can check range or simple string match if date is stored as YYYY-MM-DD (but Prisma uses DateTime).
        // Assuming `date` passed is ISO string or YYYY-MM-DD.

        // Construct start and end of day in UTC
        const searchDate = new Date(date);
        const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

        const bookings = await prisma.booking.findMany({
            where: {
                spaceId: spaceId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: 'CONFIRMED'
            },
            select: { timeSlot: true } // Only return booked slots
        });

        const bookedSlots = bookings.map(b => b.timeSlot);

        // Define all possible slots (e.g., 10:00 to 22:00)
        // Ideally this comes from Space configuration or constants
        const allSlots = Array.from({ length: 13 }, (_, i) => `${10 + i}:00`); // 10:00 to 22:00

        const availability = allSlots.map(slot => ({
            time: slot,
            available: !bookedSlots.includes(slot)
        }));

        return NextResponse.json(availability);
    } catch (error) {
        console.error("Error checking availability:", error);
        return NextResponse.json({ error: 'Error al consultar disponibilidad' }, { status: 500 });
    }
}
