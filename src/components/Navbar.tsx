"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";

const navLinks = [
  { href: "/projections", label: "Projections", comingSoon: true },
  { href: "/tournaments", label: "Tournaments" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog", comingSoon: true },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-600 bg-surface-900/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple">
              <TrendingUp className="h-5 w-5 text-brand-green" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-brand-green transition-colors">
              Tennis<span className="text-brand-green group-hover:text-white transition-colors">Forecast</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.comingSoon ? "#" : link.href}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  link.comingSoon
                    ? "text-zinc-500 cursor-default"
                    : "text-zinc-300 hover:text-white hover:bg-surface-800"
                }`}
              >
                {link.label}
                {link.comingSoon && (
                  <span className="ml-1.5 text-[10px] font-semibold text-purple-400 uppercase">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="#signup"
              className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-brand-green text-surface-950 hover:bg-green-400 transition-colors"
            >
              Join Newsletter
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-surface-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-600 bg-surface-900">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.comingSoon ? "#" : link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  link.comingSoon
                    ? "text-zinc-500"
                    : "text-zinc-300 hover:text-white hover:bg-surface-800"
                }`}
              >
                {link.label}
                {link.comingSoon && (
                  <span className="ml-1.5 text-[10px] font-semibold text-purple-400 uppercase">
                    Soon
                  </span>
                )}
              </Link>
            ))}
            <Link
              href="#signup"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 text-sm font-semibold text-brand-green hover:text-green-400 transition-colors"
            >
              Join Newsletter
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
