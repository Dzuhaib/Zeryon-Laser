"use client";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/money";
import { calculateTotalWithVat, calculateVat } from "@/lib/vat";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Checkout() {
  const { items, total } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const vat = calculateVat(total);
  const totalWithVat = calculateTotalWithVat(total);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customer: Object.fromEntries(f),
        items: items.map((i) => ({
          productId: i.product._id,
          name: i.product.name,
          price: i.product.price || 0,
          quantity: i.quantity,
        })),
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      setLoading(false);
      alert(data.error || "We could not submit your order. Please try again.");
      return;
    }
    router.push(
      `/order-confirmed?order=${encodeURIComponent(data.orderNumber)}`,
    );
  }
  return (
    <section className="checkout">
      <div>
        <p className="eyebrow">Secure enquiry checkout</p>
        <h1>Complete your details.</h1>
        <p>
          We’ll receive your order request, confirm equipment configuration and
          contact you before fulfilment.
        </p>
      </div>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            First name
            <input required name="firstName" />
          </label>
          <label>
            Last name
            <input required name="lastName" />
          </label>
          <label>
            Email
            <input required type="email" name="email" />
          </label>
          <label>
            Phone
            <input required name="phone" />
          </label>
          <label className="wide">
            Business
            <input name="business" />
          </label>
          <label className="wide">
            Address
            <input required name="address" />
          </label>
          <label>
            Town / City
            <input required name="city" />
          </label>
          <label>
            Postcode
            <input required name="postcode" />
          </label>
        </div>
        <label>
          Order notes
          <textarea rows={3} name="notes" />
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
          {loading ? "Sending…" : "Place order request"}
        </button>
      </form>
    </section>
  );
}
