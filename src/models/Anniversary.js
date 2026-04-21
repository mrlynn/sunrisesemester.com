import mongoose from "mongoose";

const AnniversarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sobrietyDate: { type: Date, required: true },
    note: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Anniversary ||
  mongoose.model("Anniversary", AnniversarySchema);
