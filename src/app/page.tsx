
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { FeaturedEvents } from "@/components/FeaturedEvents";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-16">
      <section className="relative w-full h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/hero-background.jpg"
            alt="Volunteers working together"
            fill
            priority
            className="object-cover brightness-50"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Captains of Commerce Arlington
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-[42rem] mx-auto text-gray-200 mb-4">
              Northern Virginia Community Support & Events
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed max-w-[48rem] mx-auto text-gray-300 mb-8">
              Providing compassionate and comprehensive support to individuals and families in need within Arlington County and the greater Northern Virginia area. Join us for community events, fundraisers, and networking opportunities that make a difference.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/events">View Events</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <FeaturedEvents />
    </div>
  );
}
