import connectDB from "@/lib/mongodb";
import ServiceRole from "@/models/ServiceRole";

export async function listPublishedServiceRoles() {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  await connectDB();
  const docs = await ServiceRole.find({ published: true })
    .sort({ order: 1, title: 1 })
    .lean();
  return docs.map((d) => ({
    _id: String(d._id),
    title: d.title,
    holder: d.holder || "",
    email: d.email || "",
    description: d.description || "",
    termLabel: d.termLabel || "",
    order: d.order ?? 0,
  }));
}
