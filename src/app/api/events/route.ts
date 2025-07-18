import { NextRequest, NextResponse } from 'next/server';
import { EventType } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as EventType | null;
    const status = searchParams.get('status');

    const whereClause: {
      isPublished: boolean;
      eventType?: EventType;
      startDateTime?: {
        gte: Date;
      };
    } = {
      isPublished: true,
    };

    if (type && Object.values(EventType).includes(type)) {
      whereClause.eventType = type;
    }

    if (status === 'upcoming') {
      whereClause.startDateTime = {
        gte: new Date(),
      };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: {
        startDateTime: 'asc',
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}