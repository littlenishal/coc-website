
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventType } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const eventType = searchParams.get('type') as EventType | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const isPublished = searchParams.get('published') === 'true';

    // Build filter conditions
    const where = {
      ...(eventType && { eventType }),
      ...(startDate && { startDateTime: { gte: new Date(startDate) } }),
      ...(endDate && { endDateTime: { lte: new Date(endDate) } }),
      ...(typeof isPublished === 'boolean' && { isPublished }),
    };

    const events = await prisma.event.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startDateTime: 'asc',
      },
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
