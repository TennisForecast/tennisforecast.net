import type { QuarterAnalysis } from "@/lib/tournaments";

interface Props {
  quarters: QuarterAnalysis[];
}

export function QuarterAnalysisSection({ quarters }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {quarters.map((q) => {
        const maxProb = Math.max(...q.topContenders.map((c) => c.sfProb));

        return (
          <div
            key={q.quarter}
            className="rounded-xl border border-surface-600 bg-surface-800 overflow-hidden"
          >
            {/* Quarter header */}
            <div className="px-5 py-3 bg-surface-700/50 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-400 mr-2">
                  {q.quarter}
                </span>
                <span className="text-sm font-semibold text-white">
                  {q.label}
                </span>
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                SF Prob
              </span>
            </div>

            {/* Contenders */}
            <div className="divide-y divide-surface-700">
              {q.topContenders
                .sort((a, b) => b.sfProb - a.sfProb)
                .map((c) => {
                  const barWidth =
                    maxProb > 0 ? (c.sfProb / maxProb) * 100 : 0;
                  const isTop = c.sfProb === maxProb;

                  return (
                    <div
                      key={c.name}
                      className="px-5 py-3 flex items-center gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm font-medium text-white truncate">
                            {c.name}
                          </span>
                          {c.seed && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300 shrink-0">
                              {c.seed}
                            </span>
                          )}
                        </div>
                        <div className="h-1.5 rounded-full bg-surface-600 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isTop ? "bg-brand-green" : "bg-purple-600"
                            }`}
                            style={{ width: `${barWidth}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={`text-sm font-mono w-12 text-right shrink-0 ${
                          isTop
                            ? "text-brand-green font-semibold"
                            : "text-zinc-300"
                        }`}
                      >
                        {(c.sfProb * 100).toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
