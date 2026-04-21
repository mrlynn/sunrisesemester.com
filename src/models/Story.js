import mongoose from "mongoose";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const StorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, default: "" },
    body: { type: String, default: "" },
    author: { type: String, default: "" },
    coverImage: { type: String, default: "" },
    coverImageCredit: { type: String, default: "" },
    coverImageCreditUrl: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

StorySchema.pre("validate", function preValidate(next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  }
  next();
});

export default mongoose.models.Story || mongoose.model("Story", StorySchema);
