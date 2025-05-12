
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Captains of Commerce",
    template: "%s | Captains of Commerce"
  },
  description: "Providing compassionate and comprehensive support to individuals and families in need within Arlington County and the greater Northern Virginia area.",
  keywords: ["charity", "nonprofit", "community service", "Arlington", "Virginia", "donations", "volunteering"],
  authors: [{ name: "Captains of Commerce" }],
  creator: "Captains of Commerce",
  metadataBase: new URL('https://captainsofcommerce.org'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Captains of Commerce',
    description: 'Supporting the Arlington County community through charitable initiatives and volunteer work.',
    siteName: 'Captains of Commerce',
    images: ['/hero-background.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Captains of Commerce',
    description: 'Supporting the Arlington County community through charitable initiatives and volunteer work.',
    images: ['/hero-background.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className={`${geist.className} flex min-h-full flex-col antialiased`} suppressHydrationWarning>
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
