import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isOnTopicQuery,
  priorUserTurnWasOnTopic,
  tokenizeQuery,
} from "./siteSearchTopic.js";

describe("isOnTopicQuery", () => {
  it("accepts meeting and AA questions", () => {
    assert.equal(isOnTopicQuery("When are the weekday meetings?"), true);
    assert.equal(isOnTopicQuery("What is AA?"), true);
    assert.equal(isOnTopicQuery("How do I get sober?"), true);
    assert.equal(isOnTopicQuery("I'm new — what should I expect?"), true);
    assert.equal(isOnTopicQuery("Tell me about Sunrise Semester"), true);
  });

  it("accepts drug/alcohol recovery phrasing", () => {
    assert.equal(isOnTopicQuery("Is this for drug addiction too?"), true);
    assert.equal(isOnTopicQuery("I want to stop drinking"), true);
  });

  it("rejects unrelated general knowledge", () => {
    assert.equal(isOnTopicQuery("how do I make a pancake?"), false);
    assert.equal(isOnTopicQuery("What is the weather in Boston?"), false);
    assert.equal(isOnTopicQuery("Who won the Super Bowl?"), false);
    assert.equal(isOnTopicQuery("Write a poem about cats"), false);
  });

  it("accepts strong retrieval hits even without keyword list terms", () => {
    assert.equal(
      isOnTopicQuery("where is that pdf", [{ score: 4, title: "Resources" }]),
      true,
    );
  });

  it("allows short clarifiers only after an on-topic turn", () => {
    assert.equal(
      isOnTopicQuery("what about saturday?", [], { priorOnTopic: true }),
      true,
    );
    assert.equal(
      isOnTopicQuery("how do I make a pancake?", [], { priorOnTopic: true }),
      false,
    );
  });
});

describe("priorUserTurnWasOnTopic", () => {
  it("detects an earlier on-topic user message", () => {
    const messages = [
      { role: "user", parts: [{ type: "text", text: "When are meetings?" }] },
      { role: "assistant", parts: [{ type: "text", text: "Weekdays…" }] },
      { role: "user", parts: [{ type: "text", text: "what about saturday?" }] },
    ];
    assert.equal(priorUserTurnWasOnTopic(messages), true);
  });
});

describe("tokenizeQuery", () => {
  it("expands newcomer-related wording", () => {
    const tokens = tokenizeQuery("I'm new what should I expect");
    assert.ok(tokens.includes("newcomer"));
  });
});
