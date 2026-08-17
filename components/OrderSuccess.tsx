"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/CartProvider";

export default function OrderSuccess({ orderNumber }: { orderNumber: string }) {
  const { clear } = useCart();
  useEffect(() => clear(), [clear]);
  return (
    <section className="confirmed">
      <span aria-hidden="true">&#10003;</span>
      <p className="eyebrow">Payment confirmed</p>
      <h1>Thank you.</h1>
      <p>
        Your payment was successful. Your reference is <b>{orderNumber}</b> and
        a receipt has been sent by email.
      </p>
      <Link className="button" href="/account/orders">
        View your orders
      </Link>
    </section>
  );
}
