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
import Puzzle from "@/models/Puzzle";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export const metadata = {
  title: "Puzzles (editor)",
};

function formatWeekOf(value) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default async function AdminPuzzlesPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage puzzles.
        </Alert>
      </Box>
    );
  }

  await connectDB();
  const items = await Puzzle.find({}).sort({ updatedAt: -1 }).lean();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Puzzles
          </Typography>
          <Button component="a" href="/admin/puzzles/new" variant="contained">
            New puzzle
          </Button>
        </Stack>

        {items.length === 0 ? (
          <Typography color="text.secondary">No puzzles yet. Create one to get started.</Typography>
        ) : (
          <List disablePadding>
            {items.map((p) => (
              <ListItem
                key={String(p._id)}
                disablePadding
                sx={{ borderBottom: 1, borderColor: "divider", py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Button
                      component="a"
                      href={`/admin/puzzles/${String(p._id)}`}
                      color="inherit"
                      sx={{ justifyContent: "flex-start", textAlign: "left", p: 0, fontWeight: 700 }}
                    >
                      {p.title || `Crossword: Week of ${formatWeekOf(p.weekOf)}`}
                    </Button>
                  }
                  secondary={`/puzzles/${p.slug}`}
                />
                <Chip
                  size="small"
                  label={p.status}
                  color={p.status === "published" ? "success" : p.status === "archived" ? "default" : "warning"}
                  sx={{ ml: 1, textTransform: "capitalize" }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Container>
  );
}

