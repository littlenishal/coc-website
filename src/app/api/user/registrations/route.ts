
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';

    // Build filter conditions
    const whereClause: any = {
      userId: session.user.sub
    };

    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    if (upcoming) {
      whereClause.event = {
        startDateTime: {
          gte: new Date()
        }
      };
    }

    // Get user's registrations with event details
    const registrations = await prisma.eventRegistration.findMany({
      where: whereClause,
      include: {
        event: {
          select: {
            id: true,
            title: true,
            description: true,
            startDateTime: true,
            endDateTime: true,
            location: true,
            address: true,
            imageUrl: true,
            eventType: true,
            maxAttendees: true
          }
        }
      },
      orderBy: [
        { event: { startDateTime: 'asc' } },
        { registeredAt: 'desc' }
      ]
    });

    return NextResponse.json({
      registrations,
      count: registrations.length
    });
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
