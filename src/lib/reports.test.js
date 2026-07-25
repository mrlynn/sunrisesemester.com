import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseAdminReportPatch,
  parseReportInput,
  REPORT_CATEGORIES,
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
