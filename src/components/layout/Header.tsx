
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Captains of Commerce</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/events" className="text-sm font-medium">Events</Link>
          <Link href="/gallery" className="text-sm font-medium">Gallery</Link>
          <Link href="/about" className="text-sm font-medium">About</Link>
          <Button asChild variant="default">
            <Link href="/donate">Donate</Link>
          </Button>
        </nav>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <nav className="flex flex-col space-y-4">
              <Link href="/events" className="text-sm font-medium">Events</Link>
              <Link href="/gallery" className="text-sm font-medium">Gallery</Link>
              <Link href="/about" className="text-sm font-medium">About</Link>
              <Button asChild variant="default">
                <Link href="/donate">Donate</Link>
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
