
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

export default function Home() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Captains of Commerce</h1>
      <p className="text-xl text-center max-w-2xl mb-8">
        Providing compassionate and comprehensive support to individuals and families in need within Arlington County and the greater Northern Virginia area.
      </p>
      {user ? (
        <div className="flex flex-col items-center gap-4">
          <p>Welcome, {user.name}!</p>
          <Link href="/api/auth/logout" className="bg-red-500 text-white px-4 py-2 rounded">
            Logout
          </Link>
        </div>
      ) : (
        <Link href="/api/auth/login" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </Link>
      )}
    </main>
  );
}
