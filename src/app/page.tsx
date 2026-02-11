import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Trophy,
  Calculator,
  FileText,
  ArrowRight,
  Zap,
  Target,
  Database,
} from "lucide-react";
import { EmailSignup } from "@/components/EmailSignup";

/* ── Mock data for preview ─────────────────────────────────────── */

const featuredMatches = [
  {
    player1: "J. Sinner",
    player2: "C. Alcaraz",
    tournament: "Indian Wells",
    round: "QF",
    surface: "Hard",
    p1Prob: 54.7,
    p1Odds: "-121",
    p2Odds: "+104",
  },
  {
    player1: "N. Djokovic",
    player2: "D. Medvedev",
    tournament: "Indian Wells",
    round: "QF",
    surface: "Hard",
    p1Prob: 48.2,
    p1Odds: "+107",
    p2Odds: "-126",
  },
  {
    player1: "I. Swiatek",
    player2: "A. Sabalenka",
    tournament: "Indian Wells",
    round: "SF",
    surface: "Hard",
    p1Prob: 52.1,
    p1Odds: "-109",
    p2Odds: "-109",
  },
  {
    player1: "T. Fritz",
    player2: "A. Rublev",
    tournament: "Indian Wells",
    round: "QF",
    surface: "Hard",
    p1Prob: 56.3,
    p1Odds: "-129",
    p2Odds: "+110",
  },
];

const features = [
  {
    icon: Target,
    title: "Match Projections",
    description:
      "Full-match projections for every ATP and WTA match -- winners, set scores, totals, props, SGPs, and DFS projections. Everything in a match, all in one place.",
  },
  {
    icon: Trophy,
    title: "Tournament Simulations",
    description:
      "Full-draw Monte Carlo simulations with round-by-round probabilities and most likely matchups.",
  },
  {
    icon: Calculator,
    title: "Betting Tools",
    description:
      "Kelly criterion calculator, odds converter, and +EV bet finder to sharpen your edge.",
  },
  {
    icon: FileText,
    title: "Analysis & Insights",
    description:
      "Deep dives on methodology, tournament previews, and data-driven picks from our models.",
  },
];

