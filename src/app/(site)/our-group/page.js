import GroupLife from "@/components/GroupLife";
import { listPublishedAnniversaries } from "@/lib/anniversaries";
import { listPublicMemberAnniversaries } from "@/lib/groupMembers";
import { listPublishedServiceRoles } from "@/lib/serviceRoles";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const dynamic = "force-dynamic";

export const metadata = pageSocialMetadata({
  title: "Our Group",
  description:
    "Trusted servants and sobriety anniversaries of the Sunrise Semester home group.",
  path: "/our-group",
});

export default async function OurGroupPage() {
  const now = new Date();
  const [editorAnniversaries, memberAnniversaries, serviceRoles] = await Promise.all([
    listPublishedAnniversaries().catch(() => []),
    listPublicMemberAnniversaries(now).catch(() => []),
    listPublishedServiceRoles().catch(() => []),
  ]);

  const anniversaries = [...editorAnniversaries, ...memberAnniversaries].sort(
    (a, b) => a.daysToNext - b.daysToNext,
  );

  return <GroupLife anniversaries={anniversaries} serviceRoles={serviceRoles} />;
}
