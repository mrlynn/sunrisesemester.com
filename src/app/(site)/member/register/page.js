import MemberRegisterForm from "@/components/MemberRegisterForm";

export const metadata = {
  title: "Member registration",
  description: "Create a Sunrise Semester home group member account.",
  robots: { index: false, follow: false },
};

export default function MemberRegisterPage() {
  return <MemberRegisterForm />;
}
