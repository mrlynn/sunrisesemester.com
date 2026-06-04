import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { getAuthSession } from "@/lib/requireAdmin";
import { canManageUsers } from "@/lib/roles";
import { listEditorUsers } from "@/lib/editorUsers";
import { ROLE_LABELS } from "@/lib/roles";

export const metadata = { title: "Users (editor)" };

export default async function AdminUsersPage() {
  const session = await getAuthSession();
  if (!session) redirect("/admin");
  if (!canManageUsers(session.role)) redirect("/admin");

  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage users.
        </Alert>
      </Box>
    );
  }

  const users = await listEditorUsers();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Editor users
          </Typography>
          <Button component="a" href="/admin/users/new" variant="contained">
            Add user
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          Create accounts by email, set a password, and assign a role. Secretaries can edit
          business meeting minutes only; editors manage site content; administrators can do both
          and manage users.
        </Typography>
        {users.length === 0 ? (
          <Typography color="text.secondary">No users yet. Add the secretary and other editors.</Typography>
        ) : (
          <List disablePadding>
            {users.map((u) => (
              <ListItem
                key={u._id}
                disablePadding
                sx={{ borderBottom: 1, borderColor: "divider", py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Button
                      component="a"
                      href={`/admin/users/${u._id}`}
                      color="inherit"
                      sx={{ justifyContent: "flex-start", textAlign: "left", p: 0, fontWeight: 600 }}
                    >
                      {u.email}
                    </Button>
                  }
                  secondary={u.name || undefined}
                />
                <Chip size="small" label={ROLE_LABELS[u.role] || u.role} sx={{ ml: 1 }} />
                <Chip
                  size="small"
                  label={u.active ? "Active" : "Inactive"}
                  color={u.active ? "success" : "default"}
                  sx={{ ml: 1 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Container>
  );
}
