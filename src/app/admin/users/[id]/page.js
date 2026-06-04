import { redirect, notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { getAuthSession } from "@/lib/requireAdmin";
import { canManageUsers } from "@/lib/roles";
import { isValidObjectIdString } from "@/lib/objectId";
import { getEditorUserById } from "@/lib/editorUsers";
import EditorUserForm from "../EditorUserForm";

export const metadata = { title: "Edit editor user" };

export default async function EditEditorUserPage({ params }) {
  const session = await getAuthSession();
  if (!session) redirect("/admin");
  if (!canManageUsers(session.role)) redirect("/admin");

  const { id } = await params;
  if (!isValidObjectIdString(id)) notFound();
  const user = await getEditorUserById(id);
  if (!user) notFound();

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Edit user
        </Typography>
        <EditorUserForm mode="edit" initial={user} />
      </Stack>
    </Container>
  );
}
