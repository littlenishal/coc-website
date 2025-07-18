import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Home, Calendar } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found</h2>
          <p className="text-muted-foreground max-w-md">
            Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/events">
              <Calendar className="h-4 w-4 mr-2" />
              View Events
            </Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>
            If you believe this is an error, please{' '}
            <a 
              href="mailto:info@captainsofcommerce.org" 
              className="text-primary hover:underline"
            >
              contact us
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}