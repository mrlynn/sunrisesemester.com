import { NextResponse } from "next/server";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  toUIMessageStream,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import {
  buildFallbackMeetingOpening,
  buildMeetingTopicPrompt,
  selectMeetingTopic,
  validateMeetingTopicRequest,
} from "@/lib/meetingTopics";

function writeTopicMetadata(writer, seed, fallback) {
  writer.write({
    type: "data-topic",
    data: {
      id: seed.id,
      title: seed.title,
      fallback,
    },
  });
}

function writeFallback(writer, seed, request) {
  const textId = `fallback-${seed.id}`;
  writeTopicMetadata(writer, seed, true);
  writer.write({ type: "text-start", id: textId });
  writer.write({
    type: "text-delta",
    id: textId,
    delta: buildFallbackMeetingOpening(seed, request),
  });
  writer.write({ type: "text-end", id: textId });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const topicRequest = validateMeetingTopicRequest(body?.topicRequest);
    const seed = selectMeetingTopic(topicRequest);

    const ip = clientIp(request);
    const limited = await checkRateLimit(`meeting-topics:${ip}`, {
      limit: 20,
      windowMs: 60 * 60 * 1000,
    });
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many topic requests from this network. Please try again later." },
        { status: 429 },
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      const fallbackStream = createUIMessageStream({
        execute: ({ writer }) => writeFallback(writer, seed, topicRequest),
      });
      return createUIMessageStreamResponse({ stream: fallbackStream });
    }

    const modelId = process.env.OPENAI_MODEL || "gpt-5.4-mini";
    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        writeTopicMetadata(writer, seed, false);
        const result = streamText({
          model: openai(modelId),
          system:
            "You help an Alcoholics Anonymous meeting chair prepare a safe, welcoming discussion opening. Follow the supplied approved seed and constraints exactly.",
          prompt: buildMeetingTopicPrompt(seed, topicRequest),
          maxOutputTokens: 900,
          temperature: 0.4,
        });
        writer.merge(toUIMessageStream({ stream: result.stream }));
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof TypeError) {
      return NextResponse.json(
        { error: error.message || "Choose valid topic options." },
        { status: 400 },
      );
    }
    console.error("meeting topic route error:", error);
    return NextResponse.json(
      { error: "A meeting topic could not be prepared right now." },
      { status: 500 },
    );
  }
}
