"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

const ALLOWED_TYPES =
  "gif, jpg, jpeg, png, bmp, eps, tif, pict, psd, txt, rtf, html, odf, pdf, doc, docx, ppt, pptx, xls, xlsx, xml, avi, mov, mp3, mp4, ogg, wav, bz2, dmg, gz, jar, rar, sit, svg, tar, zip";

export default function ShareStoryForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);
  const [fileName, setFileName] = React.useState("");
  const formRef = React.useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/story-submissions", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed.");
      setSuccess(true);
      formRef.current?.reset();
      setFileName("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 10 }}>
        <Alert severity="success" sx={{ fontSize: "1.05rem", p: 3 }}>
          <Typography sx={{ fontWeight: 700, mb: 1 }}>Thank you for sharing.</Typography>
          We&apos;ve received your submission. A member of our team will review it and reach
          out by email.
        </Alert>
      </Container>
    );
  }

  const labelSx = { fontWeight: 700, color: "#1d1d1d", mb: 1, fontSize: "0.95rem" };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: { xs: "2.25rem", md: "3.25rem" },
          fontWeight: 800,
          fontFamily: 'var(--font-serif), Georgia, serif',
          mb: 2,
          color: "#1d1d1d",
        }}
      >
        Share your story.
      </Typography>
      <Typography sx={{ color: "#555", mb: 5, fontSize: "1.1rem", lineHeight: 1.6 }}>
        Your experience, strength, and hope can help another alcoholic. Submit an article,
        photo, artwork, or audio recording below.
      </Typography>

      <Box
        component="form"
        ref={formRef}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          background: "#fff",
          border: "1px solid #eee",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <Stack spacing={4}>
          <FormControl required>
            <FormLabel sx={labelSx}>I am uploading a</FormLabel>
            <RadioGroup name="submissionType" defaultValue="article">
              <FormControlLabel value="article" control={<Radio />} label="Article/Story" />
              <FormControlLabel value="photo" control={<Radio />} label="Photo/Art" />
              <FormControlLabel
                value="audio"
                control={<Radio />}
                label="Audio recording (.WAV or .MP3 file)"
              />
            </RadioGroup>
          </FormControl>

          <FormControl required>
            <FormLabel sx={labelSx}>Please display my name as</FormLabel>
            <RadioGroup name="displayNameStyle" defaultValue="firstLastInitial">
              <FormControlLabel
                value="initials"
                control={<Radio />}
                label="First and Last Initials Only"
              />
              <FormControlLabel
                value="firstLastInitial"
                control={<Radio />}
                label="First Name and Last Initial"
              />
              <FormControlLabel value="anonymous" control={<Radio />} label='"Anonymous"' />
            </RadioGroup>
          </FormControl>

          <Divider />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              name="firstName"
              label="Your First Name"
              required
              fullWidth
              inputProps={{ maxLength: 80 }}
            />
            <TextField
              name="lastName"
              label="Your Last Name"
              required
              fullWidth
              inputProps={{ maxLength: 80 }}
            />
          </Stack>

          <TextField
            name="email"
            type="email"
            label="Email Address"
            required
            fullWidth
            inputProps={{ maxLength: 200 }}
          />

          <TextField
            name="mailingAddress"
            label="Mailing Address"
            fullWidth
            inputProps={{ maxLength: 300 }}
          />

          <TextField
            name="cityStateZip"
            label="City, State and Zip Code"
            fullWidth
            inputProps={{ maxLength: 200 }}
          />

          <Box>
            <FormLabel sx={labelSx}>Your Story</FormLabel>
            <TextField
              name="storyText"
              placeholder="Please paste your story here or describe the content you are uploading."
              fullWidth
              multiline
              minRows={8}
              inputProps={{ maxLength: 200000 }}
            />
          </Box>

          <Box>
            <FormLabel sx={labelSx}>Or Upload Your Story or Art</FormLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{
                borderColor: "#ffa751",
                color: "#c43c68",
                fontWeight: 700,
                "&:hover": { borderColor: "#ff6b35", background: "rgba(255,107,53,0.05)" },
              }}
            >
              {fileName || "Choose file"}
              <input
                type="file"
                name="file"
                hidden
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
            </Button>
            <Box
              sx={{
                mt: 2,
                p: 2,
                background: "#fafafa",
                borderRadius: 2,
                fontSize: "0.85rem",
                color: "#555",
                lineHeight: 1.6,
              }}
            >
              <strong>Minimum requirements for images:</strong>
              <br />
              Dimensions: 4,000px by 3,000px &nbsp;•&nbsp; Resolution: 200 dpi &nbsp;•&nbsp;
              File size: 3 MB
              <br />
              One file only. 100 MB limit.
              <br />
              <strong>Allowed types:</strong> {ALLOWED_TYPES}.
            </Box>
          </Box>

          <Divider />

          <Box>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.1rem",
                color: "#c43c68",
                mb: 1,
              }}
            >
              Important
            </Typography>
            <Typography sx={{ color: "#555", mb: 2 }}>
              In order for us to publish your work, we will need you to read and agree to the
              following terms and conditions:
            </Typography>
            <FormControlLabel
              required
              control={<Checkbox name="agreedCopyrightTransfer" />}
              label={
                <span>
                  I have read and agree with the <strong>Copyright Transfer</strong>.
                </span>
              }
            />
            <FormControlLabel
              required
              control={<Checkbox name="agreedAuthorRepresentations" />}
              label={
                <span>
                  I have read and agree with the <strong>Author Representations</strong>.
                </span>
              }
            />
          </Box>

          <Alert severity="info" sx={{ "& .MuiAlert-message": { lineHeight: 1.6 } }}>
            <strong>BE ADVISED:</strong>
            <br />
            Please do not submit any content via the website that you have already submitted
            via email.
            <br />
            Please note that all digital images uploaded must be high-resolution jpgs (300
            dpi).
          </Alert>

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Button
            type="submit"
            disabled={submitting}
            size="large"
            sx={{
              alignSelf: "flex-start",
              px: 5,
              py: 1.5,
              fontWeight: 800,
              fontSize: "1rem",
              letterSpacing: "0.02em",
              color: "#fff",
              background: "linear-gradient(135deg, #ff6b35 0%, #c43c68 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #ff8555 0%, #d4556f 100%)",
              },
              "&:disabled": { opacity: 0.6, color: "#fff" },
            }}
          >
            {submitting ? "Submitting…" : "Submit your story"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
