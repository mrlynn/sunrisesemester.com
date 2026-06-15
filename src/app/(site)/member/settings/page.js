import MemberSettingsForm from "@/components/MemberSettingsForm";

export const metadata = {
  title: "My group profile",
  robots: { index: false, follow: false },
};

export default function MemberSettingsPage() {
  return <MemberSettingsForm />;
}
