import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { Prisma, RegistrationStatus } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.sub;
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const upcoming = searchParams.get('upcoming') === 'true';

    // Build where clause with proper typing
    const whereClause: Prisma.EventRegistrationWhereInput = {
      userId: userId,
      ...(status && { status: status as RegistrationStatus }),
      ...(upcoming && {
        event: {
          startDateTime: {
            gte: new Date()
          }
        }
      })
    };

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
  } catch (error: unknown) {
    console.error('Error fetching user registrations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}