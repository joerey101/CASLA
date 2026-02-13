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

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get('id') || session.user?.memberId;

    if (!prisma) {
        // DB not available — return mock data
        const mockData = require('@/lib/mockDb.json');
        return NextResponse.json(mockData.members[0]);
    }

    try {
        let member = null;

        // Try to find by ID first (most precise)
        if (memberId) {
            member = await prisma.member.findUnique({
                where: { id: memberId },
            });
        }

        // If not found by ID, try by email
        if (!member && session.user?.email) {
            member = await prisma.member.findFirst({
                where: { email: session.user.email },
            });
        }

        if (!member) {
            const mockData = require('@/lib/mockDb.json');
            return NextResponse.json(mockData.members[0]);
        }

        return NextResponse.json(member);
    } catch (error) {
        console.error("DB Error, falling back to mock", error);
        const mockData = require('@/lib/mockDb.json');
        return NextResponse.json(mockData.members[0]);
    }
}
