
import { PrismaClient, UserRole, EventType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: 'admin@captainsofcommerce.org',
      password: await bcrypt.hash('admin123', 10),
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
    },
  });

  // Create sample event
  const event = await prisma.event.create({
    data: {
      title: 'Holiday Toy Drive 2024',
      description: 'Annual holiday toy drive for children in Arlington County',
      eventType: EventType.TOY_DRIVE,
      startDateTime: new Date('2024-12-15T10:00:00Z'),
      endDateTime: new Date('2024-12-15T16:00:00Z'),
      location: 'Arlington Community Center',
      address: '123 Main St, Arlington, VA 22201',
      isPublished: true,
      createdById: admin.id,
    },
  });

  console.log({ admin, event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
