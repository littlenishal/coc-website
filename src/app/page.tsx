import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FeaturedEvents } from '@/components/FeaturedEvents';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-16">
      <section className="relative w-full h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/hero-background.jpg"
            alt="Captains of Commerce community event"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl font-bold mb-6">
            Building Stronger Communities Through Commerce
          </h1>
          <p className="text-xl mb-8 leading-relaxed">
            Join Captains of Commerce in supporting local businesses and creating meaningful connections 
            that drive economic growth and community development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/events">View Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <FeaturedEvents />

      <section className="container px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-6">About Captains of Commerce</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          We are dedicated to fostering business growth, community engagement, and economic development 
          through strategic partnerships, events, and initiatives that bring people together.
        </p>
      </section>
    </div>
  );
}