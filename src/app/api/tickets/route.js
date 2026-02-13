import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import prisma from '@/lib/db';

// GET /api/tickets — List tickets for logged-in member
// POST /api/tickets — Create a new ticket (purchase)
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('memberId');
        const type = searchParams.get('type'); // ENTRADA or ABONO

        if (!prisma) {
            return NextResponse.json([]);
        }

        const where = {};
        if (memberId) where.memberId = memberId;
        if (type) where.type = type;

        const tickets = await prisma.ticket.findMany({
            where,
            include: { event: true },
            orderBy: { createdAt: 'desc' },
        });

        // Parse event JSON fields
        const parsed = tickets.map(t => ({
            ...t,
            event: t.event ? {
                ...t.event,
                sectors: t.event.sectors ? JSON.parse(t.event.sectors) : [],
                payPlans: t.event.payPlans ? JSON.parse(t.event.payPlans) : [],
            } : null,
        }));

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("Tickets GET error:", error);
        return NextResponse.json([]);
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const { memberId, eventId, type, sector, quantity, payPlan } = body;

        if (!memberId || !eventId || !type || !sector || !quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!prisma) {
            return NextResponse.json({ error: 'DB not available' }, { status: 503 });
        }

        // Check existing tickets for this event/member
        const existing = await prisma.ticket.findFirst({
            where: { memberId, eventId, status: 'ACTIVE' },
        });

        const event = await prisma.event.findUnique({ where: { id: eventId } });
        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        const existingQty = existing ? existing.quantity : 0;
        if (existingQty + quantity > event.maxPerUser) {
            return NextResponse.json({
                error: `Cantidad máxima ${event.maxPerUser}. Ya poseés: ${existingQty}`
            }, { status: 400 });
        }

        const ticket = await prisma.ticket.create({
            data: { memberId, eventId, type, sector, quantity, payPlan, status: 'ACTIVE' },
            include: { event: true },
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error("Tickets POST error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
