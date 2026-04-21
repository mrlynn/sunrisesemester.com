import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import StoryForm from "../StoryForm";

export const metadata = {
  title: "New story",
};

export default async function NewStoryPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to create stories.
        </Alert>
      </Box>
    );
  }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StoryForm mode="create" initial={{}} />
    </Container>
  );
}
