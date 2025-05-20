
import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

import { AfterCallbackAppRoute } from '@auth0/nextjs-auth0';

const afterCallback: AfterCallbackAppRoute = async (_req, session) => {
  if (!session?.user) return session;

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
