/**
 * One-time (or idempotent) seed for Atlas.
 * Run: node --env-file=.env.local scripts/seed.mjs
 */
import connectDB from "../src/lib/mongodb.js";
import Landing from "../src/models/Landing.js";
import Story from "../src/models/Story.js";
import Anniversary from "../src/models/Anniversary.js";
import ServiceRole from "../src/models/ServiceRole.js";

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

const moreStories = [
  {
    slug: "the-quiet-part",
    title: "The Quiet Part",
    author: "Miriam L. · 18 months sober",
    excerpt:
      "I thought AA was for people who wanted to talk about themselves. It turns out it's mostly for people who needed to be quiet for a while and couldn't manage it alone.",
    coverImage:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1600&q=80&auto=format&fit=crop",
    coverImageCredit: "Kalen Emsley on Unsplash",
    coverImageCreditUrl: "https://unsplash.com/@kalenemsley",
    published: true,
    body: `I am an introvert. That is one of the three things I used drinking to manage. The other two are harder to put on a webpage.

For the first two months at Sunrise Semester I did not unmute. I don't think anyone pressured me to. I don't remember anyone even noticing. What I remember is the feeling of being in a room — a rectangular grid of a room, thirty-five little squares of faces — and not being the one expected to carry it.

That is not a small thing. I had spent two decades being the one expected to carry it.

## What it was like before

I drank because parties were unbearable and the wine made them bearable. That is the short version. The long version involves a lot of rehearsed small talk, a lot of arriving late so nobody would notice when I started, and one stretch in my early thirties where I genuinely believed my personality was the alcohol. If you took it away, what remained would not be worth meeting.

I am going to ask you to read that last sentence again, because it took me a long time to say it out loud, and it took me longer to hear myself say it.

## What Sunrise Semester gave me

Permission to be quiet. That is the honest answer.

There's a thing people say in recovery about "getting out of your own head." For a lot of us that means learning to talk to other humans. For me it meant the opposite: learning that I could sit with other humans without performing for them, and they would still be there the next morning, and I would too.

I started sharing at three months. I cried the first time. Nobody fixed it. Someone said "thanks Miriam" and the next person went. That was it. That was the intervention. Somebody had heard me and then they had *kept going* — had given me the enormous gift of not making me the center of anything.

## What I would say to you

If you're the person I was — the one who has been told their whole life to speak up, and has found a chemical that makes speaking up tolerable, and is now discovering that the chemical is also killing them — I want you to know something.

There is a meeting where you don't have to talk.

There is a meeting where you can listen for a month.

There is a meeting where the expectation is not that you entertain the room but that you stay alive until tomorrow morning, and the room will be here tomorrow morning too.

I'll see you there. I won't make you say anything.`,
  },
  {
    slug: "nothing-left-to-manage",
    title: "Nothing Left to Manage",
    author: "David P. · 4 years sober",
    excerpt:
      "Every relapse, I told myself I had learned something. On the fourth one, a woman in my meeting asked whether I had considered that I might be out of runway.",
    coverImage:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=80&auto=format&fit=crop",
    coverImageCredit: "Johannes Plenio on Unsplash",
    coverImageCreditUrl: "https://unsplash.com/@jplenio",
    published: true,
    body: `I am what AA calls a chronic slipper. I came in the first time at twenty-six, worked the steps halfway, got a promotion, decided I had overreacted, and picked up again. That cycle repeated four times over the next decade. Each time the gaps got shorter. Each time I was more convinced I had figured it out.

I want to talk about the fourth one, because it is the one that stuck.

## The pattern

Relapse did not feel like failure to me. It felt like *research*. I would come back to the rooms with a new theory — it was the stress, it was the job, it was my ex, it was my genetics, it was that I had tried to moderate instead of abstaining, it was that I hadn't really bottomed. I had an explanation for each one, and inside each explanation was the quiet assumption that next time I would manage it.

The thing about being a manager of your own drinking is that the management eats up all the available energy in your life. I managed my drinking the way other people run a company. I had dashboards. I had risk assessments. I had contingency plans. I had a spreadsheet, actually, though I would die before admitting that in a share.

What I did not have, by the time I was thirty-six, was a marriage or a liver enzyme in the normal range.

## What she said

A woman named Eileen — I can name her because she is ten years gone now and she would have wanted to be named — asked me after a meeting whether I had considered that I might be out of runway.

I said what do you mean.

She said you've been coming in and out of here for ten years. You have an answer every time. At some point the answers stop working because the body stops working. She said it without drama. She said it the way a mechanic tells you a car is done.

I did not take a drink after that conversation. That was four years ago.

## What surrender actually was

I had always thought of surrender as a dramatic event. Falling to my knees. The moment of clarity. What it turned out to be, for me, was much smaller and much more boring: I ran out of explanations. There was no new theory left to try. The management had failed on every possible axis. All that remained was to stop pretending I was in charge of this and to do what the people who were sober were doing.

That is all it was. That is all it has been every day since.

## If you are the person I was

If you have been in and out of the rooms — if you have a drawer full of chips from different meetings, each one a monument to a relapse — I want to tell you the one thing I wish someone had said earlier.

You are not stupid. You are not weak. You are just out of runway, sooner than you think.

Come sit with us. We are not going to tell you that you have failed. We are going to tell you that the failing part is over, if you want it to be. The managing is done. There is nothing left for you to figure out.

Just come sit with us.`,
  },
  {
    slug: "what-my-sponsor-said",
    title: "What My Sponsor Said",
    author: "Jesse N. · 7 years sober",
    excerpt:
      "I asked her how I would know when I had done the fourth step well enough. She said 'you won't, and that's the step.' That is basically our whole relationship in one sentence.",
    coverImage:
      "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=1600&q=80&auto=format&fit=crop",
    coverImageCredit: "Nathan Dumlao on Unsplash",
    coverImageCreditUrl: "https://unsplash.com/@nate_dumlao",
    published: true,
    body: `The best thing I did in my first year was ask somebody to be my sponsor. The second best thing I did was ignore every single piece of advice I had been given about *how* to ask somebody to be my sponsor.

I had been told to find someone with what you want. I had been told to find someone who had worked all twelve. I had been told to wait until I felt "ready." I had been told a lot of things by people who meant well and who had, in most cases, not spoken to me specifically.

What I actually did was walk up to the woman whose share made me laugh the hardest in my first month and say "will you do this with me." She said yes.

Her name is Robin. She is the reason I am here.

## Things Robin has said to me

*"You don't have to feel like calling. Just call."*
I learned in year one that I could pick up the phone when I did not want to. That was the whole skill. That was it.

*"You're allowed to be wrong about yourself."*
I had a lot of very firm ideas about who I was. Robin treated those ideas like weather — interesting, not binding. Over seven years most of them have blown through.

*"Your worst day sober is still information. Your worst day drunk is just damage."*
I have quoted this to every sponsee I have had. I did not come up with it. I do not know who did. I just know that on the days when nothing works, when I am white-knuckling and miserable and convinced that sobriety has nothing to offer me — even on those days, I am learning something I could not learn drunk.

*"You are not too much for the program. You are the program."*
This one she said to me when I was about two years sober and was convinced, for the ninth or tenth time, that I was uniquely broken. I had decided that the steps had worked for everyone but me. She let me finish. Then she said the sentence above. Then she said "now pick up the book."

## What I have learned about sponsorship

Sponsorship is not a credential. Robin is not a therapist, not a priest, not a coach. She is one sober woman who agreed to take my calls and read the steps with me. That is all the job is. That is *the whole job*.

I have now sponsored four women. I have told them, on their first call, that I am not going to fix them, that I am going to return their texts, and that I am going to ask them to do exactly what Robin asked me to do. One of them quit after a month. Three of them are still sober. That is a better average than almost anything else I have attempted in my life.

## What to do if you don't have one yet

Ask someone. Not the perfect person. Not the person you are intimidated by. Not the person with the most time. Ask the person whose share you remembered on the drive home.

They will say yes. They may have been waiting for you to ask.`,
  },
  {
    slug: "service-on-a-tuesday",
    title: "Service on a Tuesday",
    author: "Ana R. · 11 years sober",
    excerpt:
      "I signed up to be the Zoom host because nobody else did. That decision turned out to contain most of what I needed to know about staying sober past year five.",
    coverImage:
      "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1600&q=80&auto=format&fit=crop",
    coverImageCredit: "Lukasz Szmigiel on Unsplash",
    coverImageCreditUrl: "https://unsplash.com/@szmigieldesign",
    published: true,
    body: `Every Tuesday for the last four years I have logged into Zoom at 6:55 AM, admitted thirty-some people from the waiting room, shared my screen with the format, and opened the meeting at 7:15. I am not a trusted servant in any official sense. I am just the person who said yes when the group asked who would do it.

I want to tell you what that job has given me, because nobody talks about this part, and I almost didn't do it.

## The year the feelings stopped

Somewhere around year five I hit what people in the rooms sometimes call the "gray years." The obsession was long gone. The gratitude was present but dull. My life was good. My meetings were familiar. The steps had been worked and reworked. I was, by every measurable metric, doing well.

And I was, if I am honest, beginning to wonder what I was still doing there.

This is not a thing people talk about much, because the program teaches us to be grateful, and gratitude is real, and gratitude is the antidote to most things. But I am going to tell you: long-term sobriety has its own quiet crisis, and the crisis is not "am I going to drink." The crisis is "is any of this still *for* me."

The answer, it turned out, was that it wasn't. It was for the next person. And I had to rearrange my relationship with the program to understand that.

## Why the hosting job fixed it

The Zoom host is not a glamorous position. You do not share first. You do not read anything. You just open the room.

But every Tuesday, at 6:55 AM, somebody new logs in before the meeting starts. They do not have their camera on. They do not say anything. They are just *there*, in the waiting room, early, because they did not know what else to do with themselves this morning.

I let them in. I say "good morning, welcome to Sunrise Semester." Nine times out of ten they do not say anything back. That is fine. I was that person once. Somebody let me in.

It is the smallest possible act of service, and it is the one that has kept me here for four years.

## What I would tell a newer member

If you are past year three and you are wondering where the feelings went: take a job. Not the visible one. The boring one. Open the room. Make the coffee (metaphorical, for us). Set up the chairs (also metaphorical). Admit people from the waiting room at 6:55 AM.

You will not feel anything dramatic. You will not have a breakthrough. You will just be useful, quietly, on a Tuesday, and at some point you will notice that the reason you are still sober is that you are still here, and the reason you are still here is that you have something small to do.

That is the whole program. That is all of it.

I'll see you next Tuesday. I'll let you in.`,
  },
];

