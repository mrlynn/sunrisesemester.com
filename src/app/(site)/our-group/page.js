import GroupLife from "@/components/GroupLife";
import { listPublishedAnniversaries } from "@/lib/anniversaries";
import { listPublicMemberAnniversaries } from "@/lib/groupMembers";
import { listPublishedServiceRoles } from "@/lib/serviceRoles";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Group — Sunrise Semester",
  description:
    "Trusted servants and sobriety anniversaries of the Sunrise Semester home group.",
};

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
