import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { COOKIE_NAME, getSessionFromToken } from "@/lib/auth";
import { canManageUsers } from "@/lib/roles";
import AdminReportsManager from "./AdminReportsManager";

export const metadata = {
  title: "Reports (admin)",
};

export default async function AdminReportsPage() {
  const store = await cookies();
  const session = await getSessionFromToken(store.get(COOKIE_NAME)?.value);
  if (!session) {
    redirect("/admin");
  }
  if (!canManageUsers(session.role)) {
    redirect("/admin");
  }

  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to view reports.
        </Alert>
      </Box>
    );
  }

  await connectDB();
  const [items, counts] = await Promise.all([
    Report.find({}).sort({ createdAt: -1 }).lean(),
    Report.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);
  const statusCounts = Object.fromEntries(counts.map((count) => [count._id, count.count]));

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Reports
      </Typography>
      <AdminReportsManager
        initialItems={JSON.parse(JSON.stringify(items))}
        initialStatusCounts={statusCounts}
      />
    </Container>
  );
}