/* ── Page component ────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-surface-950 to-surface-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-purple-900)_0%,_transparent_50%)] opacity-40" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-700/50 text-purple-300 text-xs font-medium mb-6">
              <Zap className="h-3 w-3" />
              Data-driven tennis analytics
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-6">
              Smarter Tennis{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-green-400">
                Projections
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mb-10 leading-relaxed">
              Advanced predictive models and Monte Carlo simulations powering
              match-level projections, tournament forecasts, and betting tools
              for every ATP and WTA event.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-brand-green text-surface-950 font-semibold hover:bg-green-400 transition-colors"
              >
                Explore Tools
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-surface-600 text-zinc-300 font-medium hover:bg-surface-800 hover:text-white transition-colors"
              >
                Our Methodology
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { label: "Simulations per draw", value: "1M+" },
              { label: "Years of ATP data", value: "17+" },
              { label: "Surfaces tracked", value: "3" },
              { label: "Updated daily", value: "24/7" },
            ].map((stat) => (
              <div key={stat.label} className="text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-zinc-500 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Projections Preview ─────────────────────── */}
      <section className="py-20 border-t border-surface-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 text-brand-green text-sm font-medium mb-2">
                <BarChart3 className="h-4 w-4" />
                Sample Projections
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Today&apos;s Featured Matches
              </h2>
            </div>
          </div>

          {/* Projections table */}
          <div className="rounded-xl border border-surface-600 bg-surface-800 overflow-hidden">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-surface-700/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <div className="col-span-4">Match</div>
              <div className="col-span-2">Tournament</div>
              <div className="col-span-1">Round</div>
              <div className="col-span-2 text-center">Win Prob</div>
              <div className="col-span-1 text-center">P1 Odds</div>
              <div className="col-span-1 text-center">P2 Odds</div>
              <div className="col-span-1 text-center">Surface</div>
            </div>

            {/* Table rows */}
            {featuredMatches.map((match, i) => (
              <div
                key={i}
                className={`grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 ${
                  i !== featuredMatches.length - 1
                    ? "border-b border-surface-700"
                    : ""
                } hover:bg-surface-700/30 transition-colors`}
              >
                {/* Match */}
                <div className="col-span-4 flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white">
                      {match.player1}
                    </span>
                    <span className="text-xs text-zinc-500">vs</span>
                    <span className="text-sm font-semibold text-white">
                      {match.player2}
                    </span>
                  </div>
                </div>

                {/* Tournament */}
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-zinc-300">{match.tournament}</span>
                </div>

                {/* Round */}
                <div className="col-span-1 flex items-center">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-900/50 text-purple-300">
                    {match.round}
                  </span>
                </div>

                {/* Win probability bar */}
                <div className="col-span-2 flex items-center justify-center">
                  <div className="w-full max-w-[140px]">
                    <div className="flex justify-between text-xs mb-1">
                      <span
                        className={
                          match.p1Prob > 50
                            ? "text-brand-green font-semibold"
                            : "text-zinc-400"
                        }
                      >
                        {match.p1Prob}%
                      </span>
                      <span
                        className={
                          match.p1Prob < 50
                            ? "text-brand-green font-semibold"
                            : "text-zinc-400"
                        }
                      >
                        {(100 - match.p1Prob).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-surface-600 overflow-hidden flex">
                      <div
                        className="h-full bg-brand-green rounded-l-full"
                        style={{ width: `${match.p1Prob}%` }}
                      />
                      <div
                        className="h-full bg-purple-600 rounded-r-full"
                        style={{ width: `${100 - match.p1Prob}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* P1 Odds */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className="text-sm font-mono text-zinc-300">
                    {match.p1Odds}
                  </span>
                </div>

                {/* P2 Odds */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className="text-sm font-mono text-zinc-300">
                    {match.p2Odds}
                  </span>
                </div>

                {/* Surface */}
                <div className="col-span-1 flex items-center justify-center">
                  <span className="text-xs text-zinc-500">{match.surface}</span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-zinc-600 text-center">
            Sample data for demonstration. Live projections coming soon.
          </p>
        </div>
      </section>

      {/* ─── Features ─────────────────────────────────────────── */}
      <section className="py-20 bg-surface-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-2 text-brand-green text-sm font-medium mb-2">
              <Database className="h-4 w-4" />
              What We Offer
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Data-Driven Tennis Intelligence
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-surface-600 bg-surface-800 p-6 hover:border-purple-700/50 transition-colors group"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-900/50 text-purple-400 mb-4 group-hover:bg-purple-800/50 group-hover:text-purple-300 transition-colors">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Tournament Spotlight ─────────────────────────────── */}
      <section className="py-20 border-t border-surface-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-surface-600 bg-gradient-to-br from-surface-800 to-purple-950/30 p-8 sm:p-12 flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-purple-400 text-sm font-medium mb-3">
                <Trophy className="h-4 w-4" />
                Tournament Spotlight
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Indian Wells 2026
              </h2>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Full-draw simulations for the BNP Paribas Open. Round-by-round
                win probabilities, most likely matchups, and quarter analysis
                from 1 million Monte Carlo simulations.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-900/50 border border-purple-700/50 text-purple-300 text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                Coming Soon
              </div>
            </div>

            {/* Mini leaderboard */}
            <div className="w-full lg:w-80 rounded-xl border border-surface-600 bg-surface-900/80 overflow-hidden">
              <div className="px-5 py-3 bg-surface-700/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Title Favorites
              </div>
              {[
                { name: "J. Sinner", prob: "18.4%" },
                { name: "C. Alcaraz", prob: "16.2%" },
                { name: "N. Djokovic", prob: "11.8%" },
                { name: "A. Zverev", prob: "8.5%" },
                { name: "D. Medvedev", prob: "6.1%" },
              ].map((player, i) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between px-5 py-3 ${
                    i !== 4 ? "border-b border-surface-700" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-zinc-600 w-4">
                      {i + 1}
                    </span>
                    <span className="text-sm text-white font-medium">
                      {player.name}
                    </span>
                  </div>
                  <span className="text-sm font-mono text-brand-green">
                    {player.prob}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Email Signup ─────────────────────────────────────── */}
      <section id="signup" className="py-20 bg-surface-900">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <EmailSignup />
        </div>
      </section>
    </>
  );
}
