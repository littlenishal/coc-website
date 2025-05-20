
import { handleProfile } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  ctx: { params: { auth0: string[] } }
) {
  try {
    const response = await handleProfile(req, ctx);
    const session = await response.json();

    if (session?.user) {
      const { sub, email } = session.user;
      
      await prisma.user.upsert({
        where: { id: sub },
        update: {
          email: email || '',
          updatedAt: new Date(),
        },
        create: {
          id: sub,
          email: email || '',
          firstName: session.user.given_name || '',
          lastName: session.user.family_name || '',
          role: 'DONOR',
        },
      });
    }

    return response;
  } catch (error) {
    console.error('Error syncing user:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
