import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseAdminReportPatch,
  parseReportInput,
  REPORT_CATEGORIES,
  reportSpamReason,
} from "./reports.js";

describe("parseReportInput", () => {
  it("accepts a minimal anonymous report", () => {
    const result = parseReportInput({
      category: "safety",
      subject: "Unsafe behavior",
      body: "Details here.",
    });
    assert.equal(result.ok, true);
    assert.equal(result.value.category, "safety");
    assert.equal(result.value.contactEmail, "");
    assert.equal(result.value.contactPhone, "");
  });

  it("rejects missing subject", () => {
    const result = parseReportInput({
      category: "issue",
      subject: "  ",
      body: "Something broke",
    });
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });

  it("rejects invalid category", () => {
    const result = parseReportInput({
      category: "spam",
      subject: "Hi",
      body: "Hello",
    });
    assert.equal(result.ok, false);
    assert.ok(!REPORT_CATEGORIES.includes("spam"));
  });

  it("keeps optional contact fields", () => {
    const result = parseReportInput({
      category: "question",
      subject: "Zoom link?",
      body: "Where do I find it?",
      contactEmail: "friend@example.com",
      contactPhone: "555-0100",
    });
    assert.equal(result.ok, true);
    assert.equal(result.value.contactEmail, "friend@example.com");
    assert.equal(result.value.contactPhone, "555-0100");
  });
});

describe("parseAdminReportPatch", () => {
  it("accepts status and notes updates", () => {
    const result = parseAdminReportPatch({
      status: "reviewed",
      adminNotes: "Looked into this and replied offline.",
    });
    assert.equal(result.ok, true);
    assert.deepEqual(result.value, {
      status: "reviewed",
      adminNotes: "Looked into this and replied offline.",
    });
  });

  it("rejects invalid statuses", () => {
    const result = parseAdminReportPatch({
      status: "pending",
    });
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });
});

describe("reportSpamReason", () => {
  const browserUa =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";

  it("flags random mixed-case subject and body", () => {
    const reason = reportSpamReason(
      { category: "question", subject: "dnUoykQJEbVijidFrW", body: "aHqCTJtzqFNaVtrKXVoU" },
      { userAgent: browserUa },
    );
    assert.equal(reason, "gibberish");
  });

  it("flags a user-agent wrapped in literal quotes", () => {
    const reason = reportSpamReason(
      { category: "question", subject: "Hello", body: "Real looking text" },
      { userAgent: `"${browserUa}"` },
    );
    assert.equal(reason, "quoted-user-agent");
  });

  it("flags a filled honeypot", () => {
    assert.equal(reportSpamReason({ website: "http://spam.example" }), "honeypot");
  });

  it("flags submissions faster than a person can type", () => {
    const now = 1_000_000;
    assert.equal(reportSpamReason({ startedAt: now - 500 }, { now }), "too-fast");
  });

  it("allows normal reports, including short one-word ones", () => {
    const now = 1_000_000;
    for (const [subject, body] of [
      ["Unsafe behavior", "Someone was aggressive after the Tuesday meeting."],
      ["Zoom", "Broken"],
      ["WiFi", "Password"],
    ]) {
      const reason = reportSpamReason(
        { category: "safety", subject, body, startedAt: now - 60_000 },
        { userAgent: browserUa, now },
      );
      assert.equal(reason, null, `${subject} / ${body}`);
    }
  });

  it("allows reports from older clients that send no startedAt", () => {
    assert.equal(
      reportSpamReason({ subject: "Question", body: "When is the next meeting?" }, { userAgent: browserUa }),
      null,
    );
  });
});
