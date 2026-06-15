import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import connectDB from "@/lib/mongodb";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { listGroupMembersForAdmin, applyVisibilityForAdmin } from "@/lib/groupMembers";
import AdminMembersManager from "./AdminMembersManager";

export const metadata = {
  title: "Members (editor)",
};

export default async function AdminMembersPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }

  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to view members.
        </Alert>
      </Box>
    );
  }

  await connectDB();
  const members = await listGroupMembersForAdmin();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Group members
      </Typography>
      <AdminMembersManager
        initialMembers={members.map(applyVisibilityForAdmin)}
      />
    </Container>
  );
}
