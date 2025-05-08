
'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-16 py-8 md:py-12">
      <section className="container flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl">
            Making a Difference in Northern Virginia
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Providing compassionate and comprehensive support to individuals and families in need within Arlington County and the greater Northern Virginia area.
          </p>
          <div className="flex gap-4">
            <Button asChild size="lg">
              <Link href="/donate">Make a Donation</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/events">View Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container flex flex-col items-center px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Recent Activities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto w-full">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-square bg-muted rounded-lg" />
          ))}
        </div>
      </section>
    </div>
  );
}
