import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import prisma from '@/lib/db';

// GET /api/events — List events, optionally filtered by category
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const where = { isActive: true };
        if (category) {
            where.category = category;
        }

        if (!prisma) {
            // Fallback mock data
            return NextResponse.json(getMockEvents(category));
        }

        const events = await prisma.event.findMany({
            where,
            orderBy: { date: 'asc' },
        });

        // Parse JSON fields
        const parsed = events.map(e => ({
            ...e,
            sectors: e.sectors ? JSON.parse(e.sectors) : [],
            payPlans: e.payPlans ? JSON.parse(e.payPlans) : [],
        }));

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("Events API error:", error);
        return NextResponse.json(getMockEvents(), { status: 200 });
    }
}

function getMockEvents(category) {
    const allEvents = [
        {
            id: 'evt1', title: 'Abono 2026', description: 'Torneo Liga Profesional 2026',
            category: 'FUTBOL', type: 'ABONO', date: '2026-03-01',
            location: 'Estadio Pedro Bidegain', imageUrl: '/images/estadio.jpg',
            sectors: ['Popular Local', 'Platea Norte', 'Platea Sur'],
            payPlans: ['1 pago', '3 cuotas', '6 cuotas'], maxPerUser: 4, price: 250000,
        },
        {
            id: 'evt2', title: 'San Lorenzo vs Estudiantes de Rio Cuarto',
            description: 'Liga Profesional de Fútbol - Fecha 5',
            category: 'FUTBOL', type: 'MATCH', date: '2026-02-19',
            location: 'Estadio Pedro Bidegain', imageUrl: '/images/match.jpg',
            sectors: ['Popular Local', 'Platea Norte'], payPlans: ['1 pago'], maxPerUser: 6, price: 15000,
        },
        {
            id: 'evt3', title: 'Renovación Temporada Pando 2026',
            description: 'Renová tu abono para el polideportivo Pando',
            category: 'POLIDEPORTIVO', type: 'ABONO', date: '2026-03-01',
            location: 'Polideportivo Pando', imageUrl: '/images/pando.jpg',
            sectors: ['Pileta', 'Gimnasio', 'Canchas'],
            payPlans: ['1 pago', '3 cuotas', '6 cuotas'], maxPerUser: 4, price: 180000,
        },
        {
            id: 'evt4', title: 'Colonia Verano 2026', description: 'Colonia Verano 2026',
            category: 'CIUDAD_DEPORTIVA', type: 'COLONIA', date: '2026-01-15',
            location: 'Ciudad Deportiva', imageUrl: '/images/colonia.jpg',
            sectors: ['Turno Mañana', 'Turno Tarde'], payPlans: ['1 pago', '3 cuotas'], maxPerUser: 4, price: 150000,
        },
    ];
    if (category) return allEvents.filter(e => e.category === category);
    return allEvents;
}
