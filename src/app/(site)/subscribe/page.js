import SubscribeForm from "@/components/SubscribeForm";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const metadata = pageSocialMetadata({
  title: "Get updates",
  description:
    "Subscribe to occasional Sunrise Semester group updates about meetings, events, and news.",
  path: "/subscribe",
});

export default function SubscribePage() {
  return <SubscribeForm />;
}
