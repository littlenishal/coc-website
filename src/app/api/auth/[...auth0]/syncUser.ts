
import { handleProfile } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function syncUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    await handleProfile(req, res, {
      afterCallback: async (_, session) => {
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
      },
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Failed to sync user' });
  }
}
