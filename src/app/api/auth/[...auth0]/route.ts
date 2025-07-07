import { handleAuth, handleCallback, handleLogin, handleLogout } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';
import { NextRequest } from 'next/server';

const afterCallback = async (req: NextRequest, session: any) => {
  if (!session?.user) return session;

  const { sub, email, given_name, family_name } = session.user;

  try {
    // Check if user exists with this Auth0 ID first
    const existingUserById = await prisma.user.findUnique({
      where: { id: sub }
    });

    if (existingUserById) {
      // Update existing user
      await prisma.user.update({
        where: { id: sub },
        data: {
          email: email || existingUserById.email,
          firstName: given_name || existingUserById.firstName,
          lastName: family_name || existingUserById.lastName,
          updatedAt: new Date(),
        }
      });
    } else {
      // Check if user exists with this email
      const existingUserByEmail = await prisma.user.findUnique({
        where: { email: email || '' }
      });

      if (existingUserByEmail) {
        // Update existing user with Auth0 ID
        await prisma.user.update({
          where: { email: email || '' },
          data: {
            id: sub,
            firstName: given_name || existingUserByEmail.firstName,
            lastName: family_name || existingUserByEmail.lastName,
            updatedAt: new Date(),
          }
        });
      } else {
        // Create new user
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
    }
  } catch (error) {
    console.error('Error syncing user:', error);
    // Don't throw error to prevent callback failure
  }

  return session;
};

export const GET = handleAuth({
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email'
    }
  }),
  callback: handleCallback({
    afterCallback
  }),
  logout: handleLogout({
    returnTo: process.env.AUTH0_BASE_URL
  })
});

export const POST = GET;