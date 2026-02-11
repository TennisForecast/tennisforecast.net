#!/usr/bin/env python3
"""
TennisForecast Tournament Simulator

Runs Monte Carlo simulations on a tournament draw and produces:
  1. An Excel file in sim-output/ for review
  2. Optionally, a JSON file in src/data/tournaments/ for the website

Usage:
  python scripts/sim.py draws/dallas-2026.xlsx
  python scripts/sim.py draws/dallas-2026.xlsx --sims 500000 --format bo5

Draw file format (Excel, sheet named "Draw"):
  Column A: DrawPosition (1-based, determines bracket placement)
  Column B: Player (full name)
  Column C: Seed (integer or blank)
  Column D: Elo (numeric rating)
  Column E: Factor (optional multiplier, default 1.0)

Tournament metadata (Excel, sheet named "Info"):
  Row 1: Name         | Dallas Open 2026
  Row 2: Slug         | dallas-2026
  Row 3: Surface      | Hard (Indoor)
  Row 4: Category     | ATP 250
  Row 5: Location     | Dallas, USA
  Row 6: StartDate    | 2026-02-09
  Row 7: EndDate      | 2026-02-15
  Row 8: Status       | In Progress
"""

import argparse
import json
import math
import os
import random
import sys
from collections import defaultdict
from datetime import datetime, timezone

import pandas as pd


# ─── Elo / probability functions ───────────────────────────────────

def elo_win_prob(elo1: float, elo2: float) -> float:
    """Standard Elo win probability for player 1."""
    return 1.0 / (1.0 + 10.0 ** ((elo2 - elo1) / 400.0))


# Exact BO5 conversion via set-winning probability
def _set_win_prob_to_bo5(p_set: float) -> float:
    """Exact BO5 match prob from set win prob."""
    p = p_set
    q = 1 - p
    return p**3 * (1 + 3*q + 6*q**2)


def bo3_to_bo5_exact(p_bo3: float) -> float:
    """
    Convert BO3 match win prob to BO5 by estimating underlying set win prob.
    BO3 match prob = p^2 * (1 + 2*q) where p = set win prob.
    We solve numerically then compute BO5 from the same set prob.
    """
    # Newton's method to find set win prob from BO3 match prob
    # f(p) = p^2 * (1 + 2*(1-p)) - target = 0
    target = p_bo3
    p = p_bo3  # initial guess
    for _ in range(50):
        q = 1 - p
        f = p**2 * (1 + 2*q) - target
        fp = 2*p*(1 + 2*q) + p**2 * (-2)  # derivative
        if abs(fp) < 1e-15:
            break
        p = p - f / fp
        p = max(0.001, min(0.999, p))
    return _set_win_prob_to_bo5(p)


def squeeze_probability(p: float, factor: float = 0.99) -> float:
    """Squeeze probability toward 0.5 to reduce overconfidence."""
    return p * factor + (1 - factor) / 2


# ─── Simulation engine ─────────────────────────────────────────────

