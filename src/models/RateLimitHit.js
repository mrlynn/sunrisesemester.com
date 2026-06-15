import mongoose from "mongoose";

const RateLimitHitSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    count: { type: Number, required: true, default: 1 },
    windowStart: { type: Date, required: true },
  },
  { timestamps: false },
);

RateLimitHitSchema.index({ key: 1 }, { unique: true });
RateLimitHitSchema.index({ windowStart: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.models.RateLimitHit ||
  mongoose.model("RateLimitHit", RateLimitHitSchema);
