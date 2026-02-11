import dallas_2026Data from "@/data/tournaments/dallas-2026.json";

export interface TournamentPlayer {
  name: string;
  seed: number | null;
  drawPosition: number;
  quarter: string;
  probabilities: Record<string, number>;
  titleOdds: string;
}

export interface QuarterContender {
  name: string;
  seed: number | null;
  sfProb: number;
}

export interface QuarterAnalysis {
  quarter: string;
  label: string;
  topContenders: QuarterContender[];
}

export interface TournamentInfo {
  name: string;
  slug: string;
  surface: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  drawSize: number;
  status: string;
}

export interface TournamentData {
  tournament: TournamentInfo;
  simConfig: {
    numSimulations: number;
    lastUpdated: string;
    note: string;
  };
  players: TournamentPlayer[];
  quarterAnalysis: QuarterAnalysis[];
}

// Auto-generated registry — do not edit manually.
// This file is updated by scripts/sim.py when deploying.
const tournamentRegistry: Record<string, TournamentData> = {
  "dallas-2026": dallas_2026Data as unknown as TournamentData,
};

export function getAllTournaments(): TournamentData[] {
  return Object.values(tournamentRegistry);
}

export function getTournament(slug: string): TournamentData | null {
  return tournamentRegistry[slug] ?? null;
}

export function getAllTournamentSlugs(): string[] {
  return Object.keys(tournamentRegistry);
}
