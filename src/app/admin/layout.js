import Box from "@mui/material/Box";
import AdminToolbar from "./AdminToolbar";

export default function AdminLayout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AdminToolbar />
      {children}
    </Box>
  );
}
