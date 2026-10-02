import ServantRolesPage from "@/components/ServantRolesPage";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const metadata = pageSocialMetadata({
  title: "Servant Roles",
  description:
    "Suggested duties for Sunrise Semester meeting officers, with local service through SEPIA and Southeastern Pennsylvania.",
  path: "/servant-roles",
});

export default function ServantRoles() {
  return <ServantRolesPage />;
}
