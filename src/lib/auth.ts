
import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);
  return session?.user;
};

interface User {
  'https://captainsofcommerce.org/roles'?: string[];
}

export const checkRole = (user: User | null | undefined, roles: string[]): boolean => {
  return !!user?.['https://captainsofcommerce.org/roles']?.some((role: string) => roles.includes(role));
};
