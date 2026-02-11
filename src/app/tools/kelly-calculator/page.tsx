"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Info } from "lucide-react";
import {
  kellyCalculation,
  formatAmerican,
  formatPercent,
} from "@/lib/utils";

export default function KellyCalculatorPage() {
  const [marketOddsStr, setMarketOddsStr] = useState("");
  const [fairOddsStr, setFairOddsStr] = useState("");
  const [bankrollStr, setBankrollStr] = useState("1000");
  const [result, setResult] = useState<ReturnType<typeof kellyCalculation> | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const marketOdds = parseFloat(marketOddsStr);
    const fairOdds = parseFloat(fairOddsStr);
    const bankroll = parseFloat(bankrollStr) || 1000;

    if (isNaN(marketOdds) || isNaN(fairOdds)) return;
    if (marketOdds === 0 || fairOdds === 0) return;
    if (marketOdds > -100 && marketOdds < 100) return;
    if (fairOdds > -100 && fairOdds < 100) return;

    setResult(kellyCalculation(marketOdds, fairOdds, bankroll));
  };

  const handleReset = () => {
    setMarketOddsStr("");
    setFairOddsStr("");
    setBankrollStr("1000");
    setResult(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tools
      </Link>

      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-900/50 text-purple-400">
          <Calculator className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Kelly Criterion Calculator
        </h1>
      </div>
      <p className="text-zinc-400 mb-10 max-w-xl">
        Calculate the mathematically optimal bet size based on your edge. Enter
        the market odds, your estimated fair odds, and your bankroll.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input form */}
        <form
          onSubmit={handleCalculate}
          className="rounded-xl border border-surface-600 bg-surface-800 p-6 space-y-5 h-fit"
        >
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Market Odds (American)
            </label>
            <input
              type="number"
              value={marketOddsStr}
              onChange={(e) => setMarketOddsStr(e.target.value)}
              placeholder="e.g. -150 or +200"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-surface-900 border border-surface-600 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
            <p className="text-xs text-zinc-600 mt-1">
              The odds offered by the sportsbook
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Fair Odds (American)
            </label>
            <input
              type="number"
              value={fairOddsStr}
              onChange={(e) => setFairOddsStr(e.target.value)}
              placeholder="e.g. -120 or +180"
              required
              className="w-full px-4 py-2.5 rounded-lg bg-surface-900 border border-surface-600 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
            <p className="text-xs text-zinc-600 mt-1">
              Your estimated true odds (from your model or judgment)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1.5">
              Bankroll ($)
            </label>
            <input
              type="number"
              value={bankrollStr}
              onChange={(e) => setBankrollStr(e.target.value)}
              placeholder="1000"
              min={1}
              className="w-full px-4 py-2.5 rounded-lg bg-surface-900 border border-surface-600 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-lg bg-brand-green text-surface-950 font-semibold text-sm hover:bg-green-400 transition-colors"
            >
              Calculate
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 rounded-lg border border-surface-600 text-zinc-400 font-medium text-sm hover:bg-surface-700 hover:text-white transition-colors"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              {/* Edge summary */}
              <div className="rounded-xl border border-surface-600 bg-surface-800 p-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                  Edge Analysis
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">
                      Market Implied
                    </div>
                    <div className="text-lg font-bold text-white">
                      {formatPercent(result.impliedProbability)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">
                      Your Fair Prob
                    </div>
                    <div className="text-lg font-bold text-white">
                      {formatPercent(result.trueProbability)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Edge</div>
                    <div
                      className={`text-lg font-bold ${
                        result.edge > 0 ? "text-brand-green" : "text-red-400"
                      }`}
                    >
                      {result.edge > 0 ? "+" : ""}
                      {formatPercent(result.edge)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">
                      Expected Value
                    </div>
                    <div
                      className={`text-lg font-bold ${
                        result.evPercent > 0 ? "text-brand-green" : "text-red-400"
                      }`}
                    >
                      {result.evPercent > 0 ? "+" : ""}
                      {result.evPercent.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Kelly recommendations */}
              <div className="rounded-xl border border-surface-600 bg-surface-800 p-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                  Recommended Bet Size
                </h3>
                {result.fullKelly <= 0 ? (
                  <div className="text-center py-4">
                    <p className="text-red-400 font-medium">No edge detected</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Kelly says don&apos;t bet when there&apos;s no positive expectation
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      {
                        label: "Full Kelly",
                        pct: result.fullKelly,
                        amount: result.fullKellyAmount,
                        note: "Maximum growth, high variance",
                      },
                      {
                        label: "Half Kelly",
                        pct: result.halfKelly,
                        amount: result.halfKellyAmount,
                        note: "Recommended for most bettors",
                        highlighted: true,
                      },
                      {
                        label: "Quarter Kelly",
                        pct: result.quarterKelly,
                        amount: result.quarterKellyAmount,
                        note: "Conservative, low variance",
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          row.highlighted
                            ? "bg-brand-green/10 border border-brand-green/20"
                            : "bg-surface-700/50"
                        }`}
                      >
                        <div>
                          <div
                            className={`text-sm font-semibold ${
                              row.highlighted ? "text-brand-green" : "text-white"
                            }`}
                          >
                            {row.label}
                          </div>
                          <div className="text-xs text-zinc-500">{row.note}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-white">
                            ${row.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {formatPercent(row.pct)} of bankroll
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick reference */}
              <div className="rounded-xl border border-surface-600 bg-surface-800 p-6">
                <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Odds Breakdown
                </h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">American</div>
                    <div className="text-sm font-mono text-white">
                      {formatAmerican(parseFloat(marketOddsStr))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Decimal</div>
                    <div className="text-sm font-mono text-white">
                      {result.decimalOdds.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Implied %</div>
                    <div className="text-sm font-mono text-white">
                      {formatPercent(result.impliedProbability)}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Explanation placeholder */
            <div className="rounded-xl border border-surface-600 bg-surface-800 p-6">
              <div className="flex items-center gap-2 text-purple-400 mb-3">
                <Info className="h-4 w-4" />
                <h3 className="text-sm font-semibold">How it works</h3>
              </div>
              <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
                <p>
                  The <strong className="text-zinc-200">Kelly criterion</strong>{" "}
                  calculates the mathematically optimal fraction of your bankroll
                  to wager when you have an edge.
                </p>
                <p>
                  <strong className="text-zinc-200">Formula:</strong>{" "}
                  <code className="text-xs bg-surface-700 px-1.5 py-0.5 rounded text-purple-300">
                    f* = (bp - q) / b
                  </code>
                </p>
                <p>
                  Where <em>b</em> = decimal odds - 1, <em>p</em> = your true
                  probability, and <em>q</em> = 1 - p.
                </p>
                <p>
                  <strong className="text-zinc-200">Half Kelly</strong> is
                  generally recommended as it provides ~75% of the growth rate
                  with significantly less variance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
