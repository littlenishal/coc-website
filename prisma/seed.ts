import { PrismaClient, UserRole, EventType } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create or update admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@captainsofcommerce.org" },
    update: {},
    create: {
      email: "admin@captainsofcommerce.org",
      password: await bcrypt.hash("admin123", 10),
      firstName: "Admin",
      lastName: "User",
      role: UserRole.ADMIN,
    },
  });

  // Create sample event
  const event = await prisma.event.create({
    data: {
      title: "Holiday Toy Drive 2024",
      description: "Annual holiday toy drive for children in Arlington County",
      eventType: EventType.TOY_DRIVE,
      startDateTime: new Date("2025-06-15T10:00:00Z"),
      endDateTime: new Date("2025-06-15T16:00:00Z"),
      location: "Arlington Community Center, 123 Main St, Arlington, VA 22201",
      imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
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