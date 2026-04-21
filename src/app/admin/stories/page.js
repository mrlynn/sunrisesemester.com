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
import Story from "@/models/Story";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export const metadata = {
  title: "Stories (editor)",
};

export default async function AdminStoriesPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage stories.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  const stories = await Story.find({}).sort({ updatedAt: -1 }).lean();
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Stories
          </Typography>
          <Button component="a" href="/admin/stories/new" variant="contained">
            New story
          </Button>
        </Stack>
        {stories.length === 0 ? (
          <Typography color="text.secondary">No stories yet. Create one to get started.</Typography>
        ) : (
          <List disablePadding>
            {stories.map((s) => (
              <ListItem
                key={String(s._id)}
                disablePadding
                sx={{ borderBottom: 1, borderColor: "divider", py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Button
                      component="a"
                      href={`/admin/stories/${String(s._id)}`}
                      color="inherit"
                      sx={{ justifyContent: "flex-start", textAlign: "left", p: 0, fontWeight: 600 }}
                    >
                      {s.title}
                    </Button>
                  }
                  secondary={`/stories/${s.slug}`}
                />
                <Chip
                  size="small"
                  label={s.published ? "Published" : "Draft"}
                  color={s.published ? "success" : "default"}
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
