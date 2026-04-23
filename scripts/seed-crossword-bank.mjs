/**
 * Seed the crossword entry library (idempotent).
 * Run: node --env-file=.env.local scripts/seed-crossword-bank.mjs
 */
import connectDB from "../src/lib/mongodb.js";
import CrosswordEntry from "../src/models/CrosswordEntry.js";

function normAnswer(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

const entries = [
  { answer: "HONESTY", clue: "A spiritual principle (Step 1)", tags: ["recovery", "steps"] },
  { answer: "HOPE", clue: "A gift often found after surrender", tags: ["recovery"] },
  { answer: "FAITH", clue: "Trust in a Power greater than yourself", tags: ["recovery", "steps"] },
  { answer: "COURAGE", clue: "What you ask for (Step 7 prayer)", tags: ["recovery", "steps"] },
  { answer: "INTEGRITY", clue: "Doing the next right thing, even unseen", tags: ["recovery"] },
  { answer: "WILLINGNESS", clue: "The quality that makes change possible", tags: ["recovery"] },
  { answer: "SURRENDER", clue: "Letting go of the fight", tags: ["recovery"] },
  { answer: "GIVE", clue: "AA principle: to keep it, you must ___ it away", tags: ["recovery"] },
  { answer: "SPONSOR", clue: "A guide through the Steps", tags: ["recovery"] },
  { answer: "MEETING", clue: "Where we share experience, strength, and hope", tags: ["recovery"] },
  { answer: "FELLOWSHIP", clue: "Community of people recovering together", tags: ["recovery"] },
  { answer: "GRATITUDE", clue: "An antidote to resentment", tags: ["recovery"] },
  { answer: "HUMILITY", clue: "Seeing yourself accurately", tags: ["recovery"] },
  { answer: "PATIENT", clue: "One day at a time, be ___", tags: ["recovery"] },
  { answer: "PRAYER", clue: "Talking with your Higher Power", tags: ["recovery"] },
  { answer: "MEDITATION", clue: "Quiet practice to improve conscious contact", tags: ["recovery", "steps"] },
  { answer: "AMENDS", clue: "Step 9 actions", tags: ["recovery", "steps"] },
  { answer: "INVENTORY", clue: "Step 4: take a moral ___", tags: ["recovery", "steps"] },
  { answer: "RESENTMENT", clue: "Often called the 'number one offender'", tags: ["recovery"] },
  { answer: "DEFECTS", clue: "Step 6: ready to have these removed", tags: ["recovery", "steps"] },
  { answer: "CHARACTER", clue: "Step 6 focuses on defects of ___", tags: ["recovery", "steps"] },
  { answer: "HALT", clue: "Hungry, Angry, Lonely, Tired (abbr.)", tags: ["recovery", "tools"] },
  { answer: "ODAT", clue: "One day at a time (abbr.)", tags: ["recovery", "tools"] },
  { answer: "SLOGAN", clue: "Short recovery saying like 'Easy Does It'", tags: ["recovery"] },
  { answer: "STEPS", clue: "The 12 actions of AA", tags: ["recovery"] },
  { answer: "TRADITIONS", clue: "The 12 principles that keep groups healthy", tags: ["recovery"] },
  { answer: "PROMISES", clue: "What we may experience as we recover", tags: ["recovery"] },
  { answer: "BIGBOOK", clue: "Foundational AA text (two words)", tags: ["recovery", "literature"] },
  { answer: "TWELVESTEPS", clue: "AA program of recovery (two words)", tags: ["recovery"] },
  { answer: "TWELVETRADITIONS", clue: "Guiding principles for groups (two words)", tags: ["recovery"] },
  { answer: "TWELVECONCEPTS", clue: "Guides world services (two words)", tags: ["recovery"] },
  { answer: "SERENITY", clue: "As in the Serenity Prayer", tags: ["recovery"] },
  { answer: "ACCEPTANCE", clue: "It is the answer to all my problems today", tags: ["recovery"] },
  { answer: "FORGIVENESS", clue: "Letting go of the debt", tags: ["recovery"] },
  { answer: "REPRIEVE", clue: "A daily ___ contingent on spiritual condition", tags: ["recovery", "literature"] },
  { answer: "CONSCIOUS", clue: "Step 11: improve ___ contact", tags: ["recovery", "steps"] },
  { answer: "CONTACT", clue: "Step 11: conscious ___", tags: ["recovery", "steps"] },
  { answer: "AWAKENING", clue: "Step 12: a spiritual ___", tags: ["recovery", "steps"] },
  { answer: "CARRY", clue: "Step 12: ___ the message", tags: ["recovery", "steps"] },
  { answer: "MESSAGE", clue: "Step 12: carry the ___", tags: ["recovery", "steps"] },
  { answer: "TRUST", clue: "What grows when you keep showing up", tags: ["recovery"] },
  { answer: "OPENMINDED", clue: "Willing to consider a new way", tags: ["recovery"] },
  { answer: "UNITY", clue: "Tradition 1: our common welfare should come first; personal recovery depends upon AA ___", tags: ["recovery", "traditions"] },
  { answer: "ANONYMITY", clue: "A spiritual foundation of all traditions", tags: ["recovery", "traditions"] },
  { answer: "PRINCIPLES", clue: "Anonymity: principles before ___", tags: ["recovery"] },
  { answer: "PERSONALITIES", clue: "Anonymity: principles before ___", tags: ["recovery"] },
  { answer: "SOBRIETY", clue: "Freedom from alcohol", tags: ["recovery"] },
  { answer: "RECOVERY", clue: "One of AA's three legacies", tags: ["recovery"] },
  { answer: "HOMEGROUP", clue: "Where you have a vote and a job", tags: ["recovery"] },
  { answer: "LITERATURE", clue: "Big Book and 12&12, for short", tags: ["recovery"] },
  { answer: "CHIP", clue: "A sobriety token", tags: ["recovery"] },
  { answer: "NEWCOMER", clue: "The most important person in the room", tags: ["recovery"] },
  { answer: "SPIRITUAL", clue: "AA is a ___ program", tags: ["recovery"] },
  { answer: "PRINCIPLE", clue: "A spiritual ___", tags: ["recovery"] },
  { answer: "TRUTH", clue: "What we practice, not just talk about", tags: ["recovery"] },
  { answer: "LISTEN", clue: "A meeting skill: first, ___", tags: ["recovery"] },
  { answer: "SHARE", clue: "Experience, strength, and hope", tags: ["recovery"] },

  // More recovery vocabulary (50+ total)
  { answer: "SPIRITUALITY", clue: "Broad term for inner life and meaning", tags: ["recovery"] },
  { answer: "FREEDOM", clue: "What sobriety can bring", tags: ["recovery"] },
  { answer: "PEACE", clue: "Often sought in the Serenity Prayer", tags: ["recovery"] },
  { answer: "SANITY", clue: "Step 2: restore to ___", tags: ["recovery", "steps"] },
  { answer: "POWERLESS", clue: "Step 1: we admitted we were ___", tags: ["recovery", "steps"] },
  { answer: "UNMANAGEABLE", clue: "Step 1: life had become ___", tags: ["recovery", "steps"] },
  { answer: "DECISION", clue: "Step 3: made a ___", tags: ["recovery", "steps"] },
  { answer: "WILL", clue: "Step 3: turn our ___ and our lives over", tags: ["recovery", "steps"] },
  { answer: "LIVES", clue: "Step 3: turn our will and our ___ over", tags: ["recovery", "steps"] },
  { answer: "ADMITTED", clue: "Step 5 begins: we ___ to God, to ourselves, and another human being", tags: ["recovery", "steps"] },
  { answer: "READY", clue: "Step 6: entirely ___", tags: ["recovery", "steps"] },
  { answer: "HUMBLY", clue: "Step 7 begins: ___ asked Him to remove our shortcomings", tags: ["recovery", "steps"] },
  { answer: "SHORTCOMINGS", clue: "Step 7: remove our ___", tags: ["recovery", "steps"] },
  { answer: "LIST", clue: "Step 8: made a ___ of all persons we had harmed", tags: ["recovery", "steps"] },
  { answer: "HARMED", clue: "Step 8: persons we had ___", tags: ["recovery", "steps"] },
  { answer: "DIRECT", clue: "Step 9: made ___ amends", tags: ["recovery", "steps"] },
  { answer: "CONTINUED", clue: "Step 10 begins: ___ to take personal inventory", tags: ["recovery", "steps"] },
  { answer: "ADMITTED", clue: "Step 10: when we were wrong promptly ___ it", tags: ["recovery", "steps"] },
  { answer: "SOUGHT", clue: "Step 11 begins: ___ through prayer and meditation", tags: ["recovery", "steps"] },
  { answer: "KNOWLEDGE", clue: "Step 11: for ___ of His will for us", tags: ["recovery", "steps"] },
  { answer: "CARRY", clue: "Step 12: to ___ this message", tags: ["recovery", "steps"] },
  { answer: "PRACTICE", clue: "Step 12: to ___ these principles", tags: ["recovery", "steps"] },
  { answer: "PRINCIPLES", clue: "Step 12: practice these ___ in all our affairs", tags: ["recovery", "steps"] },
  { answer: "AFFAIRS", clue: "Step 12: in all our ___", tags: ["recovery", "steps"] },
  { answer: "TRUSTEDSERVANT", clue: "AA leader: ___ (two words)", tags: ["recovery"] },
  { answer: "GSR", clue: "General Service Representative (abbr.)", tags: ["recovery", "service"] },
  { answer: "HIGHERPOWER", clue: "Spiritual concept in recovery (two words)", tags: ["recovery"] },
  { answer: "TWELVEANDTWELVE", clue: "Common name for AA's '12&12' book", tags: ["recovery", "literature"] },
  { answer: "SPONSORSHIP", clue: "Guidance relationship in AA", tags: ["recovery"] },
  { answer: "STEPWORK", clue: "Doing the Steps, for short", tags: ["recovery"] },
  { answer: "STAY", clue: "Slogan: '___ in the day'", tags: ["recovery"] },
  { answer: "TRIGGER", clue: "Something that can spark a craving", tags: ["recovery"] },
  { answer: "CRAVING", clue: "Strong urge to drink or use", tags: ["recovery"] },
  { answer: "RELAPSE", clue: "A return to drinking after sobriety", tags: ["recovery"] },
  { answer: "WITHDRAWAL", clue: "Early sobriety symptom for some", tags: ["recovery"] },
  { answer: "BOUNDARIES", clue: "Healthy limits in relationships", tags: ["recovery"] },
  { answer: "ACCOUNTABILITY", clue: "Being answerable to others and yourself", tags: ["recovery"] },
  { answer: "FELLOWSHIP", clue: "Community support in AA", tags: ["recovery"] },
  { answer: "SPIRITUALCONDITION", clue: "Big Book: daily reprieve depends on this (two words)", tags: ["recovery", "literature"] },
];

// Ensure 50+ unique normalized answers.
const dedup = new Map();
for (const e of entries) {
  const key = normAnswer(e.answer);
  if (!key) continue;
  if (!dedup.has(key)) dedup.set(key, e);
}
const finalEntries = Array.from(dedup.values());

await connectDB();

let upserted = 0;
for (const e of finalEntries) {
  const answerNormalized = normAnswer(e.answer);
  await CrosswordEntry.updateOne(
    { answerNormalized },
    {
      $setOnInsert: {
        answer: e.answer,
        answerNormalized,
        clue: e.clue,
        tags: e.tags || ["recovery"],
        difficulty: 2,
        enabled: true,
      },
    },
    { upsert: true },
  );
  upserted++;
}

console.log(`Crossword bank seed complete. Attempted upserts: ${upserted}.`);
process.exit(0);

