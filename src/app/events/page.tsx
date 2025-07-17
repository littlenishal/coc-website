import { Metadata } from 'next';
import { EventList } from '@/components/EventList';

export const metadata: Metadata = {
  title: 'Events | Captains of Commerce Arlington',
  description: 'Join us for community events, fundraisers, and networking opportunities in Arlington County and Northern Virginia.',
  keywords: 'Arlington events, Northern Virginia community events, fundraisers, networking, Arlington County events',
  openGraph: {
    title: 'Events | Captains of Commerce Arlington',
    description: 'Join us for community events, fundraisers, and networking opportunities in Arlington County and Northern Virginia.',
    type: 'website',
  },
};

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Page Header */}
      <section className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">
              Community Events
            </h1>
            <p className="text-lg text-muted-foreground">
              Join us for upcoming events that bring our community together. 
              From fundraisers to networking opportunities, there&apos;s something for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section>
        <EventList />
      </section>
    </main>
  );
}