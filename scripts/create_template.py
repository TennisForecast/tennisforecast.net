#!/usr/bin/env python3
"""
Create a template draw Excel file showing the expected format.
Usage: python scripts/create_template.py
"""

import pandas as pd
import os

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_path = os.path.join(project_root, "draws", "TEMPLATE.xlsx")

# Example 16-draw tournament
draw_data = pd.DataFrame({
    "DrawPosition": list(range(1, 17)),
    "Player": [
        "Player One", "Player Two", "Player Three", "Player Four",
        "Player Five", "Player Six", "Player Seven", "Player Eight",
        "Player Nine", "Player Ten", "Player Eleven", "Player Twelve",
        "Player Thirteen", "Player Fourteen", "Player Fifteen", "Player Sixteen",
    ],
    "Seed": [1, None, None, None, 5, None, None, 4,
             3, None, None, None, None, None, None, 2],
    "Elo": [
        2100, 1850, 1900, 1820, 1950, 1870, 1810, 2000,
        2050, 1880, 1840, 1860, 1890, 1830, 1920, 2080,
    ],
    "Factor": [1.0] * 16,
})

info_data = pd.DataFrame({
    0: ["Name", "Slug", "Surface", "Category", "Location", "StartDate", "EndDate", "Status"],
    1: [
        "Example Open 2026",
        "example-2026",
        "Hard (Indoor)",
        "ATP 250",
        "Example City, USA",
        "2026-03-01",
        "2026-03-07",
        "Upcoming",
    ],
})

with pd.ExcelWriter(output_path, engine="openpyxl") as writer:
    draw_data.to_excel(writer, sheet_name="Draw", index=False)
    info_data.to_excel(writer, sheet_name="Info", index=False, header=False)

print(f"Template created: {output_path}")
print(f"""
Draw sheet columns:
  DrawPosition  - 1-based position in the bracket (1 = top of draw)
  Player        - Full player name
  Seed          - Seed number (leave blank for unseeded)
  Elo           - Elo rating (numeric)
  Factor        - Optional multiplier on Elo (default 1.0, leave blank)

Info sheet (two columns, no header):
  Name          - Tournament full name
  Slug          - URL slug (lowercase, hyphens, e.g. dallas-2026)
  Surface       - Surface type (e.g. Hard, Clay, Grass, Hard (Indoor))
  Category      - Tournament category (e.g. ATP 250, ATP 500, ATP 1000, Grand Slam)
  Location      - City, Country
  StartDate     - YYYY-MM-DD
  EndDate       - YYYY-MM-DD
  Status        - "Upcoming", "In Progress", or "Completed"
""")
