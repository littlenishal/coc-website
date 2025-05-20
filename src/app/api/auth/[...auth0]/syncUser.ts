
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

    if (!session?.user) {
      return response;
    }

    const { sub, email, given_name, family_name } = session.user;

    await prisma.user.upsert({
      where: { id: sub },
      update: {
        email: email || '',
        updatedAt: new Date(),
      },
      create: {
        id: sub,
        email: email || '',
        firstName: given_name || '',
        lastName: family_name || '',
        role: 'DONOR',
        password: '', // Required by schema but not needed for OAuth
      },
    });

    return response;
  } catch (error) {
    console.error('Error in syncUser:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
