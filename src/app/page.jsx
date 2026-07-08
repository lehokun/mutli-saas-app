'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Alihkan ke halaman login saat komponen pertama kali dimuat
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-white text-sm font-medium animate-pulse">
        Memuat halaman login...
      </p>
    </div>
  );
}