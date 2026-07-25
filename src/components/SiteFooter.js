import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";
import { SITE_NAV_GROUPS } from "@/lib/siteNav";

function FooterLink({ href, children }) {
  return (
    <NextLink href={href} style={{ textDecoration: "none" }}>
      <Typography
        component="span"
        sx={{
          color: "#ff6b35",
          fontWeight: 600,
          transition: "color 0.2s ease",
          display: "inline-block",
          fontSize: "0.95rem",
          "&:hover": { color: "#ff5a1f" },
        }}
      >
        {children}
      </Typography>
    </NextLink>
  );
}

export default function SiteFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid #e5e5e5",
        bgcolor: "#f9f9f9",
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={5}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1.2fr 1fr 1fr 1fr" },
              gap: { xs: 3, md: 4 },
            }}
          >
            <div>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "var(--font-serif), Georgia, serif",
                  mb: 2,
                  color: "#2c2c2c",
                  fontWeight: 700,
                  fontSize: "1.2rem",
                }}
              >
                Sunrise Semester
              </Typography>
              <Typography
                sx={{
                  color: "#666666",
                  lineHeight: 1.8,
                  fontSize: "0.95rem",
                }}
              >
                Meeting information, stories, and resources for the Sunrise Semester home group of
                Alcoholics Anonymous.
              </Typography>
            </div>

            {SITE_NAV_GROUPS.map((group) => (
              <Stack key={group.id} spacing={2}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#2c2c2c",
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {group.label}
                </Typography>
                <Stack spacing={1}>
                  {group.items.map((item) => (
                    <FooterLink key={item.href} href={item.href}>
                      {item.label}
                    </FooterLink>
                  ))}
                  {group.id === "group" ? (
                    <>
                      <FooterLink href="/member">Member account</FooterLink>
                      <FooterLink href="/member/register">Register</FooterLink>
                    </>
                  ) : null}
                </Stack>
              </Stack>
            ))}
          </Box>

          <Box sx={{ borderTop: "1px solid #e5e5e5", pt: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
                <FooterLink href="/admin">Editor Sign-in</FooterLink>
                <Typography
                  component="a"
                  href="https://www.aa.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#ff6b35",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    transition: "color 0.2s ease",
                    "&:hover": { color: "#ff5a1f" },
                  }}
                >
                  Alcoholics Anonymous
                </Typography>
              </Stack>

              <Typography
                sx={{
                  color: "#999999",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                }}
              >
                © {new Date().getFullYear()} Sunrise Semester. All rights reserved. This site is
                maintained by members of Sunrise Semester for group information only. Alcoholics
                Anonymous is not allied with any sect, denomination, politics, organization, or
                institution.
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
