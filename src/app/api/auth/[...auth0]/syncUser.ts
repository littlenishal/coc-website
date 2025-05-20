
import { handleProfile } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { AppRouteHandlerFnContext } from '@auth0/nextjs-auth0/dist/types';

export async function GET(
  req: NextRequest,
  ctx: AppRouteHandlerFnContext
) {
  try {
    return await handleProfile(req, ctx, {
      async afterCallback(_, session) {
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
              role: 'DONOR', // Default role
            },
          });
        }
        return session;
      }
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    throw error;
  }
}
