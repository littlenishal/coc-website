import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define the params type using the native Next.js expected format
type EventParams = { params: { id: string } };

export async function GET(
  _: NextRequest,
  context: EventParams
) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Missing ID parameter' },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: {
        id
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}