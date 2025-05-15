
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id }
    });

    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }

    return Response.json(event);
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const event = await prisma.event.update({
      where: { id: params.id },
      data
    });
    return Response.json(event);
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.event.delete({
      where: { id: params.id }
    });
    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