for (const story of moreStories) {
  await Story.updateOne(
    { slug: story.slug },
    { $setOnInsert: story },
    { upsert: true },
  );
}
console.log(`${moreStories.length} additional stories upserted.`);

const sampleAnniversaries = [
  {
    name: "Margaret K.",
    sobrietyDate: new Date(Date.UTC(1991, 2, 14)),
    note: "Thirty-five years of showing up, one morning at a time.",
    published: true,
  },
  {
    name: "Tom D.",
    sobrietyDate: new Date(Date.UTC(2003, 7, 2)),
    note: "Came in sick. Stayed grateful.",
    published: true,
  },
  {
    name: "Priya S.",
    sobrietyDate: new Date(Date.UTC(2019, 10, 11)),
    note: "",
    published: true,
  },
  {
    name: "Jamie R.",
    sobrietyDate: new Date(Date.UTC(2024, 3, 28)),
    note: "Two years. Keep coming back — it works if you work it.",
    published: true,
  },
  {
    name: "Lee O.",
    sobrietyDate: new Date(Date.UTC(2025, 0, 9)),
    note: "",
    published: true,
  },
];

for (const a of sampleAnniversaries) {
  await Anniversary.updateOne(
    { name: a.name, sobrietyDate: a.sobrietyDate },
    { $setOnInsert: a },
    { upsert: true },
  );
}
console.log(`${sampleAnniversaries.length} sample anniversaries upserted.`);

