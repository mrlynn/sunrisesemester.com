/**
 * One-time (or idempotent) seed for Atlas.
 * Run: node --env-file=.env.local scripts/seed.mjs
 */
import connectDB from "../src/lib/mongodb.js";
import Landing from "../src/models/Landing.js";
import Story from "../src/models/Story.js";

await connectDB();

await Landing.updateOne(
  { key: "main" },
  {
    $setOnInsert: {
      key: "main",
      heroTitle: "Sunrise Semester",
      heroSubtitle: "A home group of Alcoholics Anonymous",
      body: `Welcome to our group site.

This block is **Markdown**. Edit it anytime from the editor after you sign in.`,
    },
  },
  { upsert: true },
);

console.log("Landing document is ready in MongoDB (upserted if missing).");

const sampleStory = {
  slug: "first-light",
  title: "First Light",
  author: "Anonymous · 12 years sober",
  excerpt:
    "I used to hate mornings. Now I set the alarm for 7:00 AM because there's somewhere I need to be — and somewhere I want to be.",
  coverImage:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80&auto=format&fit=crop",
  coverImageCredit: "Krisztian Tabori on Unsplash",
  coverImageCreditUrl: "https://unsplash.com/@tkrisztian95",
  published: true,
  body: `The first time I logged on to Sunrise Semester, I left my camera off and my microphone muted. It was 7:14 AM. I had not slept. I had, in the strictest sense, "done my last one" — which is a phrase I had used before and would have laughed at from anyone else.

But that morning I needed to hear a voice that wasn't in my own head.

## What I thought I was walking into

I'll be honest: I expected a lecture. I expected a room full of people who had figured something out that I hadn't, and who were going to explain it to me very slowly. I had enough pride to resent that in advance.

Instead I heard a woman in Brooklyn talk about feeding her cat. She said she had woken up that morning and had not wanted to take a drink and this was, for her, a miracle worth reporting. Nobody disagreed. Nobody asked her to elaborate. Someone said "thanks for sharing," the next person unmuted, and the meeting kept going.

I thought, *that is the weirdest thing I've ever heard.*

I came back the next morning.

## What actually happened

Nothing dramatic, at first. I showed up. I listened. After about a week I unmuted to say my name. After about a month I shared something true. After about a year I realized I had not been drunk on my birthday for the first time since I was nineteen.

There is a line from the Big Book that I did not understand for a long time:

> We are not cured of alcoholism. What we really have is a daily reprieve contingent on the maintenance of our spiritual condition.

The word that got me was **daily**. Not *done*, not *fixed*, not *graduated*. Daily. Like feeding a cat. Like logging on to Zoom at 7:14 AM.

## The part I didn't expect

Sobriety, for me, was not the hardest thing. Staying available to other people was. I had spent most of my drinking life protecting myself from being known. Sunrise Semester kept asking me to show up, and then it kept *letting* me show up — even on the mornings when I didn't feel like I had anything to give.

That is what a home group turns out to be. Not a place you go to be fixed. A place you go to be useful to the person who hasn't found it yet.

---

If you're reading this on the fence, here is the only thing I can tell you that I know for sure:

**Just come to one meeting.** The link is on the Meetings page. Don't turn your camera on. Don't say a word. Just listen. If you hate it, you have lost one hour. If you don't, you have found something some of us spent a long time looking for.

The sun comes up either way. You might as well have company.`,
};

await Story.updateOne(
  { slug: sampleStory.slug },
  { $setOnInsert: sampleStory },
  { upsert: true },
);

console.log(`Story "${sampleStory.slug}" ready in MongoDB (upserted if missing).`);

process.exit(0);
