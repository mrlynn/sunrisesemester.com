import mongoose from "mongoose";

const DayAssignmentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    chair: { type: String, default: "" },
    sherpa: { type: String, default: "" },
    openChair: { type: Boolean, default: false },
  },
  { _id: false },
);

const WeeklyServiceScheduleSchema = new mongoose.Schema(
  {
    key: { type: String, default: "current", unique: true },
    notes: { type: String, default: "" },
    days: [DayAssignmentSchema],
  },
  { timestamps: true },
);

export default mongoose.models.WeeklyServiceSchedule ||
  mongoose.model("WeeklyServiceSchedule", WeeklyServiceScheduleSchema);
