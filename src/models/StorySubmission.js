import mongoose from "mongoose";

const StorySubmissionSchema = new mongoose.Schema(
  {
    submissionType: {
      type: String,
      enum: ["article", "photo", "audio"],
      required: true,
    },
    displayNameStyle: {
      type: String,
      enum: ["initials", "firstLastInitial", "anonymous"],
      required: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    mailingAddress: { type: String, default: "" },
    cityStateZip: { type: String, default: "" },
    storyText: { type: String, default: "" },
    file: {
      name: { type: String, default: "" },
      size: { type: Number, default: 0 },
      type: { type: String, default: "" },
      data: { type: Buffer },
    },
    agreedCopyrightTransfer: { type: Boolean, required: true },
    agreedAuthorRepresentations: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "published", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.StorySubmission ||
  mongoose.model("StorySubmission", StorySubmissionSchema);
