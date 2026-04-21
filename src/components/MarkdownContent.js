import Box from "@mui/material/Box";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ markdown }) {
  if (!markdown) {
    return null;
  }
  return (
    <Box
      sx={{
        "& > *": {
          maxWidth: "100%",
        },
        "& p": {
          mb: 2.5,
          fontSize: "1.1rem",
          lineHeight: 1.75,
          color: "#333333",
        },
        "& ul, & ol": {
          pl: 3,
          mb: 2.5,
        },
        "& li": {
          mb: 1,
          lineHeight: 1.75,
          color: "#333333",
        },
        "& a": {
          color: "#ff6b35",
          fontWeight: 700,
          transition: "all 0.2s ease",
          textDecoration: "underline",
          "&:hover": {
            color: "#ff5a1f",
          },
        },
        "& h2": {
          mt: 4,
          mb: 1.5,
          fontSize: "2.5rem",
          fontWeight: 800,
          lineHeight: 1.15,
          color: "#1d1d1d",
          fontFamily: 'var(--font-serif), Georgia, serif',
        },
        "& h3": {
          mt: 3,
          mb: 1.2,
          fontSize: "2rem",
          fontWeight: 800,
          lineHeight: 1.25,
          color: "#1d1d1d",
          fontFamily: 'var(--font-serif), Georgia, serif',
        },
        "& h4": {
          mt: 2.5,
          mb: 1,
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#1d1d1d",
          fontFamily: 'var(--font-serif), Georgia, serif',
        },
        "& code": {
          bgcolor: "#f5f5f5",
          color: "#ff6b35",
          px: 0.75,
          py: 0.4,
          borderRadius: 1.5,
          fontFamily: 'ui-monospace, "Fira Code", "SFMono-Regular", Menlo, Monaco, Consolas, monospace',
          fontSize: "0.9em",
          fontWeight: 700,
        },
        "& pre": {
          bgcolor: "#1d1d1d",
          color: "#e8e8e8",
          p: 3,
          borderRadius: 2,
          overflow: "auto",
          mb: 2.5,
          border: "2px solid #333333",
          "& code": {
            bgcolor: "transparent",
            color: "inherit",
            px: 0,
            py: 0,
            fontSize: "0.95rem",
            fontWeight: 400,
          },
        },
        "& blockquote": {
          borderLeft: "4px solid #ff6b35",
          pl: 3,
          ml: 0,
          my: 2.5,
          py: 0.5,
          color: "#666666",
          fontStyle: "italic",
          fontSize: "1.1rem",
          lineHeight: 1.75,
        },
        "& hr": {
          my: 4,
          borderColor: "#e8e8e8",
          borderWidth: "2px",
        },
        "& table": {
          width: "100%",
          borderCollapse: "collapse",
          mb: 2.5,
          border: "2px solid #1d1d1d",
          borderRadius: 1,
          overflow: "hidden",
        },
        "& th": {
          bgcolor: "#1d1d1d",
          color: "#ffffff",
          p: 1.5,
          textAlign: "left",
          fontWeight: 700,
          borderBottom: "2px solid #333333",
        },
        "& td": {
          p: 1.5,
          borderBottom: "1px solid #e8e8e8",
          color: "#333333",
        },
        "& tbody tr:hover": {
          bgcolor: "#f5f5f5",
        },
      }}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </Box>
  );
}
