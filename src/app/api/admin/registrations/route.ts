import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { checkRole } from '@/lib/auth';
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

    // Check if user has admin or staff role
    if (!checkRole(session.user, ['ADMIN', 'STAFF'])) {
      return NextResponse.json(
        { error: 'Forbidden - Admin or Staff access required' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter conditions
    const whereClause: any = {};

    if (eventId) {
      whereClause.eventId = eventId;
    }

    if (status && status !== 'all') {
      whereClause.status = status.toUpperCase();
    }

    // Get registrations with pagination
    const [registrations, totalCount] = await Promise.all([
      prisma.eventRegistration.findMany({
        where: whereClause,
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
              title: true,
              startDateTime: true,
              maxAttendees: true
            }
          }
        },
        orderBy: { registeredAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.eventRegistration.count({ where: whereClause })
    ]);

    return NextResponse.json({
      registrations,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error: unknown) {
    console.error('Error fetching admin registrations:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    if (!checkRole(session.user, ['ADMIN'])) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { registrationIds, action, newStatus } = body;

    if (!registrationIds || !Array.isArray(registrationIds) || registrationIds.length === 0) {
      return NextResponse.json(
        { error: 'Registration IDs are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'updateStatus':
        if (!newStatus) {
          return NextResponse.json(
            { error: 'New status is required for status update' },
            { status: 400 }
          );
        }

        result = await prisma.eventRegistration.updateMany({
          where: {
            id: { in: registrationIds }
          },
          data: {
            status: newStatus.toUpperCase()
          }
        });
        break;

      case 'delete':
        result = await prisma.eventRegistration.deleteMany({
          where: {
            id: { in: registrationIds }
          }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `Successfully ${action === 'delete' ? 'deleted' : 'updated'} ${result.count} registrations`,
      affectedCount: result.count
    });
  } catch (error: unknown) {
    console.error('Error in bulk registration operation:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}