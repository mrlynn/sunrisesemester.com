import mongoose from "mongoose";

const SubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "unsubscribed"],
      default: "pending",
    },
    confirmToken: { type: String, default: null },
    confirmTokenExpiresAt: { type: Date, default: null },
    confirmSentAt: { type: Date, default: null },
    unsubscribeToken: { type: String, required: true },
    confirmedAt: { type: Date, default: null },
    unsubscribedAt: { type: Date, default: null },
    source: { type: String, default: "subscribe-page" },
  },
  { timestamps: true },
);

SubscriberSchema.index({ email: 1 }, { unique: true });
SubscriberSchema.index({ confirmToken: 1 }, { sparse: true });
SubscriberSchema.index({ unsubscribeToken: 1 }, { unique: true });
SubscriberSchema.index({ status: 1 });

export default mongoose.models.Subscriber ||
  mongoose.model("Subscriber", SubscriberSchema);
