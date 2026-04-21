import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const metadata = {
  title: "Resources",
};

function OutLink({ href, children }) {
  return (
    <Typography
      component="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      sx={{ color: "secondary.main", fontWeight: 600, textDecoration: "underline" }}
    >
      {children}
    </Typography>
  );
}

export default function ResourcesPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Typography variant="h3" component="h1">
          Resources
        </Typography>
        <Typography color="text.secondary">
          Helpful links for newcomers and members. This page is static in code; adjust the
          list anytime in <code>src/app/(site)/resources/page.js</code>.
        </Typography>
        <Stack spacing={1.5} component="ul" sx={{ pl: 2 }}>
          <Typography component="li">
            <OutLink href="https://www.aa.org/">Alcoholics Anonymous World Services</OutLink>
          </Typography>
          <Typography component="li">
            <OutLink href="https://www.aa.org/the-big-book">The Big Book online</OutLink>
          </Typography>
          <Typography component="li">
            <OutLink href="https://www.aa.org/12-steps-of-alcoholics-anonymous">
              The Twelve Steps
            </OutLink>
          </Typography>
          <Typography component="li">
            <OutLink href="https://www.aa.org/12-traditions-of-alcoholics-anonymous">
              The Twelve Traditions
            </OutLink>
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
