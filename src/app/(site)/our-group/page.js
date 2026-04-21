import GroupLife from "@/components/GroupLife";
import { listPublishedAnniversaries } from "@/lib/anniversaries";
import { listPublishedServiceRoles } from "@/lib/serviceRoles";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Group — Sunrise Semester",
  description:
    "Trusted servants and sobriety anniversaries of the Sunrise Semester home group.",
};

export default async function OurGroupPage() {
  const [anniversaries, serviceRoles] = await Promise.all([
    listPublishedAnniversaries().catch(() => []),
    listPublishedServiceRoles().catch(() => []),
  ]);
  return <GroupLife anniversaries={anniversaries} serviceRoles={serviceRoles} />;
}
