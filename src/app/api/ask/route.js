import { NextResponse } from "next/server";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import {
  OFF_TOPIC_MATCHES,
  OFF_TOPIC_REPLY,
  SITE_SEARCH_SYSTEM_PROMPT,
  buildSiteSearchContext,
  isOnTopicQuery,
  priorUserTurnWasOnTopic,
} from "@/lib/siteSearch";

function latestUserText(messages) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const msg = messages[i];
    if (msg?.role !== "user") continue;
    if (typeof msg.content === "string" && msg.content.trim()) {
      return msg.content.trim();
    }
    const parts = Array.isArray(msg.parts) ? msg.parts : [];
    const text = parts
      .filter((p) => p?.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("\n")
      .trim();
    if (text) return text;
  }
  return "";
}

function writeOffTopicReply(writer) {
  const textId = "off-topic";
  writer.write({
    type: "data-matches",
    data: { items: OFF_TOPIC_MATCHES },
  });
  writer.write({ type: "text-start", id: textId });
  writer.write({ type: "text-delta", id: textId, delta: OFF_TOPIC_REPLY });
  writer.write({ type: "text-end", id: textId });
}

export async function POST(request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Search is not configured yet." },
        { status: 503 },
      );
    }

    const ip = clientIp(request);
    const limited = await checkRateLimit(`ask:${ip}`, {
      limit: 30,
      windowMs: 60 * 60 * 1000,
    });
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many questions from this network. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    if (messages.length === 0) {
      return NextResponse.json({ error: "No message provided." }, { status: 400 });
    }

    const query = latestUserText(messages);
    if (!query) {
      return NextResponse.json({ error: "Empty question." }, { status: 400 });
    }
    if (query.length > 1000) {
      return NextResponse.json(
        { error: "Please keep questions under 1000 characters." },
        { status: 400 },
      );
    }

    const { matches, contextText } = await buildSiteSearchContext(query);
    const onTopic = isOnTopicQuery(query, matches, {
      priorOnTopic: priorUserTurnWasOnTopic(messages),
    });

    if (!onTopic) {
      const stream = createUIMessageStream({
        execute: ({ writer }) => {
          writeOffTopicReply(writer);
        },
      });
      return createUIMessageStreamResponse({ stream });
    }

    const modelId = process.env.OPENAI_MODEL || "gpt-5.4-mini";
    const matchPayload = matches.slice(0, 5).map((m) => ({
      title: m.title,
      href: m.href,
      type: m.type,
    }));

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        writer.write({
          type: "data-matches",
          data: { items: matchPayload },
        });

        const result = streamText({
          model: openai(modelId),
          system: `${SITE_SEARCH_SYSTEM_PROMPT}

Relevant site context:
${contextText || "(no strong matches — answer carefully and point people to /meetings or /newcomer)"}`,
          messages: await convertToModelMessages(messages),
          maxOutputTokens: 700,
          temperature: 0.2,
        });

        writer.merge(toUIMessageStream({ stream: result.stream }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (err) {
    console.error("ask route error:", err);
    return NextResponse.json(
      { error: err.message || "Could not answer right now." },
      { status: 500 },
    );
  }
}
