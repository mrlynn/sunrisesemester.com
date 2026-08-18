import mongoose from "mongoose";

const MotionSchema = new mongoose.Schema(
  {
    movedBy: { type: String, default: "" },
    secondedBy: { type: String, default: "" },
    outcome: { type: String, default: "" },
  },
  { _id: false },
);

const AgendaSectionSchema = new mongoose.Schema(
  {
    key: { type: String, default: "" },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    motion: { type: MotionSchema, default: () => ({}) },
  },
  { _id: false },
);

const AttachedReportSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    title: { type: String, default: "" },
    content: { type: String, default: "" },
  },
  { _id: false },
);

const ScheduleRowSchema = new mongoose.Schema(
  {
    day: { type: String, default: "" },
    cells: [{ type: String, default: "" }],
  },
  { _id: false },
);

const CommitmentScheduleSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    /** Calendar month this schedule covers, YYYY-MM (usually meeting month + 1). */
    appliesToMonth: { type: String, default: "" },
    columns: [{ type: String, default: "" }],
    rows: [ScheduleRowSchema],
  },
  { _id: false },
);

const AdjournmentSchema = new mongoose.Schema(
  {
    movedBy: { type: String, default: "" },
    time: { type: String, default: "" },
    closingNotes: { type: String, default: "" },
  },
  { _id: false },
);

const BusinessMeetingSchema = new mongoose.Schema(
  {
    meetingDate: { type: Date, required: true },
    slug: { type: String, index: { unique: true, sparse: true } },
    published: { type: Boolean, default: false },
    chair: { type: String, default: "" },
    openedAt: { type: String, default: "" },
    openingNotes: { type: String, default: "" },
    sections: [AgendaSectionSchema],
    oldBusiness: { type: String, default: "" },
    newBusiness: { type: String, default: "" },
    adjournment: { type: AdjournmentSchema, default: () => ({}) },
    signOff: { type: String, default: "" },
    attachedReports: [AttachedReportSchema],
    commitmentSchedules: [CommitmentScheduleSchema],
  },
  { timestamps: true },
);

export default mongoose.models.BusinessMeeting ||
  mongoose.model("BusinessMeeting", BusinessMeetingSchema);
