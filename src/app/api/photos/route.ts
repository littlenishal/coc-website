import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for development
    const mockPhotos = Array.from({ length: 6 }, (_, i) => ({
      id: `photo-${i}`,
      title: `Photo ${i + 1}`,
      description: `Description for photo ${i + 1}. This is a mock description showcasing our community events and activities.`,
      imageUrl: `https://picsum.photos/seed/${i}/600/600`
    }));

    return NextResponse.json(mockPhotos);
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}