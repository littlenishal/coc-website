
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Create a default Instagram feed if none exists
    let integration = await prisma.instagramIntegration.findFirst({
      where: { isActive: true },
      include: { feed: true },
    });

    if (!integration) {
      const feed = await prisma.instagramFeed.create({
        data: {
          title: "Our Instagram Feed",
          displayOnHomepage: true,
          integrations: {
            create: {
              accountName: "captainsofcommerce",
              accessToken: "mock-token",
              tokenExpiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
              lastFetchDateTime: new Date(),
              isActive: true
            }
          }
        }
      });
    }

    // Mock data for development
    const mockPosts = Array.from({ length: 6 }, (_, i) => ({
      id: `mock-${i}`,
      mediaUrl: `https://picsum.photos/seed/${i}/600/600`,
      caption: `Helping our community grow stronger together! #CaptainsOfCommerce #Community #Volunteer #Post${i + 1}`,
      timestamp: new Date().toISOString(),
    }));

    return NextResponse.json(mockPosts);
  } catch (error) {
    console.error("Error fetching Instagram posts:", error);
    return NextResponse.json([], { status: 500 });
  }
}
