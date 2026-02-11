"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import {
  americanToDecimal,
  americanToImpliedProb,
  decimalToAmerican,
  decimalToImpliedProb,
  impliedProbToAmerican,
  impliedProbToDecimal,
  fractionalToDecimal,
  decimalToFractional,
  formatAmerican,
} from "@/lib/utils";

type OddsFormat = "american" | "decimal" | "fractional" | "probability";

interface ConvertedOdds {
  american: number;
  decimal: number;
  fractional: string;
  impliedProb: number;
}

function convertOdds(value: string, format: OddsFormat): ConvertedOdds | null {
  try {
    let decimal: number;

    switch (format) {
      case "american": {
        const american = parseFloat(value);
        if (isNaN(american) || american === 0 || (american > -100 && american < 100)) return null;
        decimal = americanToDecimal(american);
        break;
      }
      case "decimal": {
        decimal = parseFloat(value);
        if (isNaN(decimal) || decimal <= 1) return null;
        break;
      }
      case "fractional": {
        const parts = value.split("/");
        if (parts.length !== 2) return null;
        const num = parseFloat(parts[0]);
        const den = parseFloat(parts[1]);
        if (isNaN(num) || isNaN(den) || den === 0) return null;
        decimal = fractionalToDecimal(num, den);
        break;
      }
      case "probability": {
        let prob = parseFloat(value);
        if (isNaN(prob)) return null;
        if (prob > 1) prob = prob / 100; // Support both 0.55 and 55
        if (prob <= 0 || prob >= 1) return null;
        decimal = impliedProbToDecimal(prob);
        break;
      }
      default:
        return null;
    }

    const american = decimalToAmerican(decimal);
    const impliedProb = decimalToImpliedProb(decimal);
    const fractional = decimalToFractional(decimal);

    return { american, decimal, fractional, impliedProb };
  } catch {
    return null;
  }
}

const quickRef = [
  { american: -500, label: "Heavy Favorite" },
  { american: -300, label: "Strong Favorite" },
  { american: -200, label: "Favorite" },
  { american: -150, label: "Moderate Favorite" },
  { american: -110, label: "Slight Favorite" },
  { american: 100, label: "Even" },
  { american: 110, label: "Slight Underdog" },
  { american: 150, label: "Moderate Underdog" },
  { american: 200, label: "Underdog" },
  { american: 300, label: "Strong Underdog" },
  { american: 500, label: "Long Shot" },
];

export default function OddsConverterPage() {
  const [inputValue, setInputValue] = useState("");
  const [inputFormat, setInputFormat] = useState<OddsFormat>("american");
  const [result, setResult] = useState<ConvertedOdds | null>(null);

  const handleConvert = (val: string, fmt: OddsFormat) => {
    setInputValue(val);
    setInputFormat(fmt);
    if (val.trim()) {
      setResult(convertOdds(val, fmt));
    } else {
      setResult(null);
    }
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
          <ArrowLeftRight className="h-5 w-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Odds Converter
        </h1>
      </div>
      <p className="text-zinc-400 mb-10 max-w-xl">
        Convert between American, decimal, fractional, and implied probability
        formats. Type a value in any format to see all conversions instantly.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-600 bg-surface-800 p-6">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
              Input
            </h3>

            {/* Format selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {(
                [
                  { key: "american", label: "American" },
                  { key: "decimal", label: "Decimal" },
                  { key: "fractional", label: "Fractional" },
                  { key: "probability", label: "Probability" },
                ] as const
              ).map((fmt) => (
                <button
                  key={fmt.key}
                  onClick={() => handleConvert(inputValue, fmt.key)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    inputFormat === fmt.key
                      ? "bg-purple-800 text-white"
                      : "bg-surface-700 text-zinc-400 hover:text-white hover:bg-surface-600"
                  }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>

            {/* Value input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => handleConvert(e.target.value, inputFormat)}
              placeholder={
                inputFormat === "american"
                  ? "e.g. -150 or +200"
                  : inputFormat === "decimal"
                    ? "e.g. 1.67 or 3.00"
                    : inputFormat === "fractional"
                      ? "e.g. 3/2 or 5/1"
                      : "e.g. 0.60 or 60"
              }
              className="w-full px-4 py-3 rounded-lg bg-surface-900 border border-surface-600 text-white placeholder-zinc-500 text-lg font-mono focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
            />
          </div>

          {/* Results */}
          {result && (
            <div className="rounded-xl border border-surface-600 bg-surface-800 p-6">
              <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
                All Formats
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "American",
                    value: formatAmerican(result.american),
                  },
                  {
                    label: "Decimal",
                    value: result.decimal.toFixed(3),
                  },
                  {
                    label: "Fractional",
                    value: result.fractional,
                  },
                  {
                    label: "Implied Probability",
                    value: `${(result.impliedProb * 100).toFixed(2)}%`,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between py-2 border-b border-surface-700 last:border-0"
                  >
                    <span className="text-sm text-zinc-400">{row.label}</span>
                    <span className="text-base font-mono font-semibold text-white">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick reference table */}
        <div className="rounded-xl border border-surface-600 bg-surface-800 overflow-hidden h-fit">
          <div className="px-6 py-4 bg-surface-700/50">
            <h3 className="text-sm font-semibold text-zinc-300">
              Quick Reference
            </h3>
          </div>
          <div className="divide-y divide-surface-700">
            <div className="grid grid-cols-5 gap-2 px-6 py-2.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
              <div>Type</div>
              <div className="text-center">American</div>
              <div className="text-center">Decimal</div>
              <div className="text-center">Fractional</div>
              <div className="text-center">Prob</div>
            </div>
            {quickRef.map((row) => {
              const dec = americanToDecimal(row.american);
              const prob = americanToImpliedProb(row.american);
              const frac = decimalToFractional(dec);
              return (
                <div
                  key={row.american}
                  className="grid grid-cols-5 gap-2 px-6 py-2.5 text-sm hover:bg-surface-700/30 transition-colors"
                >
                  <div className="text-xs text-zinc-500 truncate">
                    {row.label}
                  </div>
                  <div className="text-center font-mono text-zinc-300">
                    {formatAmerican(row.american)}
                  </div>
                  <div className="text-center font-mono text-zinc-300">
                    {dec.toFixed(2)}
                  </div>
                  <div className="text-center font-mono text-zinc-300">
                    {frac}
                  </div>
                  <div className="text-center font-mono text-zinc-300">
                    {(prob * 100).toFixed(1)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
