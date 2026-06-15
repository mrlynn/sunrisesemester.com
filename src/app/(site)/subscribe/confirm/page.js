import SubscribeConfirmClient from "@/components/SubscribeConfirmClient";

export const metadata = {
  title: "Confirm subscription",
  robots: { index: false, follow: false },
};

export default async function SubscribeConfirmPage({ searchParams }) {
  const params = await searchParams;
  const token = typeof params?.token === "string" ? params.token : "";
  return <SubscribeConfirmClient token={token} />;
}
