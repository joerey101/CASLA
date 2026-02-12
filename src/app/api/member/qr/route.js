import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';
import crypto from 'crypto';

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        let member = await prisma.member.findFirst();

        if (!member) {
            // Mock dynamic QR logic
            const newToken = crypto.randomBytes(32).toString('hex');
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
            return NextResponse.json({ token: newToken, expiresAt: expiresAt });
        }

        const now = new Date();
        if (member.qrToken && member.qrExpiresAt && member.qrExpiresAt > now) {
            return NextResponse.json({ token: member.qrToken, expiresAt: member.qrExpiresAt });
        }

        const newToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

        const updatedMember = await prisma.member.update({
            where: { id: member.id },
            data: {
                qrToken: newToken,
                qrExpiresAt: expiresAt
            }
        });

        return NextResponse.json({ token: updatedMember.qrToken, expiresAt: updatedMember.qrExpiresAt });
    } catch (error) {
        console.error("DB Error in QR, falling back to mock logic", error);
        const newToken = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        return NextResponse.json({ token: newToken, expiresAt: expiresAt });
    }
}
