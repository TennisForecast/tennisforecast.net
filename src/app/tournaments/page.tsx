import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, MapPin, Calendar, ChevronRight } from "lucide-react";
import { getAllTournaments } from "@/lib/tournaments";

export const metadata: Metadata = {
  title: "Tournaments",
  description:
    "Tournament simulations and projections for ATP and WTA events. Round-by-round probabilities from 1M+ Monte Carlo simulations.",
};

function formatDateRange(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}, ${e.getFullYear()}`;
}

export default function TournamentsPage() {
  const tournaments = getAllTournaments();

  // Sort: In Progress first, then by start date descending
  const sorted = [...tournaments].sort((a, b) => {
    if (a.tournament.status === "In Progress" && b.tournament.status !== "In Progress") return -1;
    if (b.tournament.status === "In Progress" && a.tournament.status !== "In Progress") return 1;
    return new Date(b.tournament.startDate).getTime() - new Date(a.tournament.startDate).getTime();
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-surface-700">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-surface-950 to-surface-950" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tournament Simulations
            </h1>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Full-draw projections powered by large-scale simulations. Title
              odds, round-by-round probabilities, and quarter analysis for
              current and upcoming events.
            </p>
          </div>
        </div>
      </section>

      {/* Tournament list */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sorted.map((t) => {
              const topPlayers = [...t.players]
                .sort((a, b) => b.probabilities.w - a.probabilities.w)
                .slice(0, 3);

              return (
                <Link
                  key={t.tournament.slug}
                  href={`/tournaments/${t.tournament.slug}`}
                  className="group rounded-xl border border-surface-600 bg-surface-800 overflow-hidden hover:border-purple-700/50 transition-colors"
                >
                  {/* Card header */}
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          {t.tournament.status === "In Progress" && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-green/20 text-brand-green">
                              Live
                            </span>
                          )}
                          <span className="text-xs font-medium text-purple-400">
                            {t.tournament.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white group-hover:text-brand-green transition-colors">
                          {t.tournament.name}
                        </h3>
                      </div>
                      <Trophy className="h-5 w-5 text-surface-500 group-hover:text-purple-400 transition-colors" />
                    </div>

                    <div className="flex flex-col gap-1.5 text-xs text-zinc-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" />
                        {t.tournament.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {formatDateRange(t.tournament.startDate, t.tournament.endDate)}
                      </div>
                      <div className="text-zinc-600">
                        {t.tournament.surface} · {t.tournament.drawSize} draw
                      </div>
                    </div>
                  </div>

                  {/* Top favorites mini list */}
                  <div className="border-t border-surface-700 px-6 py-3 bg-surface-700/20">
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                      Title Favorites
                    </div>
                    {topPlayers.map((p, i) => (
                      <div
                        key={p.name}
                        className="flex items-center justify-between py-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-zinc-600 w-3">
                            {i + 1}
                          </span>
                          <span className="text-sm text-zinc-300">
                            {p.name}
                          </span>
                          {p.seed && (
                            <span className="text-[10px] text-zinc-600">
                              [{p.seed}]
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-brand-green">
                          {(p.probabilities.w * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Card footer */}
                  <div className="px-6 py-3 border-t border-surface-700 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">
                      View full projections
                    </span>
                    <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-brand-green transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