def simulate_tournament(players: list[dict], num_sims: int, match_format: str,
                        prob_squeeze: float = 0.99) -> dict:
    """
    Run Monte Carlo tournament simulation.

    players: list of dicts with keys: name, seed, drawPosition, elo, factor, quarter
    num_sims: number of simulations
    match_format: 'bo3' or 'bo5'

    Returns dict with round-by-round counts and matchup tracking.
    """
    n = len(players)
    # Ensure draw size is a power of 2
    assert n > 0 and (n & (n - 1)) == 0, f"Draw size must be power of 2, got {n}"

    num_rounds = int(math.log2(n))
    round_names = _get_round_names(n)

    # Sort by draw position
    ordered = sorted(players, key=lambda p: p["drawPosition"])

    # Initialize counters
    advancement = {p["name"]: [0] * num_rounds for p in ordered}
    winner_count = defaultdict(int)

    # Run simulations
    for _ in range(num_sims):
        # Current round players (indices into ordered)
        bracket = list(range(n))

        for round_idx in range(num_rounds):
            next_bracket = []
            for match in range(0, len(bracket), 2):
                i1, i2 = bracket[match], bracket[match + 1]
                p1, p2 = ordered[i1], ordered[i2]

                # Handle byes (elo = 0)
                if p1["elo"] == 0:
                    winner_idx = i2
                elif p2["elo"] == 0:
                    winner_idx = i1
                else:
                    # Calculate win probability
                    wp = elo_win_prob(p1["elo"], p2["elo"])

                    # Apply factors
                    # Factors adjust Elo difference effect
                    f1 = p1.get("factor", 1.0)
                    f2 = p2.get("factor", 1.0)
                    if f1 != 1.0 or f2 != 1.0:
                        adj_elo1 = p1["elo"] * f1
                        adj_elo2 = p2["elo"] * f2
                        wp = elo_win_prob(adj_elo1, adj_elo2)

                    # Convert to BO5 if needed
                    if match_format == "bo5":
                        wp = bo3_to_bo5_exact(wp)

                    # Squeeze
                    if prob_squeeze < 1.0:
                        wp = squeeze_probability(wp, prob_squeeze)

                    # Simulate match
                    winner_idx = i1 if random.random() < wp else i2

                advancement[ordered[winner_idx]["name"]][round_idx] += 1
                next_bracket.append(winner_idx)

            bracket = next_bracket

        # Track tournament winner
        final_winner = ordered[bracket[0]]["name"]
        winner_count[final_winner] += 1

    # Convert counts to probabilities
    results = []
    for p in ordered:
        probs = {}
        for round_idx, round_name in enumerate(round_names):
            probs[round_name] = advancement[p["name"]][round_idx] / num_sims
        results.append({
            "name": p["name"],
            "seed": p["seed"],
            "drawPosition": p["drawPosition"],
            "quarter": p["quarter"],
            "probabilities": probs,
            "winCount": winner_count.get(p["name"], 0),
        })

    return {
        "results": results,
        "numSimulations": num_sims,
        "roundNames": round_names,
    }


def _get_round_names(draw_size: int) -> list[str]:
    """
    Generate round name sequence based on draw size.
    Each name represents what a player achieves by winning that sim round.
    For a 32-draw: ["r16", "qf", "sf", "f", "w"]
    For a 16-draw: ["qf", "sf", "f", "w"]
    For a 128-draw: ["r64", "r32", "r16", "qf", "sf", "f", "w"]
    """
    names = []
    remaining = draw_size
    while remaining > 1:
        remaining //= 2
        if remaining == 1:
            names.append("w")
        elif remaining == 2:
            names.append("f")
        elif remaining == 4:
            names.append("sf")
        elif remaining == 8:
            names.append("qf")
        elif remaining == 16:
            names.append("r16")
        elif remaining == 32:
            names.append("r32")
        elif remaining == 64:
            names.append("r64")
        else:
            names.append(f"r{remaining}")
    return names


def assign_quarters(players: list[dict], draw_size: int) -> list[dict]:
    """Assign quarter labels based on draw position."""
    q_size = draw_size // 4
    for p in players:
        pos = p["drawPosition"]
        if pos <= q_size:
            p["quarter"] = "Q1"
        elif pos <= 2 * q_size:
            p["quarter"] = "Q2"
        elif pos <= 3 * q_size:
            p["quarter"] = "Q3"
        else:
            p["quarter"] = "Q4"
    return players


