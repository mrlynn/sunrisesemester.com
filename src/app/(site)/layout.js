import Box from "@mui/material/Box";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import { getActiveAnnouncement } from "@/lib/siteAnnouncement";

export default async function SiteLayout({ children }) {
  const announcement = await getActiveAnnouncement();

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AnnouncementBanner announcement={announcement} />
      <SiteHeader />
      <Box component="main" sx={{ flex: 1 }}>
        {children}
      </Box>
      <SiteFooter />
    </Box>
  );
}
