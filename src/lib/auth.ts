
import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

export const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession(req, res);
  return session?.user;
};

export const checkRole = (user: any, roles: string[]) => {
  return user && user['https://captainsofcommerce.org/roles'].some((role: string) => roles.includes(role));
};
