
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Modify database URL to use connection pooler if in production
const getPrismaClient = () => {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: process.env.NODE_ENV === 'production' 
          ? process.env.DATABASE_URL?.replace('.us-west-2', '-pooler.us-west-2')
          : process.env.DATABASE_URL
      }
    }
  });
  return client;
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
