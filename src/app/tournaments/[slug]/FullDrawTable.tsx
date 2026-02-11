"use client";

import { useState } from "react";
import type { TournamentPlayer } from "@/lib/tournaments";

interface Props {
  players: TournamentPlayer[];
  drawSize: number;
}

type SortKey = "draw" | "name" | "r32" | "r16" | "qf" | "sf" | "f" | "w";

const roundLabels: Record<string, string> = {
  r32: "R32",
  r16: "R16",
  qf: "QF",
  sf: "SF",
  f: "F",
  w: "W",
};

function getRoundColumns(drawSize: number): (keyof typeof roundLabels)[] {
  if (drawSize >= 128) return ["r32", "r16", "qf", "sf", "f", "w"];
  if (drawSize >= 64) return ["r32", "r16", "qf", "sf", "f", "w"];
  return ["r16", "qf", "sf", "f", "w"];
}

export function FullDrawTable({ players, drawSize }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("w");
  const [sortAsc, setSortAsc] = useState(false);
  const [quarterFilter, setQuarterFilter] = useState<string>("all");

  const rounds = getRoundColumns(drawSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "name" || key === "draw");
    }
  };

  let filtered = quarterFilter === "all"
    ? players
    : players.filter((p) => p.quarter === quarterFilter);

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "name") {
      cmp = a.name.localeCompare(b.name);
    } else if (sortKey === "draw") {
      cmp = a.drawPosition - b.drawPosition;
    } else {
      const aVal = a.probabilities[sortKey as keyof typeof a.probabilities] ?? 0;
      const bVal = b.probabilities[sortKey as keyof typeof b.probabilities] ?? 0;
      cmp = aVal - bVal;
    }
    return sortAsc ? cmp : -cmp;
  });

  const quarters = ["Q1", "Q2", "Q3", "Q4"];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setQuarterFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            quarterFilter === "all"
              ? "bg-purple-800 text-white"
              : "bg-surface-700 text-zinc-400 hover:text-white hover:bg-surface-600"
          }`}
        >
          All
        </button>
        {quarters.map((q) => (
          <button
            key={q}
            onClick={() => setQuarterFilter(q)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              quarterFilter === q
                ? "bg-purple-800 text-white"
                : "bg-surface-700 text-zinc-400 hover:text-white hover:bg-surface-600"
            }`}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-surface-600 bg-surface-800 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-surface-700/50 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <th
                className="px-4 py-3 text-left cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("draw")}
              >
                #
                {sortKey === "draw" && (
                  <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>
                )}
              </th>
              <th
                className="px-4 py-3 text-left cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("name")}
              >
                Player
                {sortKey === "name" && (
                  <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>
                )}
              </th>
              <th className="px-4 py-3 text-center w-12">Seed</th>
              <th className="px-4 py-3 text-center w-10">Qtr</th>
              {rounds.map((round) => (
                <th
                  key={round}
                  className="px-3 py-3 text-center cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort(round as SortKey)}
                >
                  {roundLabels[round]}
                  {sortKey === round && (
                    <span className="ml-1">{sortAsc ? "↑" : "↓"}</span>
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-center">Odds</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700">
            {sorted.map((player) => (
              <tr
                key={player.name}
                className="hover:bg-surface-700/30 transition-colors"
              >
                <td className="px-4 py-2.5 text-xs font-mono text-zinc-500">
                  {player.drawPosition}
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-sm font-medium text-white">
                    {player.name}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  {player.seed ? (
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300">
                      {player.seed}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-700">—</span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-center text-xs text-zinc-500">
                  {player.quarter}
                </td>
                {rounds.map((round) => {
                  const val =
                    player.probabilities[
                      round as keyof typeof player.probabilities
                    ];
                  const pct = val * 100;

                  // Color intensity based on probability
                  let colorClass = "text-zinc-500";
                  if (pct >= 50) colorClass = "text-brand-green font-semibold";
                  else if (pct >= 30) colorClass = "text-green-400";
                  else if (pct >= 15) colorClass = "text-zinc-300";
                  else if (pct >= 5) colorClass = "text-zinc-400";

                  return (
                    <td
                      key={round}
                      className={`px-3 py-2.5 text-center text-sm font-mono ${colorClass}`}
                    >
                      {pct >= 0.5 ? pct.toFixed(1) : "<0.5"}
                    </td>
                  );
                })}
                <td className="px-4 py-2.5 text-center text-sm font-mono text-zinc-300">
                  {player.titleOdds}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-zinc-600 text-center">
        Probabilities shown as percentages. Click column headers to sort.
      </p>
    </div>
  );
}
