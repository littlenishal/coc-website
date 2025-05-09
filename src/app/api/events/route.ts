
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
        endDateTime: {
          gte: new Date(),
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
      take: 4, // Limit to 4 featured events
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
