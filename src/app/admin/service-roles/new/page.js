import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import ServiceRoleForm from "../ServiceRoleForm";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export const metadata = {
  title: "New service role (editor)",
};

export default async function NewServiceRolePage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ServiceRoleForm mode="create" />
    </Container>
  );
}
