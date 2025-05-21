import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';
import { checkRole } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import { validateEvent } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimit = await checkRateLimit();
    if (rateLimit) return rateLimit;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const events = await prisma.event.findMany({
      where: {
        ...(type && { eventType: type }),
        ...(startDate && { startDateTime: { gte: new Date(startDate) } }),
        ...(endDate && { endDateTime: { lte: new Date(endDate) } }),
        isPublished: true,
      },
      orderBy: { startDateTime: 'asc' },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      take: 50, // Limit results for performance
    });

    return NextResponse.json(events, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimit = await checkRateLimit();
    if (rateLimit) return rateLimit;

    const session = await getSession();
    if (!session?.user || !checkRole(session.user, ['ADMIN', 'STAFF'])) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const validationError = validateEvent(data);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        startDateTime: new Date(data.startDate),
        endDateTime: data.endDate ? new Date(data.endDate) : null,
        location: data.location,
        eventType: data.type,
        maxAttendees: data.capacity ? parseInt(data.capacity.toString()) : null,
        isPublished: data.isPublished ?? false,
        creatorId: session.user.sub
      }
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}