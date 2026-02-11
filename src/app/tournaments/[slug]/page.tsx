import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  MapPin,
  Calendar,
  Clock,
} from "lucide-react";
import {
  getTournament,
  getAllTournamentSlugs,
} from "@/lib/tournaments";
import { TitleLeaderboard } from "./TitleLeaderboard";
import { QuarterAnalysisSection } from "./QuarterAnalysis";
import { FullDrawTable } from "./FullDrawTable";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTournamentSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = getTournament(slug);
  if (!data) return {};
  return {
    title: data.tournament.name,
    description: `Full-draw simulation projections for ${data.tournament.name}. Title odds, round-by-round probabilities, and quarter analysis.`,
  };
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start + "T00:00:00");
  const e = new Date(end + "T00:00:00");
  const opts: Intl.DateTimeFormatOptions = { month: "long", day: "numeric" };
  return `${s.toLocaleDateString("en-US", opts)} – ${e.toLocaleDateString("en-US", opts)}, ${e.getFullYear()}`;
}

function formatUpdated(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function TournamentPage({ params }: PageProps) {
  const { slug } = await params;
  const data = getTournament(slug);
  if (!data) notFound();

  const { tournament, simConfig, players, quarterAnalysis } = data;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb */}
      <Link
        href="/tournaments"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        All Tournaments
      </Link>

      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {tournament.status === "In Progress" && (
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase bg-brand-green/20 text-brand-green">
              Live
            </span>
          )}
          <span className="text-xs font-medium px-2.5 py-1 rounded bg-purple-900/50 text-purple-300">
            {tournament.category}
          </span>
          <span className="text-xs text-zinc-500">
            {tournament.surface} · {tournament.drawSize} draw
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          {tournament.name}
        </h1>

        <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-zinc-500" />
            {tournament.location}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-zinc-500" />
            {formatDateRange(tournament.startDate, tournament.endDate)}
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-zinc-500" />
            Updated {formatUpdated(simConfig.lastUpdated)}
          </div>
        </div>

        {simConfig.note.includes("Sample") && (
          <div className="mt-4 px-4 py-2.5 rounded-lg bg-purple-900/30 border border-purple-700/30 text-xs text-purple-300">
            This page contains sample data for demonstration. Replace with actual sim output.
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-12">
        {/* Title Leaderboard */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="h-5 w-5 text-brand-green" />
            <h2 className="text-xl font-bold text-white">
              Title Winner Probabilities
            </h2>
          </div>
          <TitleLeaderboard players={players} />
        </section>

        {/* Quarter Analysis */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">
            Quarter Analysis
          </h2>
          <QuarterAnalysisSection quarters={quarterAnalysis} />
        </section>

        {/* Full Draw */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6">
            Full Draw — Round-by-Round Probabilities
          </h2>
          <FullDrawTable players={players} drawSize={tournament.drawSize} />
        </section>
      </div>
    </div>
  );
}
