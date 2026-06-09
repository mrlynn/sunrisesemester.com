import connectDB from "@/lib/mongodb";
import CrosswordEntry from "@/models/CrosswordEntry";
import { generateCrosswordFromEntries } from "@/lib/crosswordGenerator";
import { getReflectionsForDays } from "@/lib/reflections";
import {
  calendarDaysInWeek,
  formatWeekRange,
  startOfWeekMonday,
} from "@/lib/reflectionWeek";

function normAnswer(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function tokenize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

function buildReflectionCorpus(reflections) {
  const parts = [];
  for (const r of reflections) {
    if (r.title) parts.push(r.title);
    if (r.quote) parts.push(r.quote);
    if (r.reference) parts.push(r.reference);
    if (r.comment) parts.push(String(r.comment).slice(0, 800));
  }
  const text = parts.join(" ").toLowerCase();
  const tokens = new Set(tokenize(text));
  return { text, tokens };
}

function wholeWordInText(word, text) {
  if (!word || word.length < 3) return false;
  const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
  return re.test(text);
}

/**
 * Rank crossword-bank entries by overlap with a week's reflection text.
 */
export function rankBankEntriesForReflections(reflections, bankEntries) {
  const { text, tokens } = buildReflectionCorpus(reflections);
  const titles = reflections.map((r) => String(r.title || "").toLowerCase()).filter(Boolean);

  const scored = bankEntries.map((entry) => {
    const answer = normAnswer(entry.answer);
    const clue = String(entry.clue || "");
    let score = 0;

    if (answer.length >= 3) {
      if (wholeWordInText(answer.toLowerCase(), text)) {
        score += 60;
      }
      for (const title of titles) {
        if (title === answer.toLowerCase() || title.includes(answer.toLowerCase())) {
          score += 40;
        }
      }
    }

    for (const t of tokenize(clue)) {
      if (tokens.has(t)) score += 10;
    }

    for (const t of tokenize(answer)) {
      if (t.length >= 4 && tokens.has(t)) score += 12;
    }

    if (Array.isArray(entry.tags) && entry.tags.includes("recovery")) {
      score += 2;
    }

    return { entry: { clue, answer }, score, answer };
  });

  scored.sort((a, b) => b.score - a.score || b.answer.length - a.answer.length);

  const seen = new Set();
  const ranked = [];
  for (const row of scored) {
    if (!row.answer || row.answer.length < 3) continue;
    if (seen.has(row.answer)) continue;
    seen.add(row.answer);
    ranked.push(row);
  }
  return ranked;
}

function pickEntriesForGrid(ranked, bankEntries, poolSize = 28) {
  const top = ranked.filter((r) => r.score > 0).slice(0, poolSize);
  const picked = top.map((r) => r.entry);

  if (picked.length >= 12) {
    return picked;
  }

  const seen = new Set(picked.map((e) => normAnswer(e.answer)));
  for (const row of ranked) {
    if (picked.length >= poolSize) break;
    if (seen.has(row.answer)) continue;
    seen.add(row.answer);
    picked.push(row.entry);
  }

  for (const e of bankEntries) {
    if (picked.length >= poolSize) break;
    const a = normAnswer(e.answer);
    if (!a || seen.has(a)) continue;
    seen.add(a);
    picked.push({ clue: e.clue, answer: e.answer });
  }

  return picked;
}

function buildReflectionSummary(reflections, weekRangeLabel) {
  const titles = reflections
    .map((r) => String(r.title || "").trim())
    .filter(Boolean)
    .slice(0, 5);
  const titlePart =
    titles.length > 0 ? ` Themes include ${titles.join(", ")}${titles.length < reflections.length ? ", and more" : ""}.` : "";
  return `Inspired by the daily reflections for ${weekRangeLabel}.${titlePart}`;
}

/**
 * Build a weekly crossword from the seven reflections in the week of `weekOfDate`.
 */
export async function generateWeeklyCrosswordFromReflections(weekOfDate, options = {}) {
  const targetWords = Math.max(4, Math.min(20, Math.floor(Number(options.targetWords || 10))));
  const weekStart = startOfWeekMonday(weekOfDate);
  if (!weekStart) {
    return { ok: false, error: "Invalid weekOf date." };
  }

  const days = calendarDaysInWeek(weekStart);
  const reflections = await getReflectionsForDays(days);
  if (reflections.length < 3) {
    return {
      ok: false,
      error: `Need at least 3 daily reflections for this week; found ${reflections.length}. Check the reflections database.`,
    };
  }

  await connectDB();
  const bankEntries = await CrosswordEntry.find({ enabled: true })
    .select({ answer: 1, clue: 1, tags: 1 })
    .lean();

  if (bankEntries.length < 4) {
    return { ok: false, error: "Crossword bank has too few enabled entries." };
  }

  const ranked = rankBankEntriesForReflections(reflections, bankEntries);
  const entryPool = pickEntriesForGrid(ranked, bankEntries);
  const weekRangeLabel = formatWeekRange(weekStart);

  let result = generateCrosswordFromEntries(entryPool, { targetWords });
  if (!result.ok) {
    const fallback = bankEntries.map((e) => ({ clue: e.clue, answer: e.answer }));
    result = generateCrosswordFromEntries(fallback, { targetWords });
    if (!result.ok) {
      return { ok: false, error: result.error || "Could not generate a valid grid." };
    }
  }

  return {
    ok: true,
    crosswordData: result.crosswordData,
    placedWords: result.placedWords,
    weekOf: weekStart,
    weekRangeLabel,
    reflectionSummary: buildReflectionSummary(reflections, weekRangeLabel),
    reflectionThemed: true,
    reflectionsUsed: reflections.map((r) => ({
      month: r.month,
      day: r.day,
      title: r.title || "",
    })),
    matchedEntries: ranked.filter((r) => r.score > 0).length,
  };
}
