
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
  title: "Captains of Commerce",
  description: "Providing compassionate and comprehensive support to individuals and families in need within Arlington County and the greater Northern Virginia area.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geist.className} flex min-h-full flex-col antialiased`}>
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
