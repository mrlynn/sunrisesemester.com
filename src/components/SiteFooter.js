import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NextLink from "next/link";

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
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: { xs: 3, md: 6 },
            }}
          >
            <div>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
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
                Meeting information, stories, and resources for the Sunrise Semester home
                group of Alcoholics Anonymous.
              </Typography>
            </div>
            <Stack spacing={2}>
              <Typography
                sx={{
                  fontWeight: 700,
                  color: "#2c2c2c",
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Resources
              </Typography>
              <Stack spacing={1}>
                <NextLink href="/meetings" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    sx={{
                      color: "#ff6b35",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      display: "inline-block",
                      fontSize: "0.95rem",
                      "&:hover": {
                        color: "#ff5a1f",
                      },
                    }}
                  >
                    Meeting Schedule
                  </Typography>
                </NextLink>
                <NextLink href="/stories" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    sx={{
                      color: "#ff6b35",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      display: "inline-block",
                      fontSize: "0.95rem",
                      "&:hover": {
                        color: "#ff5a1f",
                      },
                    }}
                  >
                    Member Stories
                  </Typography>
                </NextLink>
                <NextLink href="/resources" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    sx={{
                      color: "#ff6b35",
                      fontWeight: 600,
                      transition: "all 0.2s ease",
                      display: "inline-block",
                      fontSize: "0.95rem",
                      "&:hover": {
                        color: "#ff5a1f",
                      },
                    }}
                  >
                    Resources
                  </Typography>
                </NextLink>
              </Stack>
            </Stack>
          </Box>

          <Box sx={{ borderTop: "1px solid #e5e5e5", pt: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
                <NextLink href="/admin" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    sx={{
                      color: "#ff6b35",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "#ff5a1f",
                      },
                    }}
                  >
                    Editor Sign-in
                  </Typography>
                </NextLink>
                <Typography
                  component="a"
                  href="https://www.aa.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: "#ff6b35",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "#ff5a1f",
                    },
                  }}
                >
                  Alcoholics Anonymous
                </Typography>
              </Stack>

              <div>
                <Typography
                  sx={{
                    color: "#999999",
                    fontSize: "0.85rem",
                    lineHeight: 1.6,
                  }}
                >
                  © {new Date().getFullYear()} Sunrise Semester. All rights reserved. This site is maintained by members of Sunrise Semester for group information only. Alcoholics Anonymous is not allied with any sect, denomination, politics, organization, or institution.
                </Typography>
              </div>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
