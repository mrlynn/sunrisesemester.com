import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import ResourceForm from "../ResourceForm";

export const metadata = {
  title: "New resource",
};

export default async function NewResourcePage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <ResourceForm mode="create" />
    </Container>
  );
}
