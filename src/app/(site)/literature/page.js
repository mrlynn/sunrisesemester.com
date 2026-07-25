import LiteraturePage from "@/components/LiteraturePage";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const metadata = pageSocialMetadata({
  title: "Literature",
  description:
    "Key literature used in Sunrise Semester meetings — readings, steps, and foundational texts.",
  path: "/literature",
});

export default function Literature() {
  return <LiteraturePage />;
}
