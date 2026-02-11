import Link from "next/link";
import { TrendingUp, Mail, Twitter } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Projections", href: "/projections", comingSoon: true },
    { label: "Tournaments", href: "/tournaments" },
    { label: "Tools", href: "/tools" },
    { label: "Blog", href: "/blog", comingSoon: true },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Methodology", href: "/about#methodology" },
    { label: "Contact", href: "/about#contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-surface-600 bg-surface-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-purple">
                <TrendingUp className="h-5 w-5 text-brand-green" />
              </div>
              <span className="text-xl font-bold text-white">
                Tennis<span className="text-brand-green">Forecast</span>
              </span>
            </Link>
            <p className="text-zinc-400 text-sm max-w-sm mb-6">
              Advanced tennis stats, projections, and analytics. Data-driven
              models powering smarter predictions.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-800 text-zinc-400 hover:text-white hover:bg-surface-700 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="mailto:forecasttennis@gmail.com"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-800 text-zinc-400 hover:text-white hover:bg-surface-700 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-2.5">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.comingSoon ? "#" : link.href}
                    className={`text-sm transition-colors ${
                      link.comingSoon
                        ? "text-zinc-600 cursor-default"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {link.label}
                    {link.comingSoon && (
                      <span className="ml-1 text-[10px] text-purple-500 uppercase">
                        Soon
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-surface-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-zinc-500">
              &copy; {new Date().getFullYear()} TennisForecast. All rights reserved.
            </p>
            <p className="text-xs text-zinc-600">
              For entertainment purposes only. Please gamble responsibly.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
