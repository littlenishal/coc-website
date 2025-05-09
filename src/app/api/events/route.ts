
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // First get all events to check what we have
    const allEvents = await prisma.event.findMany();
    console.log('All events:', allEvents);
    
    const events = await prisma.event.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        startDateTime: 'asc',
      },
    });
    
    console.log('Filtered events:', events);
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
