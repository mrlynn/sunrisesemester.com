import NewcomerWelcome from "@/components/NewcomerWelcome";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const metadata = pageSocialMetadata({
  title: "New here? Start here",
  description:
    "A quiet welcome for anyone wondering if AA might help. What to expect at your first Zoom meeting, a short self-test, and how to join us tomorrow morning.",
  path: "/newcomer",
});

export default function NewcomerPage() {
  return <NewcomerWelcome />;
}
