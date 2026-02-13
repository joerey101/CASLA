import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import prisma from '@/lib/db';

// GET /api/events/[id] — Get single event detail
export async function GET(req, { params }) {
    try {
        const { id } = await params;

        if (!prisma) {
            return NextResponse.json({ error: 'DB not available' }, { status: 503 });
        }

        const event = await prisma.event.findUnique({
            where: { id },
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        return NextResponse.json({
            ...event,
            sectors: event.sectors ? JSON.parse(event.sectors) : [],
            payPlans: event.payPlans ? JSON.parse(event.payPlans) : [],
        });
    } catch (error) {
        console.error("Event detail API error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
