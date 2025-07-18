import { NextRequest, NextResponse } from 'next/server';
import { EventType } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const events = await prisma.event.findMany({
      where: {
        ...(type && { eventType: type as EventType }),
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
    return NextResponse.json({ 
      message: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Note: In production, you should implement proper authentication
    // For now, this endpoint is open for demonstration purposes

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
        ...(data.endDate && { endDateTime: new Date(data.endDate) }),
        location: data.location,
        eventType: data.type,
        registrationUrl: data.registrationUrl || null,
        isPublished: data.isPublished ?? false,
        // createdById: session.user.sub, // Remove session dependency
        ...(data.imageUrl && { imageUrl: data.imageUrl })
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