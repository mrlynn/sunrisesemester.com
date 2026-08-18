import MeetingTopicChooser from "@/components/MeetingTopicChooser";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const metadata = pageSocialMetadata({
  title: "Meeting Topic Chooser",
  description:
    "Choose an AA discussion topic and prepare a welcoming, chair-ready meeting opening.",
  path: "/meeting-topics",
});

export default function MeetingTopicsPage() {
  return <MeetingTopicChooser />;
}
