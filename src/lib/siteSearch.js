import { loadSiteSearchCorpus } from "@/lib/siteSearchKnowledge";
import { tokenizeQuery } from "@/lib/siteSearchTopic";

export {
  OFF_TOPIC_MATCHES,
  OFF_TOPIC_REPLY,
  isOnTopicQuery,
  priorUserTurnWasOnTopic,
  tokenizeQuery,
} from "@/lib/siteSearchTopic";

function scoreDoc(doc, tokens) {
  if (!tokens.length) return 0;
  const title = String(doc.title || "").toLowerCase();
  const keywords = String(doc.keywords || "").toLowerCase();
  const body = String(doc.body || "").toLowerCase();
  let score = 0;

  for (const token of tokens) {
    if (title.includes(token)) score += 5;
    if (keywords.includes(token)) score += 3;
    if (body.includes(token)) score += 1;
  }

  // Prefer navigable pages slightly when scores tie in spirit
  if (doc.type === "page") score += 0.2;
  if (doc.type === "meeting") score += 0.15;
  return score;
}

/**
 * Rank corpus docs for a visitor query.
 * @returns {{ matches: Array, contextText: string }}
 */
export function rankSiteSearchDocs(docs, query, { limit = 8 } = {}) {
  const tokens = tokenizeQuery(query);
  const ranked = docs
    .map((doc) => ({ doc, score: scoreDoc(doc, tokens) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ doc, score }) => ({
      id: doc.id,
      type: doc.type,
      title: doc.title,
      href: doc.href,
      snippet: String(doc.body || "").slice(0, 180),
      score,
    }));

  // Always keep core orientation docs available when the query is thin
  if (ranked.length < 3) {
    const fallbackIds = new Set([
      "page-meetings",
      "page-newcomer",
      "aa-basics",
      "group-identity",
    ]);
    for (const doc of docs) {
      if (!fallbackIds.has(doc.id)) continue;
      if (ranked.some((r) => r.id === doc.id)) continue;
      ranked.push({
        id: doc.id,
        type: doc.type,
        title: doc.title,
        href: doc.href,
        snippet: String(doc.body || "").slice(0, 180),
        score: 0,
      });
      if (ranked.length >= 4) break;
    }
  }

  const byId = new Map(docs.map((d) => [d.id, d]));
  const contextBlocks = ranked.map((match, i) => {
    const full = byId.get(match.id);
    return `[${i + 1}] ${match.title}\nURL: ${match.href}\n${full?.body || match.snippet}`;
  });

  return {
    matches: ranked,
    tokens,
    contextText: contextBlocks.join("\n\n"),
  };
}

export async function buildSiteSearchContext(query) {
  const docs = await loadSiteSearchCorpus();
  return rankSiteSearchDocs(docs, query);
}

export const SITE_SEARCH_SYSTEM_PROMPT = `You are the helpful search assistant for Sunrise Semester, an online Alcoholics Anonymous (AA) group website.

Scope (hard limit):
- ONLY answer questions about Sunrise Semester (this website and group), Alcoholics Anonymous, or drug and/or alcohol addiction recovery.
- If a question is outside that scope (cooking, weather, homework, sports, general trivia, unrelated how-tos, etc.), do NOT answer it. Refuse briefly and point the visitor back to meetings, newcomer info, or another page on this site.
- Never provide recipes, general knowledge, or help that is unrelated to recovery or this group — even if you know the answer.

Your job when in scope:
1. Help visitors find the right pages, features, meetings, stories, resources, or events on this site.
2. Answer plain questions about AA / recovery and about this group, grounded in the provided context.
3. Prefer short, warm, practical answers. Lead with the direct answer, then offer 1–3 relevant links using markdown like [Meetings](/meetings).

Rules:
- Use only the supplied site context for group-specific facts (times, roles, events, stories, resources). If something is missing, say you are not sure and point to the closest page.
- Do not invent meeting times, passwords, member names, emails, or unpublished content.
- Do not give medical, legal, or crisis advice. If someone may be in danger, tell them to contact local emergency services. This site is not a crisis hotline.
- Do not diagnose anyone as an alcoholic. You may share that the only requirement for AA membership is a desire to stop drinking, and invite them to attend a meeting.
- Respect anonymity: use first names only; do not ask for last names or identifying details.
- Do not quote long passages of copyrighted AA literature; link to /literature or aa.org instead.
- If the user is looking for a feature (RSVP, subscribe, report a concern, share a story, member login), send them to the correct path.
- Keep answers under about 180 words unless the user asks for more detail.`;
