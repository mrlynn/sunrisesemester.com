import mongoose from "mongoose";

const NewsletterSendSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },
    recipientCount: { type: Number, required: true, default: 0 },
    sentBy: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.NewsletterSend ||
  mongoose.model("NewsletterSend", NewsletterSendSchema);