def compute_quarter_analysis(results: list[dict]) -> list[dict]:
    """Compute SF probabilities by quarter."""
    quarters = {"Q1": [], "Q2": [], "Q3": [], "Q4": []}
    for p in results:
        q = p["quarter"]
        sf_prob = p["probabilities"].get("sf", 0)
        quarters[q].append({
            "name": p["name"],
            "seed": p["seed"],
            "sfProb": round(sf_prob, 4),
        })

    labels = {"Q1": "Top Quarter", "Q2": "Second Quarter",
              "Q3": "Third Quarter", "Q4": "Bottom Quarter"}

    analysis = []
    for q_name in ["Q1", "Q2", "Q3", "Q4"]:
        contenders = sorted(quarters[q_name], key=lambda x: -x["sfProb"])[:4]
        analysis.append({
            "quarter": q_name,
            "label": labels[q_name],
            "topContenders": contenders,
        })
    return analysis


def prob_to_american(prob: float) -> str:
    """Convert probability to American odds string."""
    if prob <= 0 or prob >= 1:
        return "N/A"
    if prob >= 0.5:
        odds = round(-100 * prob / (1 - prob))
        return str(odds)
    else:
        odds = round(100 * (1 - prob) / prob)
        return f"+{odds}"


# ─── I/O functions ─────────────────────────────────────────────────

def read_draw(filepath: str) -> tuple[list[dict], dict]:
    """
    Read draw from Excel file.
    Returns (players, tournament_info).
    """
    # Read draw sheet
    df = pd.read_excel(filepath, sheet_name="Draw")
    df.columns = [c.strip() for c in df.columns]

    players = []
    for _, row in df.iterrows():
        players.append({
            "name": str(row["Player"]).strip(),
            "seed": int(row["Seed"]) if pd.notna(row.get("Seed")) else None,
            "drawPosition": int(row["DrawPosition"]),
            "elo": float(row["Elo"]),
            "factor": float(row.get("Factor", 1.0)) if pd.notna(row.get("Factor")) else 1.0,
            "quarter": "",
        })

    # Pad to power of 2 with byes if needed
    n = len(players)
    target = 1
    while target < n:
        target *= 2

    if n < target:
        print(f"  Draw has {n} players, padding to {target} with byes")
        for i in range(n + 1, target + 1):
            if not any(p["drawPosition"] == i for p in players):
                players.append({
                    "name": f"BYE-{i}",
                    "seed": None,
                    "drawPosition": i,
                    "elo": 0,
                    "factor": 1.0,
                    "quarter": "",
                })

    # Read tournament info
    try:
        info_df = pd.read_excel(filepath, sheet_name="Info", header=None)
        info = {}
        for _, row in info_df.iterrows():
            key = str(row[0]).strip()
            val = str(row[1]).strip() if pd.notna(row[1]) else ""
            info[key] = val

        tournament_info = {
            "name": info.get("Name", os.path.basename(filepath).replace(".xlsx", "")),
            "slug": info.get("Slug", os.path.basename(filepath).replace(".xlsx", "").lower()),
            "surface": info.get("Surface", "Hard"),
            "category": info.get("Category", "ATP"),
            "location": info.get("Location", "TBD"),
            "startDate": info.get("StartDate", ""),
            "endDate": info.get("EndDate", ""),
            "drawSize": target,
            "status": info.get("Status", "Upcoming"),
        }
    except Exception:
        # No Info sheet -- use defaults
        base = os.path.basename(filepath).replace(".xlsx", "")
        tournament_info = {
            "name": base,
            "slug": base.lower().replace(" ", "-"),
            "surface": "Hard",
            "category": "ATP",
            "location": "TBD",
            "startDate": "",
            "endDate": "",
            "drawSize": target,
            "status": "Upcoming",
        }

    return players, tournament_info


