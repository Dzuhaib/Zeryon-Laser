"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/money";
import Image from "next/image";
export default function Cart() {
  const { items, remove, setQuantity, total } = useCart();
  return (
    <section className="cart-page">
      <p className="eyebrow">Your selection</p>
      <h1>Cart.</h1>
      {!items.length ? (
        <div className="empty">
          <p>Your cart is currently empty.</p>
          <Link className="button" href="/machines">
            Explore machines
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            {items.map((i) => (
              <article className="cart-row" key={i.product._id}>
                <div className="cart-thumb">
                  {i.product.image ? (
                    <Image
                      src={i.product.image}
                      alt={i.product.name}
                      width={180}
                      height={180}
                    />
                  ) : (
                    <span>Z</span>
                  )}
                </div>
                <div>
                  <h3>{i.product.name}</h3>
                  <p>{i.product.category}</p>
                  <button onClick={() => remove(i.product._id)}>Remove</button>
                </div>
                <input
                  aria-label="Quantity"
                  type="number"
                  min="1"
                  value={i.quantity}
                  onChange={(e) => setQuantity(i.product._id, +e.target.value)}
                />
                <strong>{money((i.product.price || 0) * i.quantity)}</strong>
              </article>
            ))}
          </div>
          <aside className="summary">
            <p>Order summary</p>
            <div>
              <span>Subtotal (ex VAT)</span>
              <b>{money(total)}</b>
            </div>
            <small>
              VAT is calculated at checkout. Delivery, configuration and any
              training requirements will be confirmed before fulfilment.
            </small>
            <Link className="button" href="/checkout">
              Continue to checkout
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}
