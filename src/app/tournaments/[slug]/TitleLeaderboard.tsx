"use client";

import { useState } from "react";
import type { TournamentPlayer } from "@/lib/tournaments";

interface Props {
  players: TournamentPlayer[];
}

export function TitleLeaderboard({ players }: Props) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...players].sort(
    (a, b) => b.probabilities.w - a.probabilities.w
  );

  const displayed = showAll ? sorted : sorted.slice(0, 16);
  const topProb = sorted[0]?.probabilities.w ?? 0;

  return (
    <div className="rounded-xl border border-surface-600 bg-surface-800 overflow-hidden">
      {/* Header */}
      <div className="hidden sm:grid grid-cols-12 gap-2 px-6 py-3 bg-surface-700/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-4">Player</div>
        <div className="col-span-4">Win Probability</div>
        <div className="col-span-2 text-center">Title Odds</div>
        <div className="col-span-1 text-center">Seed</div>
      </div>

      {/* Rows */}
      {displayed.map((player, i) => {
        const pct = player.probabilities.w * 100;
        const barWidth = topProb > 0 ? (player.probabilities.w / topProb) * 100 : 0;

        return (
          <div
            key={player.name}
            className={`grid grid-cols-12 gap-2 px-6 py-3 items-center ${
              i !== displayed.length - 1 ? "border-b border-surface-700" : ""
            } hover:bg-surface-700/30 transition-colors`}
          >
            {/* Rank */}
            <div className="col-span-1 text-center">
              <span
                className={`text-sm font-mono ${
                  i < 3 ? "text-brand-green font-bold" : "text-zinc-500"
                }`}
              >
                {i + 1}
              </span>
            </div>

            {/* Player */}
            <div className="col-span-4">
              <span className="text-sm font-semibold text-white">
                {player.name}
              </span>
            </div>

            {/* Probability bar */}
            <div className="col-span-4 flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-surface-600 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    i === 0
                      ? "bg-brand-green"
                      : i < 3
                        ? "bg-green-600"
                        : "bg-purple-600"
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span
                className={`text-sm font-mono w-14 text-right ${
                  i < 3 ? "text-brand-green font-semibold" : "text-zinc-300"
                }`}
              >
                {pct.toFixed(1)}%
              </span>
            </div>

            {/* Odds */}
            <div className="col-span-2 text-center">
              <span className="text-sm font-mono text-zinc-300">
                {player.titleOdds}
              </span>
            </div>

            {/* Seed */}
            <div className="col-span-1 text-center">
              {player.seed ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-purple-900/50 text-purple-300">
                  {player.seed}
                </span>
              ) : (
                <span className="text-xs text-zinc-600">—</span>
              )}
            </div>
          </div>
        );
      })}

      {/* Show more / less */}
      {sorted.length > 16 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-surface-700/30 transition-colors border-t border-surface-700"
        >
          {showAll ? "Show top 16" : `Show all ${sorted.length} players`}
        </button>
      )}
    </div>
  );
}
