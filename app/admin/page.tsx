"use client";
import { useState } from "react";
import { money } from "@/lib/money";
export default function Admin() {
  const [key, setKey] = useState("");
  const [orders, setOrders] = useState<any[] | null>(null);
  const [error, setError] = useState("");
  async function load() {
    const r = await fetch("/api/orders/list", {
      headers: { "x-admin-key": key },
    });
    if (!r.ok) {
      setError("Access key not recognised.");
      return;
    }
    setOrders(await r.json());
    setError("");
  }
  return (
    <section className="admin">
      <p className="eyebrow">ZERYON operations</p>
      <h1>Order desk.</h1>
      {orders === null ? (
        <div className="admin-login">
          <p>
            Enter the private admin access key to view orders received through
            the website.
          </p>
          <input
            type="password"
            placeholder="Admin access key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <button className="button" onClick={load}>
            Open order desk
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <div className="orders">
          <div className="order-heading">
            <span>Reference</span>
            <span>Customer</span>
            <span>Status</span>
            <span>Total</span>
          </div>
          {orders.length ? (
            orders.map((o) => (
              <article key={o._id}>
                <b>{o.orderNumber}</b>
                <span>
                  {o.customer?.firstName} {o.customer?.lastName}
                  <small>{o.customer?.email}</small>
                </span>
                <em>{o.status}</em>
                <strong>{money(o.total)}</strong>
              </article>
            ))
          ) : (
            <p>
              No orders yet. New orders will appear here once Sanity is
              configured.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
