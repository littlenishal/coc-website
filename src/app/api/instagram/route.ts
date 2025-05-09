
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const integration = await prisma.instagramIntegration.findFirst({
      where: { isActive: true },
      include: { feed: true }
    });

    if (!integration) {
      return NextResponse.json([]);
    }

    // TODO: Implement Instagram API fetch logic here
    // For now, return mock data
    const mockPosts = Array.from({ length: 6 }, (_, i) => ({
      id: `mock-${i}`,
      mediaUrl: `https://picsum.photos/600/600?random=${i}`,
      caption: 'Sample Instagram post caption',
      timestamp: new Date().toISOString(),
    }));

    return NextResponse.json(mockPosts);
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}
