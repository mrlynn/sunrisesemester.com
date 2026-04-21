import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import connectDB from "@/lib/mongodb";
import Landing from "@/models/Landing";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import LandingEditor from "./LandingEditor";

export const metadata = {
  title: "Edit landing",
};

export default async function AdminLandingPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to enable the editor.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  let doc = await Landing.findOne({ key: "main" }).lean();
  if (!doc) {
    doc = (
      await Landing.create({
        key: "main",
        heroTitle: "Sunrise Semester",
        heroSubtitle: "A home group of Alcoholics Anonymous",
        body: "",
      })
    ).toObject();
  }
  const initial = JSON.parse(JSON.stringify(doc));
  return <LandingEditor initial={initial} />;
}
