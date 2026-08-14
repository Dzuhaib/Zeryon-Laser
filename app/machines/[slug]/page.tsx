import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/sanity";
import { money } from "@/lib/money";
import { AddToCart } from "@/components/AddToCart";
import { ProductSectionNav } from "@/components/ProductSectionNav";
import Link from "next/link";
export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}
export default async function Machine({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = await getProduct(slug);
  if (!p) notFound();
  return (
    <>
      <section className="product-hero">
        <div className="product-hero-visual">
          {p.image ? (
            <img src={p.image} alt={p.name} />
          ) : (
            <div className="machine-art large">
              <i />
              <span>Z</span>
            </div>
          )}
        </div>
        <div>
          <p className="eyebrow">{p.category} technology</p>
          <h1 className="product-title">{p.name}</h1>
          <p className="lead">{p.summary}</p>
          <strong className="price">
            {money(p.price)} <small>ex VAT</small>
          </strong>
          <p className="muted">
            Final configuration, suitability and verified technical detail are
            confirmed during consultation.
          </p>
          <div className="actions">
            <AddToCart product={p} />
            <Link className="text-link" href="/#contact">
              Ask about training
            </Link>
          </div>
        </div>
      </section>
      <section className="product-body">
        <aside className="product-nav-wrap">
          <ProductSectionNav />
        </aside>
        <div>
          <article id="technology">
            <p className="eyebrow">Technology</p>
            <h2>Built around the practitioner.</h2>
            <p>{p.description}</p>
          </article>
          <article id="applications">
            <p className="eyebrow">Treatment applications</p>
            <ul>
              {p.applications.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
          <article id="features">
            <p className="eyebrow">Key features</p>
            <ul>
              {p.features.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
          <article id="included">
            <p className="eyebrow">What’s included</p>
            <ul>
              {p.included.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </article>
          <article id="specifications">
            <p className="eyebrow">Technical specifications</p>
            {p.specifications.map((x) => (
              <div className="spec" key={x.label}>
                <span>{x.label}</span>
                <b>{x.value}</b>
              </div>
            ))}
          </article>
        </div>
      </section>
      <section className="consult">
        <p className="eyebrow">Expert guidance</p>
        <h2>Not sure this is the right machine?</h2>
        <p>
          Speak to ZERYON before you invest. We’ll consider the equipment in the
          context of your actual business.
        </p>
        <Link href="/#contact" className="button">
          Speak to a ZERYON expert
        </Link>
      </section>
    </>
  );
}