def save_results_excel(results: list[dict], round_names: list[str],
                       tournament_info: dict, output_path: str):
    """Save simulation results to Excel for review."""
    rows = []
    for p in sorted(results, key=lambda x: -x["probabilities"].get("w", 0)):
        row = {
            "Player": p["name"],
            "Seed": p["seed"] if p["seed"] else "",
            "Draw": p["drawPosition"],
            "Quarter": p["quarter"],
        }
        for rn in round_names:
            pct = p["probabilities"].get(rn, 0) * 100
            row[rn.upper()] = round(pct, 2)
        row["Title Odds"] = prob_to_american(p["probabilities"].get("w", 0))
        rows.append(row)

    df = pd.DataFrame(rows)
    df.to_excel(output_path, index=False, sheet_name="Sim Results")
    print(f"\n  Results saved to: {output_path}")


def save_site_json(results: list[dict], quarter_analysis: list[dict],
                   tournament_info: dict, num_sims: int, output_path: str):
    """Save simulation results as JSON for the website."""
    players_json = []
    for p in results:
        # Skip byes
        if p["name"].startswith("BYE-"):
            continue
        players_json.append({
            "name": p["name"],
            "seed": p["seed"],
            "drawPosition": p["drawPosition"],
            "quarter": p["quarter"],
            "probabilities": {k: round(v, 4) for k, v in p["probabilities"].items()},
            "titleOdds": prob_to_american(p["probabilities"].get("w", 0)),
        })

    data = {
        "tournament": tournament_info,
        "simConfig": {
            "numSimulations": num_sims,
            "lastUpdated": datetime.now(timezone.utc).isoformat(),
            "note": "",
        },
        "players": sorted(players_json, key=lambda x: x["drawPosition"]),
        "quarterAnalysis": quarter_analysis,
    }

    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)
    print(f"  Site JSON saved to: {output_path}")


def update_tournament_registry(project_root: str, data_dir: str):
    """
    Auto-generate the tournament registry TypeScript file
    based on all JSON files in src/data/tournaments/.
    """
    registry_path = os.path.join(project_root, "src", "lib", "tournaments.ts")

    # Find all tournament JSON files
    json_files = sorted([
        f.replace(".json", "")
        for f in os.listdir(data_dir)
        if f.endswith(".json")
    ])

    # Generate imports
    imports = []
    registry_entries = []
    for slug in json_files:
        var_name = slug.replace("-", "_")
        imports.append(f'import {var_name}Data from "@/data/tournaments/{slug}.json";')
        registry_entries.append(f'  "{slug}": {var_name}Data as unknown as TournamentData,')

    # Write the file
    content = f"""{chr(10).join(imports)}

export interface TournamentPlayer {{
  name: string;
  seed: number | null;
  drawPosition: number;
  quarter: string;
  probabilities: Record<string, number>;
  titleOdds: string;
}}

export interface QuarterContender {{
  name: string;
  seed: number | null;
  sfProb: number;
}}

export interface QuarterAnalysis {{
  quarter: string;
  label: string;
  topContenders: QuarterContender[];
}}

export interface TournamentInfo {{
  name: string;
  slug: string;
  surface: string;
  category: string;
  location: string;
  startDate: string;
  endDate: string;
  drawSize: number;
  status: string;
}}

export interface TournamentData {{
  tournament: TournamentInfo;
  simConfig: {{
    numSimulations: number;
    lastUpdated: string;
    note: string;
  }};
  players: TournamentPlayer[];
  quarterAnalysis: QuarterAnalysis[];
}}

// Auto-generated registry — do not edit manually.
// This file is updated by scripts/sim.py when deploying.
const tournamentRegistry: Record<string, TournamentData> = {{
{chr(10).join(registry_entries)}
}};

export function getAllTournaments(): TournamentData[] {{
  return Object.values(tournamentRegistry);
}}

export function getTournament(slug: string): TournamentData | null {{
  return tournamentRegistry[slug] ?? null;
}}

export function getAllTournamentSlugs(): string[] {{
  return Object.keys(tournamentRegistry);
}}
"""

    with open(registry_path, "w") as f:
        f.write(content)
    print(f"  Tournament registry updated: {registry_path}")


