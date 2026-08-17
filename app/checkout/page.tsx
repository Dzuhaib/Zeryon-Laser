"use client";

import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/money";
import { calculateTotalWithVat, calculateVat } from "@/lib/vat";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function CheckoutForm() {
  const { items, total } = useCart();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const vat = calculateVat(total);
  const totalWithVat = calculateTotalWithVat(total);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const form = new FormData(event.currentTarget);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customer: Object.fromEntries(form),
          items: items.map((item) => ({
            productId: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.url)
        throw new Error(
          data.error || "We could not start payment. Please try again.",
        );
      window.location.assign(data.url);
    } catch (error) {
      setLoading(false);
      alert(
        error instanceof Error
          ? error.message
          : "We could not start payment. Please try again.",
      );
    }
  }

  return (
    <section className="checkout">
      <div>
        <p className="eyebrow">Secure Stripe checkout</p>
        <h1>Complete your order.</h1>
        <p>
          Enter your details, then pay securely by card through Stripe. We will
          contact you after payment to confirm configuration and fulfilment.
        </p>
        {searchParams.get("cancelled") === "1" && (
          <p className="form-error">
            Payment was cancelled. Your cart has been kept.
          </p>
        )}
      </div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            First name
            <input required name="firstName" maxLength={80} />
          </label>
          <label>
            Last name
            <input required name="lastName" maxLength={80} />
          </label>
          <label>
            Email
            <input required type="email" name="email" maxLength={254} />
          </label>
          <label>
            Phone
            <input required name="phone" maxLength={40} />
          </label>
          <label className="wide">
            Business
            <input name="business" maxLength={120} />
          </label>
          <label className="wide">
            Address
            <input required name="address" maxLength={200} />
          </label>
          <label>
            Town / City
            <input required name="city" maxLength={100} />
          </label>
          <label>
            Postcode
            <input required name="postcode" maxLength={20} />
          </label>
        </div>
        <label>
          Order notes
          <textarea rows={3} name="notes" maxLength={1000} />
        </label>
        <div className="checkout-totals">
          <div>
            <span>Subtotal</span>
            <b>{money(total)}</b>
          </div>
          <div>
            <span>VAT (20%)</span>
            <b>{money(vat)}</b>
          </div>
          <div className="checkout-total">
            <span>Total including VAT</span>
            <b>{money(totalWithVat)}</b>
          </div>
        </div>
        <button disabled={loading || !items.length} className="button">
          {loading ? "Opening secure payment..." : "Pay securely with Stripe"}
        </button>
      </form>
    </section>
  );
}

export default function Checkout() {
  return (
    <Suspense
      fallback={
        <section className="checkout">
          <p>Loading checkout...</p>
        </section>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
}
