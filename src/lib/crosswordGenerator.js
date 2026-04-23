import { validateCrosswordData } from "@/lib/crosswordValidation";

function normAnswer(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildDataFromPlacements(placements) {
  const across = {};
  const down = {};
  let nA = 1;
  let nD = 1;
  for (const p of placements) {
    const entry = {
      clue: p.clue,
      answer: p.answer,
      row: p.row,
      col: p.col,
    };
    if (p.dir === "across") {
      across[String(nA++)] = entry;
    } else {
      down[String(nD++)] = entry;
    }
  }
  return { across, down };
}

export function generateCrosswordFromEntries(rawEntries, { targetWords = 10 } = {}) {
  const entries = rawEntries
    .map((e) => ({
      clue: String(e.clue || "").trim(),
      answer: normAnswer(e.answer),
    }))
    .filter((e) => e.clue && e.answer.length >= 3)
    .sort((a, b) => b.answer.length - a.answer.length);

  if (entries.length < 2) {
    return { ok: false, error: "Need at least 2 entries (answers length >= 3) to generate." };
  }

  function attemptOnce() {
    // Grid: Map "r,c" => letter
    const grid = new Map();
    const placements = [];

    function hasCell(r, c) {
      return grid.has(`${r},${c}`);
    }

    function canPlace(dir, row, col, answer) {
      const len = answer.length;

      // Don't allow words to touch end-to-end.
      if (dir === "across") {
        if (hasCell(row, col - 1) || hasCell(row, col + len)) return false;
      } else {
        if (hasCell(row - 1, col) || hasCell(row + len, col)) return false;
      }

      for (let i = 0; i < answer.length; i++) {
        const r = dir === "across" ? row : row + i;
        const c = dir === "across" ? col + i : col;
        const k = `${r},${c}`;
        const existing = grid.get(k);
        if (existing && existing !== answer[i]) return false;

        // Prevent adjacent parallel words that create unintended (unclued) letter runs.
        // Rule: if this cell is NEW (not an intersection), it can't touch letters
        // perpendicular to the placed direction.
        const isNewCell = !existing;
        if (isNewCell) {
          if (dir === "across") {
            if (hasCell(r - 1, c) || hasCell(r + 1, c)) return false;
          } else {
            if (hasCell(r, c - 1) || hasCell(r, c + 1)) return false;
          }
        }
      }
      return true;
    }

    function doPlace(dir, row, col, clue, answer) {
      for (let i = 0; i < answer.length; i++) {
        const r = dir === "across" ? row : row + i;
        const c = dir === "across" ? col + i : col;
        grid.set(`${r},${c}`, answer[i]);
      }
      placements.push({ dir, row, col, clue, answer });
    }

    // Seed with the longest word across at (0,0).
    const seed = entries[0];
    doPlace("across", 0, 0, seed.clue, seed.answer);

    const remaining = shuffle(entries.slice(1));

    function gridCells() {
      const out = [];
      for (const [k, v] of grid.entries()) {
        const [r, c] = k.split(",").map((x) => Number(x));
        out.push({ r, c, ch: v });
      }
      return out;
    }

    for (const e of remaining) {
      if (placements.length >= targetWords) break;
      let placed = false;

      const cells = gridCells();
      // Try to intersect on matching letters.
      for (let li = 0; li < e.answer.length && !placed; li++) {
        const letter = e.answer[li];
        for (const cell of cells) {
          if (cell.ch !== letter) continue;
          for (const dir of ["across", "down"]) {
            const startRow = dir === "across" ? cell.r : cell.r - li;
            const startCol = dir === "across" ? cell.c - li : cell.c;
            if (startRow < -30 || startCol < -30 || startRow > 30 || startCol > 30) continue;
            if (!canPlace(dir, startRow, startCol, e.answer)) continue;
            doPlace(dir, startRow, startCol, e.clue, e.answer);
            placed = true;
            break;
          }
          if (placed) break;
        }
      }
    }

    // Normalize coordinates to start at 0,0.
    let minR = Infinity;
    let minC = Infinity;
    for (const p of placements) {
      minR = Math.min(minR, p.row);
      minC = Math.min(minC, p.col);
    }
    const normalized = placements.map((p) => ({
      ...p,
      row: p.row - minR,
      col: p.col - minC,
    }));

    const crosswordData = buildDataFromPlacements(normalized);
    const valid = validateCrosswordData(crosswordData);
    if (!valid.ok) {
      return { ok: false, error: `Generated puzzle invalid: ${valid.error}` };
    }

    return { ok: true, crosswordData, placedWords: normalized.length };
  }

  // Try multiple times to find a valid layout under strict crossword rules.
  let lastErr = "Unknown error.";
  let best = null;
  for (let i = 0; i < 25; i++) {
    const res = attemptOnce();
    if (res.ok) return res;
    lastErr = res.error || lastErr;
    // Keep the most-filled attempt for debugging.
    if (!best || (res.placedWords || 0) > (best.placedWords || 0)) {
      best = res;
    }
  }
  return { ok: false, error: lastErr };
}