const sampleServiceRoles = [
  {
    title: "Secretary",
    holder: "Margaret K.",
    email: "secretary@sunrise.example",
    description: "Opens each meeting, keeps the format on track, welcomes newcomers.",
    termLabel: "Jan–Dec 2026",
    order: 10,
    published: true,
  },
  {
    title: "Treasurer",
    holder: "Tom D.",
    email: "treasurer@sunrise.example",
    description: "Stewards the group's 7th Tradition contributions.",
    termLabel: "Jan–Dec 2026",
    order: 20,
    published: true,
  },
  {
    title: "GSR",
    holder: "Priya S.",
    email: "",
    description: "General Service Representative — our group's voice to the wider AA service structure.",
    termLabel: "Rotates July 2026",
    order: 30,
    published: true,
  },
  {
    title: "Zoom host",
    holder: "Jamie R.",
    email: "",
    description: "Admits members, manages the waiting room, keeps the meeting on-time.",
    termLabel: "Shared rotation",
    order: 40,
    published: true,
  },
  {
    title: "Newcomer greeter",
    holder: "",
    email: "newcomer@sunrise.example",
    description: "Reaches out to first-timers and offers a friendly point of contact.",
    termLabel: "Open — ask a member",
    order: 50,
    published: true,
  },
];

for (const r of sampleServiceRoles) {
  await ServiceRole.updateOne(
    { title: r.title },
    { $setOnInsert: r },
    { upsert: true },
  );
}
console.log(`${sampleServiceRoles.length} sample service roles upserted.`);

process.exit(0);
