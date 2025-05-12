
import Link from 'next/link'
import { Button } from "@/components/ui/button"

export function DonationCTA() {
  return (
    <section className="bg-primary py-16 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Make a Difference Today</h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Your donation helps us provide essential support to families in Arlington County. Every contribution makes a real impact in our community.
        </p>
        <Button asChild size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
          <Link href="/donate">Donate Now</Link>
        </Button>
      </div>
    </section>
  )
}
