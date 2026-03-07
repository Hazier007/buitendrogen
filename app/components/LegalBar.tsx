'use client';

import Link from 'next/link';
export default function LegalBar() {
  const openCookieSettings = () => {
    window.dispatchEvent(new Event('open-cookie-banner'));
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
          <span className="text-gray-300">â€¢</span>
          <Link href="/cookies" className="hover:text-gray-900">Cookies</Link>
          <span className="text-gray-300">â€¢</span>
          <Link href="/disclaimer" className="hover:text-gray-900">Disclaimer</Link>
          <span className="text-gray-300">â€¢</span>
          <Link href="/contact" className="hover:text-gray-900">Contact</Link>
          <span className="text-gray-300">â€¢</span>
          <Link href="/over" className="hover:text-gray-900">Over</Link>
          <span className="text-gray-300">â€¢</span>
          <button type="button" className="hover:text-gray-900" onClick={openCookieSettings}>
            Cookie-instellingen
          </button>
        </div>
        <div className="text-xs text-gray-400">Â© {new Date().getFullYear()} Hazier</div>
      </div>
    </div>
  );
}
