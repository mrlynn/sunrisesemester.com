import Box from "@mui/material/Box";
import AdminToolbar from "./AdminToolbar";
import { getAuthSession } from "@/lib/requireAdmin";

export default async function AdminLayout({ children }) {
  const session = await getAuthSession();
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminToolbar session={session} />
      {children}
    </Box>
  );
}
