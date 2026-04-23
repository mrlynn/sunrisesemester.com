function normAnswer(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function toInt(n) {
  const x = Number(n);
  return Number.isFinite(x) ? Math.floor(x) : null;
}

export function validateCrosswordData(data) {
  const MIN_WORD_LEN = 3;
  if (!data || typeof data !== "object") {
    return { ok: false, error: "crosswordData must be an object." };
  }
  const across = data.across && typeof data.across === "object" ? data.across : null;
  const down = data.down && typeof data.down === "object" ? data.down : null;
  if (!across || !down) {
    return { ok: false, error: "crosswordData must include { across: {...}, down: {...} }." };
  }

  const used = new Map(); // "r,c" => letter
  const entries = [];

  function addEntry(direction, number, entry) {
    const clue = String(entry?.clue ?? "").trim();
    const rawAnswer = entry?.answer;
    const answer = normAnswer(rawAnswer);
    const row = toInt(entry?.row);
    const col = toInt(entry?.col);

    if (!clue) return { ok: false, error: `${direction} ${number}: clue is required.` };
    if (!answer) return { ok: false, error: `${direction} ${number}: answer is required.` };
    if (answer.length < MIN_WORD_LEN) {
      return { ok: false, error: `${direction} ${number}: answer must be at least ${MIN_WORD_LEN} letters.` };
    }
    if (row === null || col === null || row < 0 || col < 0) {
      return { ok: false, error: `${direction} ${number}: row/col must be non-negative integers.` };
    }

    // Place letters and check overlaps.
    for (let i = 0; i < answer.length; i++) {
      const r = direction === "across" ? row : row + i;
      const c = direction === "across" ? col + i : col;
      const key = `${r},${c}`;
      const ch = answer[i];
      const prior = used.get(key);
      if (prior && prior !== ch) {
        return {
          ok: false,
          error: `Conflict at row ${r}, col ${c}: "${prior}" vs "${ch}" (${direction} ${number}).`,
        };
      }
      used.set(key, ch);
    }

    entries.push({ direction, number: String(number), clue, answer, row, col });
    return { ok: true };
  }

  for (const [num, entry] of Object.entries(across)) {
    const r = addEntry("across", num, entry);
    if (!r.ok) return r;
  }
  for (const [num, entry] of Object.entries(down)) {
    const r = addEntry("down", num, entry);
    if (!r.ok) return r;
  }

  if (entries.length === 0) {
    return { ok: false, error: "crosswordData has no clues." };
  }

  // Ensure at least one intersection (optional but helpful for "crossword-ness").
  const counts = new Map();
  for (const k of used.keys()) {
    counts.set(k, 0);
  }
  for (const e of entries) {
    for (let i = 0; i < e.answer.length; i++) {
      const r = e.direction === "across" ? e.row : e.row + i;
      const c = e.direction === "across" ? e.col + i : e.col;
      const key = `${r},${c}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  const intersections = Array.from(counts.values()).filter((n) => n >= 2).length;
  if (intersections === 0) {
    return { ok: false, error: "No intersections found between across and down answers." };
  }

  // Crossword rule: every contiguous run of letters across/down must be a clued entry.
  // If two down answers are adjacent, they can accidentally form an unclued across word, etc.
  const usedSet = new Set(used.keys());

  function hasCell(r, c) {
    return usedSet.has(`${r},${c}`);
  }

  function findRuns(direction) {
    const runs = [];
    for (const key of usedSet) {
      const [rStr, cStr] = key.split(",");
      const r = Number(rStr);
      const c = Number(cStr);
      const isStart =
        direction === "across"
          ? hasCell(r, c) && !hasCell(r, c - 1) && hasCell(r, c + 1)
          : hasCell(r, c) && !hasCell(r - 1, c) && hasCell(r + 1, c);
      if (!isStart) continue;

      let len = 1;
      while (
        direction === "across"
          ? hasCell(r, c + len)
          : hasCell(r + len, c)
      ) {
        len += 1;
      }
      if (len >= MIN_WORD_LEN) {
        runs.push({ direction, row: r, col: c, len });
      } else {
        // We explicitly disallow 2-letter "words" in this system.
        return {
          ok: false,
          error: `Found a ${len}-letter ${direction} run at row ${r}, col ${c}. Add a clue/answer or adjust spacing.`,
        };
      }
    }
    return { ok: true, runs };
  }

  const aRuns = findRuns("across");
  if (!aRuns.ok) return aRuns;
  const dRuns = findRuns("down");
  if (!dRuns.ok) return dRuns;

  const runKeys = new Set(
    [...aRuns.runs, ...dRuns.runs].map((x) => `${x.direction}:${x.row},${x.col}:${x.len}`),
  );
  const entryKeys = new Set(
    entries.map((e) => `${e.direction}:${e.row},${e.col}:${e.answer.length}`),
  );

  for (const k of runKeys) {
    if (!entryKeys.has(k)) {
      const [dir, rest] = k.split(":");
      const [pos, lenStr] = rest.split(":");
      const [row, col] = pos.split(",").map((n) => Number(n));
      const len = Number(lenStr);
      return {
        ok: false,
        error: `Unclued ${dir} word (len ${len}) starts at row ${row}, col ${col}. Add it as an entry or separate the words.`,
      };
    }
  }
  for (const k of entryKeys) {
    if (!runKeys.has(k)) {
      return {
        ok: false,
        error: `Entry does not match a contiguous run: ${k}. Check that answers don't touch/merge into larger words.`,
      };
    }
  }

  return { ok: true };
}

