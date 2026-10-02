import mongoose from "mongoose";
import { REPORT_CATEGORIES, REPORT_STATUSES } from "@/lib/reports";

const ReportSchema = new mongoose.Schema(
  {
    category: { type: String, enum: REPORT_CATEGORIES, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    status: { type: String, enum: REPORT_STATUSES, default: "new" },
    adminNotes: { type: String, default: "" },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
