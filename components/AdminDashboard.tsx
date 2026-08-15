"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { money } from "@/lib/money";
import Link from "next/link";
import {
  ArrowLeft,
  BellRing,
  Boxes,
  LayoutDashboard,
  ShoppingCart,
} from "lucide-react";

type Product = {
  _id: string;
  name: string;
  price: number;
  category: string;
  slug: string;
  summary?: string;
  description?: string;
  applications?: string[];
  features?: string[];
  included?: string[];
  specifications?: Array<{ label: string; value: string }>;
  featured?: boolean;
  order?: number;
  image?: string;
};
type Order = {
  _id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  total: number;
  customer?: { firstName?: string; lastName?: string; email?: string };
  items?: Array<{ name: string; quantity: number }>;
};
type StoreEvent = {
  _id: string;
  event: "product_view" | "cart_add";
  createdAt: string;
  productId: string;
  productName: string;
  userId?: string;
  customerEmail?: string;
};
type Dashboard = {
  products: Product[];
  orders: Order[];
  users: number;
  salesByDay: Record<string, number>;
  events: StoreEvent[];
};

export default function AdminDashboard() {
  const [range, setRange] = useState("30");
  const [data, setData] = useState<Dashboard | null>(null);
  const [tab, setTab] = useState<"overview" | "orders" | "products">(
    "overview",
  );
  const [notice, setNotice] = useState("");
  const [alerts, setAlerts] = useState(false);
  const previousNewOrders = useRef(0);
  const load = async () => {
    const now = Date.now();
    const from =
      range === "all"
        ? ""
        : new Date(now - Number(range) * 86400000).toISOString();
    const response = await fetch(
      `/api/admin/dashboard?from=${encodeURIComponent(from)}`,
    );
    if (response.ok) setData(await response.json());
  };
  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, [range]);
  useEffect(() => {
    const newOrders =
      data?.orders.filter((order) => order.status === "new").length || 0;
    if (
      alerts &&
      previousNewOrders.current &&
      newOrders > previousNewOrders.current
    ) {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      oscillator.connect(context.destination);
      oscillator.frequency.value = 880;
      oscillator.start();
      oscillator.stop(context.currentTime + 0.18);
    }
    previousNewOrders.current = newOrders;
  }, [data, alerts]);
  const sales =
    data?.orders
      .filter((order) => order.status !== "cancelled")
      .reduce((sum, order) => sum + Number(order.total || 0), 0) || 0;
  const topProducts = useMemo(() => {
    const counts: Record<string, number> = {};
    data?.orders
      .filter((order) => order.status !== "cancelled")
      .forEach((order) =>
        order.items?.forEach((item) => {
          counts[item.name] = (counts[item.name] || 0) + item.quantity;
        }),
      );
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [data]);
  const chart = Object.entries(data?.salesByDay || {}).slice(-14);
  const views = useMemo(() => {
    const counts: Record<string, number> = {};
    data?.events
      .filter((event) => event.event === "product_view")
      .forEach((event) => {
        counts[event.productName] = (counts[event.productName] || 0) + 1;
      });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [data]);
  const cartEvents =
    data?.events.filter((event) => event.event === "cart_add").slice(0, 10) ||
    [];
  const max = Math.max(...chart.map(([, value]) => value), 1);
  async function updateOrder(id: string, status: string) {
    const response = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      setNotice("Order updated and customer notified.");
      load();
    }
  }
  async function deleteProduct(id: string) {
    if (!confirm("Delete this product from Sanity?")) return;
    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      setNotice("Product deleted.");
      load();
    }
  }

  if (!data)
    return (
      <section className="admin-loading">
        <span className="admin-brand-mark">Z</span>
        <p>Loading ZERYON dashboard...</p>
      </section>
    );
  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <img
            className="admin-brand-logo"
            src="/ZERYO%20LOGO%20TRANSPARENT.png"
            alt="ZERYON"
          />
          <span>
            <small>Admin console</small>
          </span>
        </Link>
        <nav className="admin-tabs" aria-label="Dashboard navigation">
          <button
            className={tab === "overview" ? "active" : ""}
            onClick={() => setTab("overview")}
          >
            <LayoutDashboard size={18} /> Overview
          </button>
          <button
            className={tab === "orders" ? "active" : ""}
            onClick={() => setTab("orders")}
          >
            <ShoppingCart size={18} /> Orders
            <b>
              {data.orders.filter((order) => order.status === "new").length}
            </b>
          </button>
          <button
            className={tab === "products" ? "active" : ""}
            onClick={() => setTab("products")}
          >
            <Boxes size={18} /> Products
          </button>
        </nav>
        <Link href="/" className="admin-back-link">
          <ArrowLeft size={17} /> Back to website
        </Link>
      </aside>
      <div className="admin-workspace">
        <header className="admin-dashboard-head">
          <div>
            <p className="eyebrow">Store operations</p>
            <h1>
              {tab === "overview"
                ? "Dashboard"
                : tab === "orders"
                  ? "Orders"
                  : "Products"}
            </h1>
          </div>
          <div className="admin-head-actions">
            <button className="text-button" onClick={() => setAlerts(true)}>
              <BellRing size={16} />
              {alerts ? "Alerts enabled" : "Enable alerts"}
            </button>
            <select
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </header>
        {notice && <p className="admin-notice">{notice}</p>}
        {tab === "overview" && (
          <>
            <div className="admin-metrics">
              <article>
                <span>Sales</span>
                <strong>{money(sales)}</strong>
              </article>
              <article>
                <span>Orders</span>
                <strong>{data.orders.length}</strong>
              </article>
              <article>
                <span>Customers</span>
                <strong>{data.users}</strong>
              </article>
              <article>
                <span>Products</span>
                <strong>{data.products.length}</strong>
              </article>
            </div>
            <div className="admin-dashboard-grid">
              <article className="admin-panel sales-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="eyebrow">Performance</p>
                    <h2>Sales trend</h2>
                  </div>
                  <span>
                    {range === "all" ? "All time" : `Last ${range} days`}
                  </span>
                </div>
                <div className="sales-chart sales-chart-line">
                  {chart.length ? (
                    <>
                      <svg
                        viewBox="0 0 700 220"
                        role="img"
                        aria-label="Sales trend"
                      >
                        <path
                          className="chart-grid"
                          d="M20 20H680 M20 110H680 M20 200H680"
                        />
                        <polyline
                          className="chart-line"
                          points={chart
                            .map(
                              ([, value], index) =>
                                `${20 + index * (660 / Math.max(chart.length - 1, 1))},${200 - (value / max) * 170}`,
                            )
                            .join(" ")}
                        />
                        {chart.map(([day, value], index) => (
                          <circle
                            key={day}
                            className="chart-dot"
                            cx={
                              20 + index * (660 / Math.max(chart.length - 1, 1))
                            }
                            cy={200 - (value / max) * 170}
                            r="4"
                          >
                            <title>
                              {day}: {money(value)}
                            </title>
                          </circle>
                        ))}
                      </svg>
                      <div className="chart-labels">
                        {chart.map(([day]) => (
                          <small key={day}>{day.slice(5)}</small>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="muted">
                      Sales will appear here after the first order.
                    </p>
                  )}
                </div>
              </article>
              <article className="admin-panel">
                <div className="admin-panel-head">
                  <div>
                    <p className="eyebrow">Product performance</p>
                    <h2>Top sellers</h2>
                  </div>
                </div>
                {topProducts.length ? (
                  <ol className="top-products">
                    {topProducts.map(([name, count]) => (
                      <li key={name}>
                        <span>{name}</span>
                        <strong>{count} sold</strong>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="muted">No product sales yet.</p>
                )}
              </article>
            </div>
          </>
        )}
        {tab === "overview" && (
          <div className="admin-insights">
            <article className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <p className="eyebrow">Attention</p>
                  <h2>Most viewed</h2>
                </div>
              </div>
              {views.length ? (
                <ol className="top-products">
                  {views.map(([name, count]) => (
                    <li key={name}>
                      <span>{name}</span>
                      <strong>{count} views</strong>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="muted">Product views will appear here.</p>
              )}
            </article>
            <article className="admin-panel">
              <div className="admin-panel-head">
                <div>
                  <p className="eyebrow">Cart activity</p>
                  <h2>Recently added</h2>
                </div>
              </div>
              {cartEvents.length ? (
                <div className="cart-activity">
                  {cartEvents.map((event) => (
                    <div key={event._id}>
                      <span>{event.productName}</span>
                      <small>{event.customerEmail || "Guest customer"}</small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="muted">Cart activity will appear here.</p>
              )}
            </article>
          </div>
        )}
        {tab === "orders" && (
          <div className="admin-panel admin-orders">
            <div className="admin-panel-head">
              <div>
                <p className="eyebrow">Fulfilment</p>
                <h2>New and recent orders</h2>
              </div>
              <button className="button small" onClick={load}>
                Refresh
              </button>
            </div>
            {data.orders.length ? (
              data.orders.map((order) => (
                <article className="admin-order" key={order._id}>
                  <div>
                    <strong>{order.orderNumber}</strong>
                    <small>
                      {order.customer?.firstName} {order.customer?.lastName} ·{" "}
                      {order.customer?.email}
                    </small>
                    <small>
                      {new Date(order.createdAt).toLocaleString("en-GB")}
                    </small>
                  </div>
                  <span>
                    {order.items
                      ?.map((item) => `${item.quantity} × ${item.name}`)
                      .join(", ")}
                  </span>
                  <strong>{money(order.total)}</strong>
                  <select
                    value={order.status}
                    onChange={(event) =>
                      updateOrder(order._id, event.target.value)
                    }
                  >
                    <option>new</option>
                    <option>contacted</option>
                    <option>confirmed</option>
                    <option>fulfilled</option>
                    <option>cancelled</option>
                  </select>
                </article>
              ))
            ) : (
              <p className="muted">No orders in this period.</p>
            )}
          </div>
        )}
        {tab === "products" && (
          <ProductManager
            products={data.products}
            onDelete={deleteProduct}
            onCreated={() => {
              setNotice("Product created in Sanity.");
              load();
            }}
          />
        )}
      </div>
    </section>
  );
}

function ProductManager({
  products,
  onDelete,
  onCreated,
}: {
  products: Product[];
  onDelete: (id: string) => void;
  onCreated: () => void;
}) {
  const emptyForm = {
    name: "",
    slug: "",
    category: "Machine + Training",
    price: "",
    summary: "",
    description: "",
    applications: "",
    features: "",
    included: "",
    specifications: "",
    featured: true,
    order: "",
    imageData: "",
    imageName: "",
  };
  const [form, setForm] = useState({
    name: "",
    slug: "",
    category: "Machine + Training",
    price: "",
    summary: "",
    description: "",
    applications: "",
    features: "",
    included: "",
    specifications: "",
    featured: true,
    order: "",
    imageData: "",
    imageName: "",
  });
  const [editing, setEditing] = useState<string | null>(null);
  const update = (key: string, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));
  const parseList = (value: string) =>
    value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  const parseSpecs = (value: string) =>
    value
      .split("\n")
      .map((line) => {
        const [label, ...rest] = line.split("|");
        return { label: label?.trim(), value: rest.join("|").trim() };
      })
      .filter((item) => item.label && item.value);
  async function chooseImage(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setForm((current) => ({
        ...current,
        imageData: String(reader.result),
        imageName: file.name,
      }));
    reader.readAsDataURL(file);
  }
  async function create(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(
      editing ? `/api/admin/products/${editing}` : "/api/admin/products",
      {
        method: editing ? "PATCH" : "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          applications: parseList(form.applications),
          features: parseList(form.features),
          included: parseList(form.included),
          specifications: parseSpecs(form.specifications),
          order: Number(form.order || 99),
        }),
      },
    );
    if (response.ok) {
      setForm(emptyForm);
      setEditing(null);
      onCreated();
    }
  }
  function edit(product: Product) {
    setEditing(product._id);
    setForm({
      ...emptyForm,
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: String(product.price || ""),
      summary: product.summary || "",
      description: product.description || "",
      applications: (product.applications || []).join("\n"),
      features: (product.features || []).join("\n"),
      included: (product.included || []).join("\n"),
      specifications: (product.specifications || [])
        .map((item) => `${item.label} | ${item.value}`)
        .join("\n"),
      featured: product.featured !== false,
      order: String(product.order || ""),
    });
  }
  return (
    <div className="admin-products">
      <article className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <p className="eyebrow">Catalogue</p>
            <h2>Manage products</h2>
          </div>
        </div>
        {products.map((product) => (
          <div className="admin-product-row" key={product._id}>
            <div>
              <strong>{product.name}</strong>
              <small>
                {product.category} · {product.slug}
              </small>
            </div>
            <b>{money(product.price)}</b>
            <a
              className="text-button"
              href={`/machines/${product.slug}`}
              target="_blank"
            >
              View
            </a>
            <button className="text-button" onClick={() => edit(product)}>
              Edit
            </button>
            <button
              className="text-button danger"
              onClick={() => onDelete(product._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </article>
      <article className="admin-panel">
        <div className="admin-panel-head">
          <div>
            <p className="eyebrow">Sanity catalogue</p>
            <h2>{editing ? "Edit product" : "Add product"}</h2>
          </div>
        </div>
        <form className="admin-product-form" onSubmit={create}>
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
            />
          </label>
          <label>
            Treatment applications
            <textarea
              placeholder="One item per line"
              value={form.applications}
              onChange={(event) => update("applications", event.target.value)}
            />
          </label>
          <label>
            Key features
            <textarea
              placeholder="One item per line"
              value={form.features}
              onChange={(event) => update("features", event.target.value)}
            />
          </label>
          <label>
            What's included
            <textarea
              placeholder="One item per line"
              value={form.included}
              onChange={(event) => update("included", event.target.value)}
            />
          </label>
          <label>
            Specifications
            <textarea
              placeholder="Label | Value (one per line)"
              value={form.specifications}
              onChange={(event) => update("specifications", event.target.value)}
            />
          </label>
          <label>
            Product image
            <input
              type="file"
              accept="image/*"
              onChange={(event) => chooseImage(event.target.files?.[0])}
            />
          </label>
          <label>
            Display order
            <input
              type="number"
              value={form.order}
              onChange={(event) => update("order", event.target.value)}
            />
          </label>
          <label className="admin-checkbox">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => update("featured", event.target.checked)}
            />{" "}
            Featured product
          </label>
          <label>
            Slug
            <input
              required
              value={form.slug}
              onChange={(event) =>
                setForm({ ...form, slug: event.target.value })
              }
            />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(event) =>
                setForm({ ...form, category: event.target.value })
              }
            />
          </label>
          <label>
            Price excluding VAT
            <input
              required
              type="number"
              min="0"
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: event.target.value })
              }
            />
          </label>
          <label>
            Summary
            <textarea
              value={form.summary}
              onChange={(event) =>
                setForm({ ...form, summary: event.target.value })
              }
            />
          </label>
          <button className="button" type="submit">
            {editing ? "Save changes" : "Create product"}
          </button>
        </form>
      </article>
    </div>
  );
}
