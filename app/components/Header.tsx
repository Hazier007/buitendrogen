'use client';

import Link from 'next/link';
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-bold text-gray-900 hover:text-gray-700">
          Buitendrogen.be
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-600">
          <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
          <Link href="/cookies" className="hover:text-gray-900">Cookies</Link>
          <Link href="/contact" className="hover:text-gray-900">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
