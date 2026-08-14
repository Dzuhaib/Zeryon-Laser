import Link from "next/link";
export default async function Confirmed({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <section className="confirmed">
      <span>✓</span>
      <p className="eyebrow">Order received</p>
      <h1>Thank you.</h1>
      <p>
        Your reference is <b>{order}</b>. A confirmation has been sent where
        email is configured, and ZERYON will be in touch to confirm the next
        steps.
      </p>
      <Link className="button" href="/">
        Return home
      </Link>
    </section>
  );
}
