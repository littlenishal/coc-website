import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { EventType } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';
import { checkRole } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user || !checkRole(session.user, ['ADMIN', 'STAFF'])) {
      return NextResponse.json(
        { error: 'Unauthorized - Requires ADMIN or STAFF role' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!data.startDateTime || !data.endDateTime || !data.location?.trim()) {
      return NextResponse.json(
        { error: 'Start date, end date and location are required' },
        { status: 400 }
      );
    }

    const startDate = new Date(data.startDateTime);
    const endDate = new Date(data.endDateTime);
    const now = new Date();

    // Validate dates
    if (startDate < now) {
      return NextResponse.json(
        { error: 'Event must start in the future' },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || '',
        eventType: data.eventType || 'OTHER',
        startDateTime: startDate,
        endDateTime: endDate,
        location: data.location,
        address: data.address || '',
        createdById: session.user.sub,
        isPublished: false
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest
) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const eventType = searchParams.get('type') as EventType | null;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build filter conditions
    const where = {
      ...(eventType && { eventType }),
      ...(startDate && { startDateTime: { gte: new Date(startDate) } }),
      ...(endDate && { endDateTime: { lte: new Date(endDate) } }),
      isPublished: true, // Only show published events by default
    };

    const events = await prisma.event.findMany({
      where,
      include: {
        creator: {
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