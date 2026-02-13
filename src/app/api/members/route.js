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
        const members = await prisma.member.findMany();

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
