const STOP = new Set([
  "the",
  "and",
  "for",
  "are",
  "but",
  "not",
  "you",
  "all",
  "can",
  "had",
  "her",
  "was",
  "one",
  "our",
  "out",
  "day",
  "get",
  "has",
  "him",
  "his",
  "how",
  "man",
  "now",
  "old",
  "see",
  "two",
  "way",
  "who",
  "did",
  "its",
  "let",
  "put",
  "say",
  "she",
  "too",
  "use",
  "what",
  "when",
  "where",
  "which",
  "with",
  "this",
  "that",
  "from",
  "have",
  "about",
  "into",
  "than",
  "them",
  "then",
  "there",
  "these",
  "they",
  "were",
  "will",
  "your",
  "should",
  "would",
  "could",
  "a",
  "an",
  "as",
  "at",
  "be",
  "by",
  "do",
  "if",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "so",
  "to",
  "up",
]);

/** Light synonym expansion so casual visitor phrasing hits the right docs. */
const SYNONYMS = {
  zoom: ["meetings", "join"],
  meeting: ["meetings", "schedule", "zoom"],
  meetings: ["schedule", "zoom"],
  schedule: ["meetings", "time"],
  time: ["meetings", "schedule"],
  join: ["meetings", "zoom", "newcomer"],
  first: ["newcomer"],
  beginner: ["newcomer"],
  visitor: ["newcomer"],
  newbie: ["newcomer"],
  new: ["newcomer"],
  expect: ["newcomer"],
  expecting: ["newcomer"],
  story: ["stories"],
  stories: ["story"],
  pdf: ["resources"],
  format: ["resources", "meetings"],
  chair: ["servant", "roles", "sherpa"],
  host: ["sherpa", "zoom"],
  sherpa: ["host", "guide"],
  alcohol: ["aa", "drinking"],
  alcoholic: ["aa"],
  alcoholism: ["aa"],
  drinking: ["aa", "newcomer"],
  step: ["steps", "literature"],
  steps: ["literature", "aa"],
  big: ["literature", "book"],
  book: ["literature"],
  promise: ["promises", "literature"],
  business: ["group", "service", "minutes"],
  minutes: ["business", "meetings"],
  concern: ["report"],
  safety: ["report"],
  email: ["subscribe"],
  newsletter: ["subscribe"],
  account: ["member"],
  login: ["member"],
  register: ["member"],
};

/** Terms that clearly belong to this site, AA, or recovery. */
const ON_TOPIC_TERMS = new Set([
  "aa",
  "na",
  "alcohol",
  "alcoholic",
  "alcoholics",
  "alcoholism",
  "drink",
  "drinking",
  "drunk",
  "drinks",
  "sober",
  "sobriety",
  "recovery",
  "recover",
  "addiction",
  "addict",
  "drug",
  "drugs",
  "substance",
  "relapse",
  "sponsor",
  "fellowship",
  "meeting",
  "meetings",
  "zoom",
  "newcomer",
  "sunrise",
  "semester",
  "step",
  "steps",
  "tradition",
  "traditions",
  "literature",
  "promises",
  "bigbook",
  "sherpa",
  "servant",
  "chair",
  "secretary",
  "treasurer",
  "rsvp",
  "subscribe",
  "newsletter",
  "story",
  "stories",
  "reflection",
  "reflections",
  "resource",
  "resources",
  "report",
  "concern",
  "anniversary",
  "anniversaries",
  "share",
  "craving",
  "cravings",
  "hangover",
  "blackout",
  "blackouts",
  "detox",
  "quit",
  "withdrawal",
  "member",
  "login",
  "register",
  "format",
  "formats",
  "minutes",
  "business",
  "conscience",
  "service",
  "event",
  "events",
  "group",
]);

const ON_TOPIC_PHRASES = [
  "alcoholics anonymous",
  "sunrise semester",
  "stop drinking",
  "quit drinking",
  "get sober",
  "stay sober",
  "12 steps",
  "twelve steps",
  "twelve traditions",
  "12 traditions",
  "big book",
  "daily reflection",
  "group conscience",
  "business meeting",
  "meeting format",
  "share your story",
  "our group",
  "how it works",
];

const GREETING_RE =
  /^(hi|hello|hey|good\s+morning|good\s+afternoon|good\s+evening)\b/i;

/** Short clarifiers after an on-topic turn (not open-ended "how do I …" asks). */
const FOLLOW_UP_RE =
  /^(thanks|thank you|ok|okay|yes|no|sure|and\b|also\b|what about\b|how about\b|saturday|sunday|monday|tuesday|wednesday|thursday|friday)\b/i;

export const OFF_TOPIC_REPLY =
  "I can only help with Sunrise Semester, Alcoholics Anonymous, or drug and alcohol recovery questions — for example meeting times, what to expect as a newcomer, literature, or finding something on this site.\n\nTry [Meetings](/meetings), [Newcomer](/newcomer), or [Our group](/our-group).";

export const OFF_TOPIC_MATCHES = [
  { title: "Meetings", href: "/meetings", type: "page" },
  { title: "Newcomer welcome", href: "/newcomer", type: "page" },
  { title: "Our group", href: "/our-group", type: "page" },
];

export function tokenizeQuery(query) {
  const raw = String(query || "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t));

  const expanded = new Set(raw);
  for (const token of raw) {
    const syns = SYNONYMS[token];
    if (syns) {
      for (const s of syns) expanded.add(s);
    }
  }
  return [...expanded];
}

/**
 * Whether a visitor question is in scope for the site assistant.
 * Prefer refusing when unsure — the model must not answer general knowledge.
 */
export function isOnTopicQuery(query, matches = [], { priorOnTopic = false } = {}) {
  const text = String(query || "").trim();
  if (!text) return false;
  if (GREETING_RE.test(text)) return true;

  const lower = text.toLowerCase();
  if (ON_TOPIC_PHRASES.some((phrase) => lower.includes(phrase))) return true;

  const tokens = tokenizeQuery(text);
  if (tokens.some((token) => ON_TOPIC_TERMS.has(token))) return true;

  const bestScore = matches.reduce((max, m) => Math.max(max, Number(m.score) || 0), 0);
  if (bestScore >= 2.5) return true;

  if (priorOnTopic && text.length <= 80 && FOLLOW_UP_RE.test(text)) return true;

  return false;
}

/**
 * True when any earlier user turn in this chat was on-topic.
 * Used only to allow short clarifiers, not new off-topic questions.
 */
export function priorUserTurnWasOnTopic(messages) {
  if (!Array.isArray(messages) || messages.length < 2) return false;
  for (let i = 0; i < messages.length - 1; i += 1) {
    const msg = messages[i];
    if (msg?.role !== "user") continue;
    let text = "";
    if (typeof msg.content === "string") text = msg.content;
    else if (Array.isArray(msg.parts)) {
      text = msg.parts
        .filter((p) => p?.type === "text")
        .map((p) => p.text)
        .join("\n");
    }
    if (isOnTopicQuery(text, [])) return true;
  }
  return false;
}
