'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const tools = [
    { name: 'BTW Calculator', url: 'https://btw-calculator.be' },
    { name: 'IBAN Validator', url: 'https://ibanvalidator.be' },
    { name: 'Huurrendement', url: 'https://huurrendementcalculator.be' },
    { name: 'KM Vergoeding', url: 'https://kmvergoeding.be' },
    { name: 'Datum Berekenen', url: 'https://datumberekenen.be' },
    { name: 'Zwangerschap', url: 'https://zwangerschapscalculator.be' },
    { name: 'Kleurcodes', url: 'https://kleurcodes.be' },
    { name: 'Stroom Prijzen', url: 'https://goedkoopstroom.be' },
  ];

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            <span className="font-bold text-gray-800">Buitendrogen.be</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-sky-600 transition">
              Calculator
            </Link>
            <div className="relative group">
              <button className="text-gray-600 hover:text-sky-600 transition flex items-center gap-1">
                Meer Tools
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  {tools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-gray-600 hover:bg-sky-50 hover:text-sky-600"
                    >
                      {tool.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/over-mij" className="text-gray-600 hover:text-sky-600 transition">
              Over Mij
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link href="/" className="block py-2 text-gray-600 hover:text-sky-600">
              Calculator
            </Link>
            <Link href="/over-mij" className="block py-2 text-gray-600 hover:text-sky-600">
              Over Mij
            </Link>
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-400 mb-2">Meer Tools</p>
              {tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-gray-600 hover:text-sky-600"
                >
                  {tool.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
