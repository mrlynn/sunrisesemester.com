import { cookies } from "next/headers";
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
import connectDB from "@/lib/mongodb";
import ServiceRole from "@/models/ServiceRole";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export const metadata = {
  title: "Service roster (editor)",
};

export default async function AdminServiceRolesPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage the service
          roster.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  const items = await ServiceRole.find({}).sort({ order: 1, title: 1 }).lean();
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Service roster
          </Typography>
          <Button
            component="a"
            href="/admin/service-roles/new"
            variant="contained"
          >
            New role
          </Button>
        </Stack>
        {items.length === 0 ? (
          <Typography color="text.secondary">
            No service roles yet. Add the group&rsquo;s trusted servants to get started.
          </Typography>
        ) : (
          <List disablePadding>
            {items.map((item) => (
              <ListItem
                key={String(item._id)}
                disablePadding
                sx={{ borderBottom: 1, borderColor: "divider", py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Button
                      component="a"
                      href={`/admin/service-roles/${String(item._id)}`}
                      color="inherit"
                      sx={{
                        justifyContent: "flex-start",
                        textAlign: "left",
                        p: 0,
                        fontWeight: 600,
                      }}
                    >
                      {item.title}
                    </Button>
                  }
                  secondary={
                    item.holder
                      ? `${item.holder}${item.termLabel ? ` · ${item.termLabel}` : ""}`
                      : "Open"
                  }
                />
                <Chip
                  size="small"
                  label={item.published ? "Published" : "Draft"}
                  color={item.published ? "success" : "default"}
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
