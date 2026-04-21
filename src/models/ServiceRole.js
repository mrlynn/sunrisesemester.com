import mongoose from "mongoose";

const ServiceRoleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    holder: { type: String, default: "" },
    email: { type: String, default: "" },
    description: { type: String, default: "" },
    termLabel: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.ServiceRole ||
  mongoose.model("ServiceRole", ServiceRoleSchema);
