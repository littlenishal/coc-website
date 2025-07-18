import { Metadata } from 'next';
import EventsClientPage from './EventsClientPage';

export const metadata: Metadata = {
  title: 'Events | Captains of Commerce Arlington',
  description: 'Discover upcoming community events, networking opportunities, fundraisers, and workshops hosted by Captains of Commerce Arlington. Join us for meaningful connections and local initiatives.',
  keywords: 'Arlington events, community events, networking events, fundraisers, workshops, business events, Virginia events',
  authors: [{ name: 'Captains of Commerce Arlington' }],
  openGraph: {
    title: 'Events | Captains of Commerce Arlington',
    description: 'Discover upcoming community events, networking opportunities, fundraisers, and workshops hosted by Captains of Commerce Arlington.',
    url: 'https://captainsofcommerce.org/events',
    siteName: 'Captains of Commerce Arlington',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Events | Captains of Commerce Arlington',
    description: 'Discover upcoming community events, networking opportunities, fundraisers, and workshops.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://captainsofcommerce.org/events',
  },
};

export default function EventsPage() {
  return <EventsClientPage />;
}