# ─── Main ──────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="TennisForecast Tournament Simulator")
    parser.add_argument("draw", help="Path to draw Excel file (e.g. draws/dallas-2026.xlsx)")
    parser.add_argument("--sims", type=int, default=1_000_000, help="Number of simulations (default: 1,000,000)")
    parser.add_argument("--format", choices=["bo3", "bo5"], default="bo3", help="Match format (default: bo3)")
    parser.add_argument("--squeeze", type=float, default=0.99, help="Probability squeeze factor (default: 0.99)")
    parser.add_argument("--yes", action="store_true", help="Skip deploy confirmation")
    args = parser.parse_args()

    if not os.path.exists(args.draw):
        print(f"Error: Draw file not found: {args.draw}")
        sys.exit(1)

    # Resolve paths relative to project root
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sim_output_dir = os.path.join(project_root, "sim-output")
    site_data_dir = os.path.join(project_root, "src", "data", "tournaments")
    os.makedirs(sim_output_dir, exist_ok=True)
    os.makedirs(site_data_dir, exist_ok=True)

    # Read draw
    print(f"\n{'='*60}")
    print(f"  TennisForecast Simulator")
    print(f"{'='*60}")
    print(f"\n  Reading draw: {args.draw}")

    players, tournament_info = read_draw(args.draw)
    real_players = [p for p in players if not p["name"].startswith("BYE-")]
    print(f"  Players: {len(real_players)} ({tournament_info['drawSize']} draw)")
    print(f"  Tournament: {tournament_info['name']}")
    print(f"  Format: Best of {'5' if args.format == 'bo5' else '3'}")
    print(f"  Simulations: {args.sims:,}")

    # Assign quarters
    players = assign_quarters(players, tournament_info["drawSize"])

    # Run simulation
    print(f"\n  Running {args.sims:,} simulations...")
    sim_result = simulate_tournament(players, args.sims, args.format, args.squeeze)
    print(f"  Done!")

    # Filter out byes from results
    results = [r for r in sim_result["results"] if not r["name"].startswith("BYE-")]

    # Print top 10 summary
    top = sorted(results, key=lambda x: -x["probabilities"].get("w", 0))[:10]
    print(f"\n  {'─'*50}")
    print(f"  Top 10 Title Contenders")
    print(f"  {'─'*50}")
    print(f"  {'#':<4} {'Player':<25} {'Win%':>8} {'Odds':>10}")
    print(f"  {'─'*50}")
    for i, p in enumerate(top):
        pct = p["probabilities"]["w"] * 100
        odds = prob_to_american(p["probabilities"]["w"])
        seed_str = f" [{p['seed']}]" if p["seed"] else ""
        print(f"  {i+1:<4} {p['name'] + seed_str:<25} {pct:>7.1f}% {odds:>10}")

    # Save Excel
    slug = tournament_info["slug"]
    excel_path = os.path.join(sim_output_dir, f"{slug}_results.xlsx")
    save_results_excel(results, sim_result["roundNames"], tournament_info, excel_path)

    # Compute quarter analysis
    quarter_analysis = compute_quarter_analysis(results)

    # Deploy prompt
    print(f"\n  {'─'*50}")
    if args.yes:
        deploy = True
    else:
        response = input("\n  Deploy to site? (y/n): ").strip().lower()
        deploy = response in ("y", "yes")

    if deploy:
        json_path = os.path.join(site_data_dir, f"{slug}.json")
        save_site_json(results, quarter_analysis, tournament_info, args.sims, json_path)
        update_tournament_registry(project_root, site_data_dir)
        print(f"\n  Ready to go live! Run:")
        print(f"    cd {project_root}")
        print(f"    git add . && git commit -m 'Update {tournament_info['name']} projections' && git push")
    else:
        print(f"\n  Results saved to {excel_path} for review.")
        print(f"  Run again with --yes to deploy when ready.")

    print(f"\n{'='*60}\n")


if __name__ == "__main__":
    main()
