import { Source_Serif_4 } from "next/font/google";
import "./globals.css";
import AppProviders from "@/components/AppProviders";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={sourceSerif.variable}>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
