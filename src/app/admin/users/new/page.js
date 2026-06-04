import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { getAuthSession } from "@/lib/requireAdmin";
import { canManageUsers } from "@/lib/roles";
import EditorUserForm from "../EditorUserForm";

export const metadata = { title: "Add editor user" };

export default async function NewEditorUserPage() {
  const session = await getAuthSession();
  if (!session) redirect("/admin");
  if (!canManageUsers(session.role)) redirect("/admin");

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Add user
        </Typography>
        <EditorUserForm mode="create" />
      </Stack>
    </Container>
  );
}
