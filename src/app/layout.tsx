import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UserProvider } from '@auth0/nextjs-auth0/client';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://captainsofcommerce.org'),
  title: {
    default: 'Captains of Commerce Arlington',
    template: '%s | Captains of Commerce Arlington',
  },
  description: 'Captains of Commerce Arlington is a community organization focused on networking, fundraising, and local initiatives in Arlington, Virginia.',
  keywords: 'Arlington, community organization, networking, fundraising, events, Virginia, business',
  authors: [{ name: 'Captains of Commerce Arlington' }],
  creator: 'Captains of Commerce Arlington',
  publisher: 'Captains of Commerce Arlington',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://captainsofcommerce.org',
    siteName: 'Captains of Commerce Arlington',
    title: 'Captains of Commerce Arlington',
    description: 'Community organization focused on networking, fundraising, and local initiatives in Arlington, Virginia.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Captains of Commerce Arlington',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Captains of Commerce Arlington',
    description: 'Community organization focused on networking, fundraising, and local initiatives in Arlington, Virginia.',
    creator: '@captainsofcommerce',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${geistSans.className} flex min-h-full flex-col antialiased`} suppressHydrationWarning>
        <UserProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}