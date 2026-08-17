import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { getProducts, sanityWrite } from "@/lib/sanity";
import { requireAdmin } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    if (!sanityWrite)
      return NextResponse.json({
        products: await getProducts(),
        orders: [],
        users: 0,
      });
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const orders = await sanityWrite.fetch(
      `*[_type == "order" && (paymentStatus == "paid" || !defined(paymentStatus)) && (!defined($from) || createdAt >= $from) && (!defined($to) || createdAt <= $to)] | order(createdAt desc)`,
      { from, to },
    );
    const products = await getProducts();
    const events = await sanityWrite.fetch(
      `*[_type == "storeEvent" && (!defined($from) || createdAt >= $from) && (!defined($to) || createdAt <= $to)] | order(createdAt desc)[0...500]`,
      { from, to },
    );
    let users = 0;
    try {
      users = (await (await clerkClient()).users.getCount()) || 0;
    } catch {
      /* Clerk user counts are optional */
    }
    const salesByDay = orders.reduce(
      (result: Record<string, number>, order: any) => {
        if (order.status === "cancelled" || order.paymentStatus !== "paid")
          return result;
        const day = String(order.createdAt || "").slice(0, 10);
        result[day] = (result[day] || 0) + Number(order.total || 0);
        return result;
      },
      {},
    );
    return NextResponse.json({ products, orders, users, salesByDay, events });
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
