import type { Metadata } from "next";
import {
  BarChart3,
  Cpu,
  Layers,
  Mail,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about TennisForecast's methodology, predictive models, and Monte Carlo tournament simulations.",
};

const methodCards = [
  {
    icon: TrendingUp,
    title: "Proprietary Models",
    description:
      "Player-level projections built on years of professional match data and continuously refined inputs.",
  },
  {
    icon: Cpu,
    title: "Simulation Engine",
    description:
      "Large-scale simulations that generate match and tournament-level probabilities across every round of a draw.",
  },
  {
    icon: Layers,
    title: "Context-Aware",
    description:
      "Models account for surface, match format, and other situational factors that affect outcomes.",
  },
  {
    icon: Target,
    title: "Full-Match Coverage",
    description:
      "Projections span match winners, set scores, totals, props, SGPs, and DFS -- everything in a match, not just the result.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-surface-700">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-surface-950 to-surface-950" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              About TennisForecast
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              We build data-driven models to forecast professional tennis. Our
              goal is to provide the most accurate, transparent, and useful
              projections for fans, bettors, and the broader tennis analytics
              community.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Mission ──────────────────────────────────────────── */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-brand-green text-sm font-medium mb-3">
                <BarChart3 className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Making tennis data accessible
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-4">
                Tennis is one of the most data-rich sports in the world, but
                most of that information is locked behind paywalls or scattered
                across hard-to-use sources. TennisForecast brings it all
                together into clear, actionable projections.
              </p>
              <p className="text-zinc-400 leading-relaxed">
                Whether you&apos;re a casual fan curious about who&apos;s going to win
                the Australian Open, a bettor looking for edges in the market,
                or a sportsbook seeking projection feeds, we aim to be the
                definitive source for tennis forecasting.
              </p>
            </div>

            {/* Stats card */}
            <div className="rounded-xl border border-surface-600 bg-surface-800 p-8">
              <h3 className="text-lg font-semibold text-white mb-6">
                By the Numbers
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "1M+", label: "Simulations per tournament draw" },
                  { value: "17+", label: "Years of historical match data" },
                  { value: "3", label: "Surface-specific Elo ratings" },
                  { value: "ATP & WTA", label: "Both tours covered" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-bold text-brand-green mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-zinc-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Methodology ──────────────────────────────────────── */}
      <section id="methodology" className="py-16 bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Methodology
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              A transparent look at how our models work. No black boxes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {methodCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-surface-600 bg-surface-800 p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-900/50 text-purple-400 mb-4">
                  <card.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-brand-green text-sm font-medium hover:text-green-400 transition-colors"
            >
              Try our tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Contact ──────────────────────────────────────────── */}
      <section id="contact" className="py-16 border-t border-surface-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Get in Touch
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Interested in partnering with us, licensing our projections, or
                just want to chat about tennis analytics? We&apos;d love to hear
                from you.
              </p>
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail className="h-5 w-5 text-purple-400" />
                <a
                  href="mailto:forecasttennis@gmail.com"
                  className="text-sm hover:text-white transition-colors"
                >
                  forecasttennis@gmail.com
                </a>
              </div>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
