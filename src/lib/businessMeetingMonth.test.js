import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  currentMonthKey,
  defaultAppliesToMonth,
  formatMonthLabel,
  monthKeyFromDate,
  nextMonthKey,
  normalizeAppliesToMonth,
  parseBusinessMeetingPayload,
  resolveAppliesToMonth,
} from "./businessMeetingShared.js";

describe("commitment month helpers", () => {
  it("normalizes YYYY-MM keys", () => {
    assert.equal(normalizeAppliesToMonth("2026-08"), "2026-08");
    assert.equal(normalizeAppliesToMonth("2026-13"), "");
    assert.equal(normalizeAppliesToMonth("august"), "");
  });

  it("derives meeting month and next month from a meeting date", () => {
    assert.equal(monthKeyFromDate("2026-07-14"), "2026-07");
    assert.equal(defaultAppliesToMonth("2026-07-14"), "2026-08");
    assert.equal(nextMonthKey("2026-12"), "2027-01");
    assert.equal(formatMonthLabel("2026-08"), "August 2026");
  });

  it("resolves appliesToMonth with legacy fallback", () => {
    assert.equal(
      resolveAppliesToMonth({ appliesToMonth: "2026-09" }, "2026-07-14"),
      "2026-09",
    );
    assert.equal(resolveAppliesToMonth({}, "2026-07-14"), "2026-08");
  });

  it("computes current month in Eastern time", () => {
    // EDT (UTC-4): 03:30 UTC Aug 1 = 23:30 Jul 31 Eastern
    assert.equal(currentMonthKey(new Date("2026-08-01T03:30:00.000Z")), "2026-07");
    // 04:30 UTC Aug 1 = 00:30 Aug 1 Eastern
    assert.equal(currentMonthKey(new Date("2026-08-01T04:30:00.000Z")), "2026-08");
  });

  it("defaults appliesToMonth when saving a payload", () => {
    const parsed = parseBusinessMeetingPayload({
      meetingDate: "2026-07-14",
      commitmentSchedules: [
        {
          title: "Chair",
          columns: ["Chair", "Sherpa"],
          rows: [{ day: "SUN", cells: ["A", "B"] }],
        },
      ],
    });
    assert.equal(parsed.commitmentSchedules[0].appliesToMonth, "2026-08");
  });
});
