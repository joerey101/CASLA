import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import prisma from '@/lib/db';

// GET /api/family — List family members for a member
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('memberId');

        if (!prisma || !memberId) {
            return NextResponse.json([]);
        }

        const familyMembers = await prisma.familyMember.findMany({
            where: { memberId },
            orderBy: { fullName: 'asc' },
        });

        return NextResponse.json(familyMembers);
    } catch (error) {
        console.error("Family API error:", error);
        return NextResponse.json([]);
    }
}
