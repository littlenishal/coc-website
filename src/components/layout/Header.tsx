"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { Menu, Calendar, Home } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Events', href: '/events', icon: Calendar },
  ];

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-semibold text-lg text-gray-900 hidden sm:block">
              Captains of Commerce
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className="text-gray-900 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/events" className="text-gray-900 hover:text-blue-600 transition-colors">
              Events
            </Link>
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:info@captainsofcommerce.org">
                Contact Us
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 p-6">
              <Link 
                href="/" 
                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/events" 
                className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Events
              </Link>
            </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}