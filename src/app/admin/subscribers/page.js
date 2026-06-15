import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import NewsletterSend from "@/models/NewsletterSend";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { isEmailConfigured } from "@/lib/email";
import AdminSubscribersManager from "./AdminSubscribersManager";

export const metadata = {
  title: "Subscribers (editor)",
};

export default async function AdminSubscribersPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }

  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage subscribers.
        </Alert>
      </Box>
    );
  }

  await connectDB();
  const [items, counts, sends] = await Promise.all([
    Subscriber.find({})
      .select("email status confirmedAt unsubscribedAt createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean(),
    Subscriber.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    NewsletterSend.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select("subject recipientCount sentBy createdAt")
      .lean(),
  ]);

  const statusCounts = Object.fromEntries(counts.map((c) => [c._id, c.count]));

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Subscribers
      </Typography>
      <AdminSubscribersManager
        initialItems={JSON.parse(JSON.stringify(items))}
        initialStatusCounts={statusCounts}
        initialSends={JSON.parse(JSON.stringify(sends))}
        emailConfigured={isEmailConfigured()}
      />
    </Container>
  );
}
