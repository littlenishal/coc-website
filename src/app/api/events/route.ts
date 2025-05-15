import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: { startDateTime: 'asc' },
      where: { isPublished: true }
    });
    return Response.json(events);
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const event = await prisma.event.create({ data });
    return Response.json(event, { status: 201 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}