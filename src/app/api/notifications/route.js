import { NextResponse } from 'next/server';
export const dynamic = "force-dynamic";
import prisma from '@/lib/db';

// GET /api/notifications — List notifications for a member
// PATCH /api/notifications — Mark notification as read
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const memberId = searchParams.get('memberId');
        const unread = searchParams.get('unread');
        const search = searchParams.get('search');

        if (!prisma || !memberId) {
            return NextResponse.json({ notifications: [], unreadCount: 0 });
        }

        const where = { memberId };
        if (unread === 'true') where.isRead = false;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { body: { contains: search } },
            ];
        }

        const [notifications, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.notification.count({
                where: { memberId, isRead: false },
            }),
        ]);

        return NextResponse.json({ notifications, unreadCount });
    } catch (error) {
        console.error("Notifications GET error:", error);
        return NextResponse.json({ notifications: [], unreadCount: 0 });
    }
}

export async function PATCH(req) {
    try {
        const body = await req.json();
        const { id } = body;

        if (!prisma || !id) {
            return NextResponse.json({ error: 'Missing id' }, { status: 400 });
        }

        const notification = await prisma.notification.update({
            where: { id },
            data: { isRead: true },
        });

        return NextResponse.json(notification);
    } catch (error) {
        console.error("Notifications PATCH error:", error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
