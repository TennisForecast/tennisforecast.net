/**
 * Convert American odds to decimal odds
 */
export function americanToDecimal(american: number): number {
  if (american > 0) {
    return american / 100 + 1;
  }
  return 100 / Math.abs(american) + 1;
}

/**
 * Convert decimal odds to American odds
 */
export function decimalToAmerican(decimal: number): number {
  if (decimal >= 2) {
    return Math.round((decimal - 1) * 100);
  }
  return Math.round(-100 / (decimal - 1));
}

/**
 * Convert American odds to implied probability
 */
export function americanToImpliedProb(american: number): number {
  if (american > 0) {
    return 100 / (american + 100);
  }
  return Math.abs(american) / (Math.abs(american) + 100);
}

/**
 * Convert implied probability to American odds
 */
export function impliedProbToAmerican(prob: number): number {
  if (prob >= 0.5) {
    return Math.round(-100 * prob / (1 - prob));
  }
  return Math.round(100 * (1 - prob) / prob);
}

/**
 * Convert decimal odds to implied probability
 */
export function decimalToImpliedProb(decimal: number): number {
  return 1 / decimal;
}

/**
 * Convert implied probability to decimal odds
 */
export function impliedProbToDecimal(prob: number): number {
  return 1 / prob;
}

/**
 * Convert fractional odds string (e.g. "5/2") to decimal
 */
export function fractionalToDecimal(numerator: number, denominator: number): number {
  return numerator / denominator + 1;
}

/**
 * Convert decimal odds to fractional string
 */
export function decimalToFractional(decimal: number): string {
  const frac = decimal - 1;
  // Find a reasonable fraction
  for (let d = 1; d <= 100; d++) {
    const n = frac * d;
    if (Math.abs(n - Math.round(n)) < 0.001) {
      return `${Math.round(n)}/${d}`;
    }
  }
  return `${frac.toFixed(2)}/1`;
}

/**
 * Format American odds with +/- prefix
 */
export function formatAmerican(odds: number): string {
  if (odds > 0) return `+${odds}`;
  return `${odds}`;
}

/**
 * Format probability as percentage
 */
export function formatPercent(prob: number, decimals: number = 1): string {
  return `${(prob * 100).toFixed(decimals)}%`;
}

/**
 * Kelly Criterion calculation
 * @param marketOdds - Market odds in American format
 * @param fairOdds - Your fair odds in American format
 * @param bankroll - Total bankroll (default $1000)
 * @returns Kelly criterion results
 */
export function kellyCalculation(
  marketOdds: number,
  fairOdds: number,
  bankroll: number = 1000
) {
  const decimalOdds = americanToDecimal(marketOdds);
  const trueProbability = americanToImpliedProb(fairOdds);
  const impliedProbability = americanToImpliedProb(marketOdds);

  const edge = trueProbability - impliedProbability;
  const evPercent =
    (trueProbability * (decimalOdds - 1) - (1 - trueProbability)) * 100;

  const b = decimalOdds - 1;
  const p = trueProbability;
  const q = 1 - p;

  const fullKelly = (b * p - q) / b;
  const halfKelly = fullKelly / 2;
  const quarterKelly = fullKelly / 4;

  return {
    decimalOdds,
    trueProbability,
    impliedProbability,
    edge,
    evPercent,
    fullKelly: Math.max(0, fullKelly),
    halfKelly: Math.max(0, halfKelly),
    quarterKelly: Math.max(0, quarterKelly),
    fullKellyAmount: Math.max(0, fullKelly * bankroll),
    halfKellyAmount: Math.max(0, halfKelly * bankroll),
    quarterKellyAmount: Math.max(0, quarterKelly * bankroll),
  };
}
