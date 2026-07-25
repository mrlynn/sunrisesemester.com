/**
 * One-shot import of July 14, 2026 business meeting minutes from secretary notes.
 * Run: node --env-file=.env.local scripts/import-july-2026-minutes.mjs
 */
import connectDB from "../src/lib/mongodb.js";
import BusinessMeeting from "../src/models/BusinessMeeting.js";
import { parseBusinessMeetingNotes } from "../src/lib/parseBusinessMeetingNotes.js";
import { parseBusinessMeetingPayload } from "../src/lib/businessMeetingShared.js";

const NOTES = `Chair Rotation
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
Kevin D.Dylan (would like to learn how)
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
Zoom income and expense totals were also reviewed.
Mike M. indicated that he will update the treasury records accordingly.
Motion: Kevin D. moved to approve the Treasurer's Report.

Second: Mike L.

Result: Motion carried.

Old Business
No old business was brought forward.

New Business
Temporary GSR Appointment
Kevin D. asked to temporarily serve as the group's General Service Representative (GSR) for the remainder of 2026.

At the end of the year, Kevin will decide whether the role is a good fit and whether he is able to fulfill its responsibilities. If so, he will put his name forward for consideration for the official two-year GSR term.

Motion: Mike L. moved to approve Kevin D. as the temporary GSR for the remainder of 2026.

Second: Laura.

Result: Motion approved.

Group Contributions (Splits)
Chuck discussed that many AA groups establish a formal distribution policy for Seventh Tradition funds by determining quarterly percentage splits among AA service entities.

Mike L. made a motion to begin developing a formal distribution policy.

Second: Mike L.

During discussion:

Paul D. asked whether Alcoholics Anonymous provides any guidance regarding contribution percentages. No one present was aware of any official guidance.
Laura suggested that the group develop its own recommended distribution percentages.
Mike M. volunteered to work with Chuck to prepare a proposed percentage-based distribution plan for consideration at a future business meeting.
Result: Motion carried to have Chuck and Mike M. develop a proposed distribution policy to present at a future business meeting.

Meeting Share Time
The group discussed the current statement in the meeting format:

"Please be mindful of the length of your share and keep it to fewer than 5 mins."

Kevin D. suggested removing the phrase "fewer than 5 mins" from the meeting format.

During discussion, Billy suggested that the language could instead recommend shares of six minutes or less.

Motion: Kevin D. moved to amend the meeting format by removing the phrase "fewer than 5 mins" from the statement, "Please be mindful of the length of your share and keep it to fewer than 5 mins."

Second: Mike L.

Vote: 9 in favor, 0 opposed.

Result: Motion passed. The meeting format will be updated to remove the phrase "fewer than 5 mins."

Meeting Format Updates
Mike L. reported that he has been updating the Sunrise Semester meeting formats and asked what process should be followed to officially approve the revisions.

It was noted that the newly approved change regarding share length would be incorporated into the updated formats.

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

const parsed = parseBusinessMeetingNotes(NOTES, { meetingDate: "2026-07-14" });
if (!parsed.ok) {
  console.error(parsed.error);
  process.exit(1);
}

const payload = parseBusinessMeetingPayload({
  ...parsed.value,
  meetingDate: "2026-07-14",
  slug: "2026-07",
  published: false,
});

await connectDB();
const doc = await BusinessMeeting.findOneAndUpdate(
  { slug: "2026-07" },
  { $set: payload },
  { upsert: true, new: true },
);

console.log(
  JSON.stringify(
    {
      id: String(doc._id),
      slug: doc.slug,
      meetingDate: doc.meetingDate,
      published: doc.published,
      sections: doc.sections.map((s) => ({
        title: s.title,
        movedBy: s.motion?.movedBy || "",
        secondedBy: s.motion?.secondedBy || "",
        outcome: s.motion?.outcome || "",
      })),
      scheduleRows: doc.commitmentSchedules[0]?.rows?.length ?? 0,
      warnings: parsed.warnings,
      editPath: `/admin/business-meetings/${doc._id}`,
    },
    null,
    2,
  ),
);
process.exit(0);
