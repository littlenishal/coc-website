
import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

import { AfterCallbackAppRoute } from '@auth0/nextjs-auth0';

const afterCallback: AfterCallbackAppRoute = async (_req, session) => {
  if (!session?.user) return session;

  const { sub, email, given_name, family_name } = session.user;

  // First check if user exists with this email
  const existingUser = await prisma.user.findUnique({
    where: { email: email || '' }
  });

  if (existingUser) {
    // Update existing user with Auth0 ID if needed
    await prisma.user.update({
      where: { email: email || '' },
      data: {
        id: sub,
        updatedAt: new Date(),
        firstName: given_name || existingUser.firstName,
        lastName: family_name || existingUser.lastName,
      }
    });
  } else {
    // Create new user if no email conflict
    await prisma.user.create({
      data: {
        id: sub,
        email: email || '',
        firstName: given_name || '',
        lastName: family_name || '',
        role: 'DONOR',
        password: '', // Required by schema but not needed for OAuth
      }
    });
  }

  return session;
};

export const GET = handleAuth({
  callback: handleCallback({
    afterCallback
  })
});

export const POST = handleAuth();
export const PUT = handleAuth();
export const DELETE = handleAuth();
