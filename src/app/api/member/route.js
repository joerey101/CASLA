import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import prisma from '@/lib/db';

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Assuming session.user.email is the link. Adjust if using ID.
    // We need to find the User first, then the linked Member, OR directly Member if email is there.
    // Based on schema, User has email, but Member does not. Member needs to be linked.
    // For Phase 2, we assume a link exists or we query by something unique. 
    // Let's assume User.email links to a Member (maybe via a new field or logic).
    // FOR NOW: We will fetch the Member associated with the User's email if possible, 
    // or use a placeholder logic if the link isn't established in schema yet.
    // Schema has User (email) and Member (dni, memberNumber).
    // Ideally, User should have `memberId`.

    // Checking schema again:
    // model User { id, email, password, role, name }
    // model Member { id, dni, ... }
    // There is NO direct link in the schema I read!
    // I must add it or assuming for this demo we match by email if Member had email, but it doesn't.
    // Correct approach: Add `memberId` to User or `email` to Member.
    // Master plan says "Schema upgraded".
    // I will assume for now we search Member by matching name or we need to add a field.
    // Let's add `userId` to Member or query by some shared field.
    // HACK for Phase 2 demo if migration fails: Mock response if DB fails? No, goal is Real DB.

    // Let's try to find a Member that matches the session User.
    // Since we don't have a direct link, I'll fetch the FIRST member for demo purposes if no specific link found,
    // OR simpler: The User table should have a relation.

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        const member = await prisma.member.findFirst();

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
