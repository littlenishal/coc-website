import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu, LogIn, LogOut } from "lucide-react"
import { useUser } from '@auth0/nextjs-auth0/client'

export function Header() {
  const { user, isLoading } = useUser();
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
          {!isLoading && (
            user ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium">Dashboard</Link>
                <Button asChild variant="ghost">
                  <Link href="/api/auth/logout"><LogOut className="mr-2 h-4 w-4" />Logout</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/api/auth/login"><LogIn className="mr-2 h-4 w-4" />Login</Link>
                </Button>
                <Button asChild variant="default">
                  <Link href="/donate">Donate</Link>
                </Button>
              </>
            )
          )}
        </nav>
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] px-6">
            <SheetHeader className="pt-8 pb-6">
              <SheetTitle className="text-2xl">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-6">
              <Link href="/events" className="text-lg font-medium hover:text-primary transition-colors">Events</Link>
              <Link href="/gallery" className="text-lg font-medium hover:text-primary transition-colors">Gallery</Link>
              <Link href="/about" className="text-lg font-medium hover:text-primary transition-colors">About</Link>
              {!isLoading && (
                user ? (
                  <>
                    <Link href="/dashboard" className="text-lg font-medium hover:text-primary transition-colors">Dashboard</Link>
                    <Button asChild variant="ghost" size="lg" className="mt-4">
                      <Link href="/api/auth/logout" className="flex items-center"><LogOut className="mr-2 h-5 w-5" />Logout</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="ghost" size="lg" className="mt-4">
                      <Link href="/api/auth/login" className="flex items-center"><LogIn className="mr-2 h-5 w-5" />Login</Link>
                    </Button>
                    <Button asChild variant="default" size="lg" className="mt-4">
                      <Link href="/donate">Donate</Link>
                    </Button>
                  </>
                )
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}