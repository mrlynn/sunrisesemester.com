import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { getAnnouncement } from "@/lib/siteAnnouncement";
import AnnouncementEditor from "./AnnouncementEditor";

export const metadata = {
  title: "Announcement banner",
};

export default async function AdminAnnouncementPage() {
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
  const [initial, stories] = await Promise.all([
    getAnnouncement(),
    Story.find({})
      .sort({ updatedAt: -1 })
      .select({ title: 1, slug: 1, published: 1 })
      .lean(),
  ]);

  return (
    <AnnouncementEditor
      initial={JSON.parse(JSON.stringify(initial))}
      stories={JSON.parse(JSON.stringify(stories))}
    />
  );
}
