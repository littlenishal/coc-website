import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { checkRole } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';
import prisma from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please log in to access this resource' },
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

    const { id: eventId } = await params;

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

    // Get all registrations with user details
    const registrations = await prisma.eventRegistration.findMany({
      where: { eventId },
      select: {
        id: true,
        status: true,
        registeredAt: true,
        updatedAt: true,
        numberOfGuests: true,
        specialRequirements: true,
        notes: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: { registeredAt: 'asc' }
    });

    // Calculate statistics
    const registeredCount = registrations.filter(reg => reg.status === 'REGISTERED').length;
    const waitlistedCount = registrations.filter(reg => reg.status === 'WAITLISTED').length;
    const cancelledCount = registrations.filter(reg => reg.status === 'CANCELLED').length;
    const attendedCount = registrations.filter(reg => reg.status === 'ATTENDED').length;

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        maxAttendees: event.maxAttendees
      },
      registrations,
      statistics: {
        total: registrations.length,
        registered: registeredCount,
        waitlisted: waitlistedCount,
        cancelled: cancelledCount,
        attended: attendedCount,
        spotsRemaining: event.maxAttendees ? event.maxAttendees - registeredCount : null
      }
    });
  } catch (error) {
    console.error('Error fetching event registrations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error - Unable to fetch registrations' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check rate limit
    const rateLimitResponse = await checkRateLimit();
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: eventId } = await params;

    // Simple registration - no additional form fields needed

    // Check if event exists and has capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          where: { status: 'REGISTERED' }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    if (!event.isPublished) {
      return NextResponse.json(
        { error: 'Event is not published' },
        { status: 400 }
      );
    }

    // Check if user is already registered
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.sub
        }
      }
    });

    if (existingRegistration) {
      return NextResponse.json(
        { 
          error: 'Already registered for this event',
          details: {
            currentStatus: existingRegistration.status,
            registeredAt: existingRegistration.registeredAt
          }
        },
        { status: 400 }
      );
    }

    const registeredCount = event.registrations.length;
    const spotsRemaining = event.maxAttendees ? event.maxAttendees - registeredCount : null;

    // Determine registration status based on capacity
    let registrationStatus: 'REGISTERED' | 'WAITLISTED' = 'REGISTERED';

    if (event.maxAttendees && registeredCount >= event.maxAttendees) {
      registrationStatus = 'WAITLISTED';
    }

    // Create registration
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId: session.user.sub,
        status: registrationStatus
      }
    });

    // Enhanced response with detailed information
    const responseData = {
      registration,
      eventDetails: {
        title: event.title,
        maxAttendees: event.maxAttendees,
        currentRegistrations: registeredCount + 1,
        spotsRemaining: spotsRemaining !== null ? Math.max(0, spotsRemaining - 1) : null
      },
      message: registrationStatus === 'WAITLISTED' 
        ? 'Event is full - you have been added to the waitlist'
        : 'Successfully registered for the event'
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error registering for event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id: eventId } = await params;

    // Find registration
    const registration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.sub
        }
      },
      include: {
        event: {
          select: {
            title: true,
            maxAttendees: true,
            registrations: {
              where: { status: 'REGISTERED' },
              select: { id: true }
            }
          }
        }
      }
    });

    if (!registration) {
      return NextResponse.json(
        { 
          error: 'Registration not found',
          details: 'You are not currently registered for this event'
        },
        { status: 404 }
      );
    }

    if (registration.status === 'CANCELLED') {
      return NextResponse.json(
        { 
          error: 'Registration already cancelled',
          details: 'This registration was previously cancelled'
        },
        { status: 400 }
      );
    }

    // Delete registration
    await prisma.eventRegistration.delete({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.sub
        }
      }
    });

    // If this was a registered user and there's a waitlist, promote the next person
    if (registration.status === 'REGISTERED') {
      const nextWaitlisted = await prisma.eventRegistration.findFirst({
        where: {
          eventId,
          status: 'WAITLISTED'
        },
        orderBy: { registeredAt: 'asc' }
      });

      if (nextWaitlisted) {
        await prisma.eventRegistration.update({
          where: { id: nextWaitlisted.id },
          data: { status: 'REGISTERED' }
        });
      }
    }

    return NextResponse.json(
      { 
        message: 'Successfully unregistered from event',
        eventTitle: registration.event.title
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error unregistering from event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}