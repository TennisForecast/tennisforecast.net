import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  ArrowLeftRight,
  TrendingUp,
  Lock,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Free tennis betting tools: Kelly criterion calculator, odds converter, and more.",
};

const tools = [
  {
    title: "Kelly Criterion Calculator",
    description:
      "Calculate optimal bet sizing using the Kelly criterion. Input market odds and your fair probability to get full, half, and quarter Kelly recommendations.",
    icon: Calculator,
    href: "/tools/kelly-calculator",
    available: true,
  },
  {
    title: "Odds Converter",
    description:
      "Convert between American, decimal, fractional, and implied probability formats instantly. Essential reference for comparing lines across sportsbooks.",
    icon: ArrowLeftRight,
    href: "/tools/odds-converter",
    available: true,
  },
  {
    title: "+EV Bet Finder",
    description:
      "Compare TennisForecast projections against live sportsbook odds to find positive expected value bets across all ATP and WTA matches.",
    icon: TrendingUp,
    href: "#",
    available: false,
  },
];

export default function ToolsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-surface-700">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-surface-950 to-surface-950" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Betting Tools
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Free, open tools to sharpen your tennis betting. From bet sizing
              to odds conversion, everything you need in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => {
              const Card = (
                <div
                  className={`rounded-xl border bg-surface-800 p-6 flex flex-col h-full transition-colors ${
                    tool.available
                      ? "border-surface-600 hover:border-purple-700/50 cursor-pointer"
                      : "border-surface-700 opacity-60"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-lg ${
                        tool.available
                          ? "bg-purple-900/50 text-purple-400"
                          : "bg-surface-700 text-zinc-500"
                      }`}
                    >
                      <tool.icon className="h-5 w-5" />
                    </div>
                    {!tool.available && (
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Lock className="h-3 w-3" />
                        Coming Soon
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-white mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed flex-1">
                    {tool.description}
                  </p>
                  {tool.available && (
                    <div className="mt-4 text-sm font-medium text-brand-green">
                      Open tool &rarr;
                    </div>
                  )}
                </div>
              );

              return tool.available ? (
                <Link key={tool.title} href={tool.href}>
                  {Card}
                </Link>
              ) : (
                <div key={tool.title}>{Card}</div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
