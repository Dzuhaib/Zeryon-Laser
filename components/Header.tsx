"use client";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";
export function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  return (
    <header className="header">
      <Link href="/" className="wordmark">
        <img
          className="brand-logo"
          src="/ZERYO%20LOGO%20TRANSPARENT.png"
          alt="ZERYON"
        />
      </Link>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? "open" : ""}>
        <Link href="/machines">Machines</Link>
        <Link href="/#training">Training</Link>
        <Link href="/about">About</Link>
        <Link href="/#support">Support</Link>
        <Link href="/#faqs">FAQs</Link>
      </nav>
      <div className="header-actions">
        <Link
          className="cart-link"
          href="/cart"
          aria-label={`Cart with ${count} items`}
        >
          <ShoppingBag size={19} />
          {count > 0 && <span>{count}</span>}
        </Link>
        <Link href="/#contact" className="button small">
          Speak to us
        </Link>
      </div>
    </header>
  );
}
