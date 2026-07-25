import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/AppProviders";
import { SITE_URL } from "@/lib/siteUrl";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Sunrise Semester — AA Home Group",
    template: "%s — Sunrise Semester",
  },
  description:
    "Meeting information, stories, and resources for the Sunrise Semester home group of Alcoholics Anonymous.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    siteName: "Sunrise Semester",
    title: "Sunrise Semester — AA Home Group",
    description:
      "Meeting information, stories, and resources for the Sunrise Semester home group of Alcoholics Anonymous.",
    locale: "en_US",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunrise Semester — AA Home Group",
    description:
      "Meeting information, stories, and resources for the Sunrise Semester home group of Alcoholics Anonymous.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceSerif.variable}`}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
