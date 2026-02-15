import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const spaces = await prisma.space.findMany({
            where: { isActive: true },
            orderBy: { name: 'asc' }
        });
        return NextResponse.json(spaces);
    } catch (error) {
        console.error("Error fetching spaces:", error);
        return NextResponse.json({ error: 'Error al obtener espacios' }, { status: 500 });
    }
}
