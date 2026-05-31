import connectDB from "../src/lib/mongodb.js";
import Event from "../src/models/Event.js";

await connectDB();
const ev = await Event.findOne({ slug: "anniversary-2026" }).select({ _id: 1 }).lean();
console.log(ev ? String(ev._id) : "NOT_FOUND");
process.exit(0);
