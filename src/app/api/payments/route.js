import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import prisma from '@/lib/db';

// GET /api/payments — List payments for a member
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('memberId');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = parseInt(searchParams.get('offset') || '0');

        if (!prisma) {
            return NextResponse.json({ payments: [], total: 0 });
        }

        const where = {};
        if (memberId) where.memberId = memberId;

        const [payments, total] = await Promise.all([
            prisma.payment.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.payment.count({ where }),
        ]);

        return NextResponse.json({ payments, total });
    } catch (error) {
        console.error("Payments API error:", error);
        return NextResponse.json({ payments: [], total: 0 });
    }
}
