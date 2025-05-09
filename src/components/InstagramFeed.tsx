
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

type InstagramPost = {
  id: string;
  mediaUrl: string;
  caption: string;
  timestamp: string;
}

export function InstagramFeed() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchInstagramPosts() {
      try {
        const response = await fetch('/api/instagram');
        const data = await response.json();
        setPosts(data.slice(0, 6)); // Show 6 most recent posts
      } catch (error) {
        console.error('Error fetching Instagram posts:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchInstagramPosts();
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
        <h2 className="text-3xl font-bold">Latest Updates</h2>
        <Button variant="outline" asChild>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            Follow Us
          </a>
        </Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square group">
            <Image
              src={post.mediaUrl}
              alt={post.caption}
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-4 rounded-lg">
              <p className="text-white text-sm line-clamp-3">{post.caption}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
