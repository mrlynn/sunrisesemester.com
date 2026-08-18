import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  extractMotionFromBody,
  parseChairSchedule,
  parseBusinessMeetingNotes,
} from "./parseBusinessMeetingNotes.js";

const SAMPLE = `Chair Rotation
The following chair schedule was discussed and approved:

Day
Chair
Sherpa
Sunday
John S.
Mike L.
Monday
Mike W.
Mike M.
Tuesday
Kevin D. (until Dylan receives approval)
Kevin D.
Wednesday
Laura
Mike M.
Thursday
Billy
Mike M.
Friday
John S.
Mike L.
Saturday (Men's Meeting)
Bring Your Own Chair
N/A
Saturday (Women's Meeting)
Bring Your Own Chair
N/A

Treasurer's Report
Mike M. presented the Treasurer's Report.

A Zoom service charge of $18.35 was reviewed.
Mike L. clarified that the service charge was for the Zoom account.

Motion: Kevin D. moved to approve the Treasurer's Report.

Second: Mike L.

Result: Motion carried.

Old Business
No old business was brought forward.

New Business
Temporary GSR Appointment
Kevin D. asked to temporarily serve as the group's General Service Representative (GSR) for the remainder of 2026.

Motion: Mike L. moved to approve Kevin D. as the temporary GSR for the remainder of 2026.

Second: Laura.

Result: Motion approved.

Group Contributions (Splits)
Chuck discussed that many AA groups establish a formal distribution policy.

Motion: Mike L. made a motion to begin developing a formal distribution policy.

Second: Mike L.

Result: Motion carried to have Chuck and Mike M. develop a proposed distribution policy.

Meeting Share Time
The group discussed the current statement in the meeting format.

Motion: Kevin D. moved to amend the meeting format by removing the phrase "fewer than 5 mins".

Second: Mike L.

Vote: 9 in favor, 0 opposed.

Result: Motion passed. The meeting format will be updated.

Meeting Format Updates
Mike L. reported that he has been updating the Sunrise Semester meeting formats.

Motion: Mike M. moved to approve the updated meeting formats, incorporating the approved revision regarding share length.

Second: Paul D.

Result: Motion approved.

Action Items
Mike M. will update the Treasurer's Report to reflect the Zoom service charges and totals.
Chuck and Mike M. will develop a proposed Seventh Tradition distribution (splits) policy for presentation at a future business meeting.
Mike L. will update the meeting formats to remove the phrase "fewer than 5 mins" from the sharing guidance.

Adjournment
There being no further business, the meeting was adjourned.
`;

describe("extractMotionFromBody", () => {
  it("extracts movedBy, secondedBy, and outcome", () => {
    const { content, motion } = extractMotionFromBody(`Notes here.

Motion: Kevin D. moved to approve the Treasurer's Report.
Second: Mike L.
Result: Motion carried.
`);
    assert.equal(motion.movedBy, "Kevin D.");
    assert.equal(motion.secondedBy, "Mike L.");
    assert.equal(motion.outcome, "Motion carried.");
    assert.match(content, /Notes here/);
    assert.match(content, /Motion: Kevin D/);
    assert.doesNotMatch(content, /^Second:/m);
  });
});

describe("parseChairSchedule", () => {
  it("parses day/chair/sherpa columns", () => {
    const schedule = parseChairSchedule(`The following was approved:

Day
Chair
Sherpa
Sunday
John S.
Mike L.
Monday
Mike W.
Mike M.
`);
    assert.ok(schedule);
    assert.deepEqual(schedule.columns, ["Chair", "Sherpa"]);
    assert.equal(schedule.rows.length, 2);
    assert.equal(schedule.rows[0].day, "Sunday");
    assert.deepEqual(schedule.rows[0].cells, ["John S.", "Mike L."]);
  });
});

describe("parseBusinessMeetingNotes", () => {
  it("maps a full secretary document into form fields", () => {
    const result = parseBusinessMeetingNotes(SAMPLE, { meetingDate: "2026-07-14" });
    assert.equal(result.ok, true);
    assert.equal(result.value.meetingDate, "2026-07-14");
    assert.equal(result.value.slug, "2026-07");
    assert.equal(result.value.commitmentSchedules.length, 1);
    assert.equal(result.value.commitmentSchedules[0].rows.length, 8);
    assert.equal(result.value.commitmentSchedules[0].appliesToMonth, "2026-08");
    assert.equal(result.value.oldBusiness.includes("No old business"), true);

    const treasurer = result.value.sections.find((s) => /treasurer/i.test(s.title));
    assert.ok(treasurer);
    assert.equal(treasurer.motion.movedBy, "Kevin D.");
    assert.equal(treasurer.motion.secondedBy, "Mike L.");

    const gsr = result.value.sections.find((s) => /gsr/i.test(s.title));
    assert.ok(gsr);
    assert.equal(gsr.motion.secondedBy, "Laura.");

    const actions = result.value.sections.find((s) => s.title === "Action Items");
    assert.ok(actions);
    assert.match(actions.content, /Seventh Tradition/);

    assert.match(result.value.adjournment.closingNotes, /adjourned/i);
  });

  it("rejects empty paste", () => {
    const result = parseBusinessMeetingNotes("   ");
    assert.equal(result.ok, false);
  });
});
