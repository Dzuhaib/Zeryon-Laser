import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getStripe } from "@/lib/stripe";
import OrderSuccess from "@/components/OrderSuccess";

export default async function Confirmed({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const { userId } = await auth();
  if (!sessionId || !userId) redirect("/account");
  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    redirect("/account/orders");
  }
  if (session.metadata?.userId !== userId || session.payment_status !== "paid")
    redirect("/checkout");
  return <OrderSuccess orderNumber={session.metadata.orderNumber || ""} />;
}
