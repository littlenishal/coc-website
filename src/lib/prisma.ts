
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const getPrismaClient = () => {
  // For production, use connection pooling
  if (process.env.NODE_ENV === 'production') {
    const url = process.env.DATABASE_URL?.replace(
      'neondb_owner:',
      'neondb_owner:pooler-'
    );
    return new PrismaClient({
      datasources: {
        db: { url }
      }
    });
  }
  
  // For development, use regular connection
  return new PrismaClient();
};

export const prisma = globalForPrisma.prisma ?? getPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
