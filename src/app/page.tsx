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
        <div className="container relative z-10 flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-6 text-center max-w-4xl mx-auto text-white">
            <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl tracking-tight">
              Making a Difference in Northern Virginia
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl leading-relaxed max-w-[42rem] text-gray-200">
              Providing compassionate and comprehensive support to individuals and families in need within Arlington County and the greater Northern Virginia area.
            </p>
            <div className="flex justify-center mt-4">
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