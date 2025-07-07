
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { checkRole } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin or staff role
    if (!checkRole(session.user, ['ADMIN', 'STAFF'])) {
      return NextResponse.json(
        { error: 'Forbidden - Admin or Staff access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      eventId, 
      userId, 
      status = 'REGISTERED',
      numberOfGuests = 0,
      specialRequirements,
      notes 
    } = body;

    // Validate required fields
    if (!eventId || !userId) {
      return NextResponse.json(
        { error: 'Event ID and User ID are required' },
        { status: 400 }
      );
    }

    // Validate numberOfGuests
    if (numberOfGuests < 0 || numberOfGuests > 10) {
      return NextResponse.json(
        { error: 'Number of guests must be between 0 and 10' },
        { status: 400 }
      );
    }

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, title: true, maxAttendees: true }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, firstName: true, lastName: true, email: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { 
          error: 'User is already registered for this event',
          details: {
            currentStatus: existingRegistration.status,
            registeredAt: existingRegistration.registeredAt
          }
        },
        { status: 400 }
      );
    }

    // Create manual registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
        status: status.toUpperCase(),
        numberOfGuests,
        specialRequirements: specialRequirements || null,
        notes: notes || null
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        event: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    return NextResponse.json({
      registration,
      message: `Successfully registered ${user.firstName} ${user.lastName} for ${event.title}`
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating manual registration:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
