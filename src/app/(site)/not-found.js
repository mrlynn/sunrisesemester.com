import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function NotFound() {
  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
      <Stack spacing={2}>
        <Typography variant="h4" component="h1">
          Page not found
        </Typography>
        <Typography color="text.secondary">
          The page you requested does not exist or may have been moved.
        </Typography>
        <Button
          component="a"
          href="/"
          variant="contained"
          sx={{ alignSelf: "flex-start" }}
        >
          Back to home
        </Button>
      </Stack>
    </Container>
  );
}
