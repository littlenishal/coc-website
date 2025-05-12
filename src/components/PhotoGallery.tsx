
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type Photo = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        setPhotos(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPhotos();
  }, []);

  if (isLoading) {
    return (
      <section className="container px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container px-4 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Photo Gallery</h2>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Follow Us</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/gallery">View All</a>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square group">
            <Image
              src={photo.imageUrl}
              alt={photo.title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 rounded-lg">
              <p className="text-white text-sm line-clamp-3">{photo.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
