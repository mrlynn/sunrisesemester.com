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
import Anniversary from "@/models/Anniversary";
import { serializeAnniversary } from "@/lib/anniversaries";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export const metadata = {
  title: "Anniversaries (editor)",
};

export default async function AdminAnniversariesPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage
          anniversaries.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  const items = await Anniversary.find({}).sort({ sobrietyDate: 1 }).lean();
  const now = new Date();
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Anniversaries
          </Typography>
          <Button
            component="a"
            href="/admin/anniversaries/new"
            variant="contained"
          >
            New anniversary
          </Button>
        </Stack>
        {items.length === 0 ? (
          <Typography color="text.secondary">
            No anniversaries yet. Add one to start celebrating.
          </Typography>
        ) : (
          <List disablePadding>
            {items.map((item) => {
              const s = serializeAnniversary(item, now);
              return (
                <ListItem
                  key={String(item._id)}
                  disablePadding
                  sx={{ borderBottom: 1, borderColor: "divider", py: 1.5 }}
                >
                  <ListItemText
                    primary={
                      <Button
                        component="a"
                        href={`/admin/anniversaries/${String(item._id)}`}
                        color="inherit"
                        sx={{
                          justifyContent: "flex-start",
                          textAlign: "left",
                          p: 0,
                          fontWeight: 600,
                        }}
                      >
                        {s.name} — {s.years} {s.years === 1 ? "year" : "years"}
                      </Button>
                    }
                    secondary={`Sober since ${s.sobrietyDateLabel}`}
                  />
                  <Chip
                    size="small"
                    label={item.published ? "Published" : "Draft"}
                    color={item.published ? "success" : "default"}
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Stack>
    </Container>
  );
}
