import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import AnniversaryForm from "../AnniversaryForm";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export const metadata = {
  title: "New anniversary (editor)",
};

export default async function NewAnniversaryPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <AnniversaryForm mode="create" />
    </Container>
  );
}
