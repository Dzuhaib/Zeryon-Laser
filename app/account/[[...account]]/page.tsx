import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { CustomerAddressForm, ZeryonUserProfile } from "@/components/ClerkAuth";
import { getCustomerOrders } from "@/lib/sanity";
import { money } from "@/lib/money";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ account?: string[] }>;
}) {
  const user = await currentUser();
  const { account = [] } = await params;
  const view = account[0] || "overview";
  const email = user?.primaryEmailAddress?.emailAddress || "";
  const orders = await getCustomerOrders(email);
  const firstName = user?.firstName || "Customer";
  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <section className="customer-account">
      <header className="customer-account-head">
        <div>
          <p className="eyebrow">Customer account</p>
          <h1>Welcome, {firstName}.</h1>
          <p>
            Manage your details, review orders and continue building your
            clinic.
          </p>
        </div>
        <Link className="button" href="/machines">
          Browse machines
        </Link>
      </header>

      <div className="customer-account-layout">
        <aside className="account-nav" aria-label="Account navigation">
          <Link className={view === "overview" ? "active" : ""} href="/account">
            Overview
          </Link>
          <Link
            className={view === "orders" ? "active" : ""}
            href="/account/orders"
          >
            Orders
          </Link>
          <Link
            className={view === "profile" ? "active" : ""}
            href="/account/profile"
          >
            Profile & security
          </Link>
        </aside>

        <div className="account-content">
          {view === "profile" ? (
            <div className="account-profile-panel">
              <div className="account-section-head">
                <p className="eyebrow">Personal details</p>
                <h2>Profile & security</h2>
              </div>
              <ZeryonUserProfile />
            </div>
          ) : view === "orders" ? (
            <OrderHistory orders={orders} />
          ) : (
            <>
              <div className="account-metrics">
                <article>
                  <span>Orders</span>
                  <strong>{orders.length}</strong>
                </article>
                <article>
                  <span>Total invested</span>
                  <strong>{money(totalSpent)}</strong>
                </article>
                <article>
                  <span>Account</span>
                  <strong>Active</strong>
                </article>
              </div>
              <div className="account-detail-grid">
                <article className="account-block">
                  <div className="account-section-head">
                    <p className="eyebrow">Recent activity</p>
                    <h2>Your orders</h2>
                  </div>
                  <OrderList orders={orders.slice(0, 3)} />
                  {orders.length > 3 && (
                    <Link className="text-link" href="/account/orders">
                      View all orders
                    </Link>
                  )}
                </article>
                <article className="account-block account-contact-card">
                  <div className="account-section-head">
                    <p className="eyebrow">Account details</p>
                    <h2>{user?.fullName || firstName}</h2>
                  </div>
                  <p>{email}</p>
                  <Link className="text-link" href="/account/profile">
                    Edit profile & security
                  </Link>
                </article>
              </div>
              <article className="account-block account-address-block">
                <div className="account-section-head">
                  <p className="eyebrow">Checkout details</p>
                  <h2>Saved delivery address</h2>
                  <p>
                    Keep your details ready for future equipment and training
                    orders.
                  </p>
                </div>
                <CustomerAddressForm
                  initialAddress={
                    (user?.unsafeMetadata?.address as {
                      line1?: string;
                      line2?: string;
                      city?: string;
                      postcode?: string;
                      country?: string;
                    }) || undefined
                  }
                />
              </article>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function OrderHistory({
  orders,
}: {
  orders: Awaited<ReturnType<typeof getCustomerOrders>>;
}) {
  return (
    <div className="account-block account-orders-full">
      <div className="account-section-head">
        <p className="eyebrow">Purchase history</p>
        <h2>Your orders</h2>
        <p>Review equipment purchases, totals and fulfilment progress.</p>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}

function OrderList({
  orders,
}: {
  orders: Awaited<ReturnType<typeof getCustomerOrders>>;
}) {
  if (!orders.length) {
    return (
      <div className="account-empty">
        <p>No orders yet.</p>
        <Link className="button small" href="/machines">
          Explore machines
        </Link>
      </div>
    );
  }
  return (
    <div className="customer-orders">
      {orders.map((order) => (
        <article key={order._id} className="customer-order">
          <div>
            <small>Order</small>
            <strong>{order.orderNumber}</strong>
          </div>
          <div>
            <small>Date</small>
            <span>
              {new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(
                new Date(order.createdAt),
              )}
            </span>
          </div>
          <div>
            <small>Status</small>
            <span className="order-status">{order.status}</span>
          </div>
          <div>
            <small>Total</small>
            <strong>{money(order.total)}</strong>
          </div>
          <ul>
            {order.items?.map((item, index) => (
              <li key={`${order._id}-${index}`}>
                {item.quantity} x {item.name}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
