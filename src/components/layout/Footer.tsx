import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organization Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h3 className="text-xl font-semibold">Captains of Commerce Arlington</h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Building stronger communities through business leadership, networking, and philanthropic initiatives. 
              Join us in making a positive impact in Arlington and beyond.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" size="sm" className="text-gray-900 bg-white border-white hover:bg-gray-100 hover:text-gray-900" asChild>
                <Link href="/events">View Our Events</Link>
              </Button>
              <Button variant="outline" size="sm" className="text-gray-900 bg-white border-white hover:bg-gray-100 hover:text-gray-900" asChild>
                <a href="mailto:info@captainsofcommerce.org">Contact Us</a>
              </Button>
            </div>
          </div>

          {/* Contact Info & Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary" />
                <a 
                  href="mailto:info@captainsofcommerce.org" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  info@captainsofcommerce.org
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary" />
                <a 
                  href="tel:+1-703-555-0123" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  (703) 555-0123
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-gray-300">
                  Arlington, Virginia 22201
                </span>
              </div>
            </div>

            <h5 className="text-md font-medium mb-3">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Events Calendar
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:info@captainsofcommerce.org?subject=General Inquiry" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  General Inquiries
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@captainsofcommerce.org?subject=Event Information" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Event Information
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <a
                href="https://facebook.com/captainsofcommercearlington"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/captainsarlington"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/captainsofcommercearlington"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            <div className="text-gray-400 text-sm text-center md:text-right">
              <p>&copy; {currentYear} Captains of Commerce Arlington. All rights reserved.</p>
              <p className="mt-1">A 501(c)(3) non-profit organization</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}