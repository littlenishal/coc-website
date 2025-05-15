
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type Params = {
  [key: string]: string;
};

export async function GET(
  request: NextRequest,
  { params }
) {
  try {
    const { id } = params;
    
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
