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
import SiteResource from "@/models/SiteResource";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export const metadata = {
  title: "Resources (editor)",
};

const CATEGORY_LABELS = {
  "meeting-format": "Meeting format",
  guide: "Guide",
  service: "Service",
  link: "Link",
  other: "Other",
};

export default async function AdminResourcesPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage resources.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  const items = await SiteResource.find({}).sort({ sortOrder: 1, title: 1 }).lean();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Resources
          </Typography>
          <Button component="a" href="/admin/resources/new" variant="contained">
            New resource
          </Button>
        </Stack>
        {!process.env.BLOB_READ_WRITE_TOKEN ? (
          <Alert severity="info">
            PDF uploads need <code>BLOB_READ_WRITE_TOKEN</code>. Link resources still work without
            it.
          </Alert>
        ) : null}
        {items.length === 0 ? (
          <Typography color="text.secondary">
            No resources yet. Create one, or run{" "}
            <code>npm run seed:site-resources</code> to import the current public links.
          </Typography>
        ) : (
          <List disablePadding>
            {items.map((item) => (
              <ListItem
                key={String(item._id)}
                disablePadding
                sx={{ borderBottom: 1, borderColor: "divider", py: 1.5, gap: 1, flexWrap: "wrap" }}
              >
                <ListItemText
                  primary={
                    <Button
                      component="a"
                      href={`/admin/resources/${String(item._id)}`}
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
                  secondary={`${CATEGORY_LABELS[item.category] || item.category} · ${item.kind} · sort ${item.sortOrder ?? 0}`}
                />
                <Chip
                  size="small"
                  label={item.published ? "Published" : "Draft"}
                  color={item.published ? "success" : "default"}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Container>
  );
}
