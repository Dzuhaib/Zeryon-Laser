import Link from "next/link";
const chapters = [
  [
    "01",
    "The beginning",
    "ZERYON began with the same questions practitioners still ask today: where to train, which technology to trust and who to turn to when the certificate is handed over.",
  ],
  [
    "02",
    "17 years in aesthetics",
    "Experience built through real practice, continual education and a clear understanding of what it takes to work with confidence.",
  ],
  [
    "03",
    "10+ years in laser",
    "More than a decade in laser shaped our approach to safety, technology selection and responsible practitioner education.",
  ],
  [
    "04",
    "The industry minefield",
    "Machines, qualifications, insurance, protocols and conflicting advice can make an already significant investment harder than it should be.",
  ],
  [
    "05",
    "Why ZERYON was created",
    "To give practitioners the kind of honest, practical guidance we would have valued at the beginning.",
  ],
  [
    "06",
    "Education without gatekeeping",
    "Knowledge should build safer, more confident practitioners. If we know it, we teach it.",
  ],
  [
    "07",
    "Equipment & technology",
    "Professional machines are considered around real treatment menus, budgets and commercial needs.",
  ],
  [
    "08",
    "Ongoing practitioner support",
    "Training is a starting point. Questions that arrive later still deserve a thoughtful answer.",
  ],
  [
    "09",
    "The ZERYON community",
    "A professional network grounded in education, encouragement and shared experience.",
  ],
];
export const metadata = { title: "About ZERYON" };
export default function About() {
  return (
    <>
      <section className="page-hero about-hero">
        <p className="eyebrow">Our story</p>
        <h1>
          Experience you can
          <br />
          actually use.
        </h1>
        <p>
          Not a corporate company profile. A practitioner-led story built across
          aesthetics, laser, education and equipment.
        </p>
      </section>
      <section className="timeline">
        {chapters.map((x, i) => (
          <article key={x[0]}>
            <span>{x[0]}</span>
            <div>
              <p className="eyebrow">Chapter {x[0]}</p>
              <h2>{x[1]}</h2>
              <p>{x[2]}</p>
            </div>
            <b>ZERYON</b>
          </article>
        ))}
      </section>
      <section className="final-statement">
        <p>17 years in aesthetics. 10+ years in laser.</p>
        <h2>
          We teach you.
          <br />
          We support you.
          <br />
          <i>We help you grow.</i>
        </h2>
        <Link className="button" href="/#contact">
          Start a conversation
        </Link>
      </section>
    </>
  );
}
