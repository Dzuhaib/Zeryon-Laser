import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getProducts } from "@/lib/sanity";
import { ProductCard } from "@/components/ProductCard";
import { Contact } from "@/components/Contact";
import Silk from "@/components/Silk";
export default async function Home() {
  const products = await getProducts();
  return (
    <>
      <section className="hero">
        <div className="hero-silk" aria-hidden="true">
          <Silk
            speed={5}
            scale={1}
            color="#D4AF37"
            noiseIntensity={1.5}
            rotation={0}
          />
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Ready to grow your clinic?</p>
          <h1>
            Train. Qualify.
            <br />
            <i>Invest. Grow.</i>
          </h1>
          <p className="hero-question">
            Are you a medic or non-medic looking to add new treatments?
          </p>
          <p className="lead">
            Professional training, recognised qualifications &amp;
            industry-leading machines, all in one place.
          </p>
          <div className="actions">
            <Link className="button" href="#training">
              Explore training
            </Link>
            <Link className="text-link" href="/machines">
              View machines <ArrowRight size={17} />
            </Link>
          </div>
        </div>
        <div className="hero-paths">
          <a href="#training">
            <small>01 / Education</small>
            <strong>Regulated qualifications & CPD training</strong>
            <ArrowRight size={20} />
          </a>
          <Link href="/machines">
            <small>02 / Technology</small>
            <strong>Professional equipment selected around you</strong>
            <ArrowRight size={20} />
          </Link>
          <a href="#support">
            <small>03 / Support</small>
            <strong>Practical guidance that continues afterwards</strong>
            <ArrowRight size={20} />
          </a>
        </div>
      </section>
      <section className="growth-cta">
        <p className="eyebrow">The ZERYON advantage</p>
        <h2>
          Invest in technology.
          <br />
          Invest in your future.
        </h2>
        <p className="growth-title">
          The next level of aesthetic business starts here.
        </p>
        <p>
          Premium laser technology designed for ambitious clinics and
          professionals who want to expand their treatment menu, attract new
          clients and unlock new revenue opportunities.
        </p>
        <p className="growth-punchline">
          One investment. Multiple treatment possibilities. Serious business
          potential.
        </p>
        <p>
          From advanced hair reduction and skin rejuvenation to high-demand
          aesthetic treatments, give your clients more of what they want from
          one professional platform.
        </p>
        <p className="growth-revenue">
          Don’t just add a machine to your clinic. Add an entire new revenue
          stream.
        </p>
        <Link className="button" href="/machines">
          Explore the technology
        </Link>
      </section>
      <section className="stats">
        <div>
          <b>17+</b>
          <span>Years in aesthetics</span>
        </div>
        <div>
          <b>10+</b>
          <span>Years in laser</span>
        </div>
        <div>
          <b>Level 7</b>
          <span>IQA & assessors</span>
        </div>
        <div>
          <b>CPD</b>
          <span>Training</span>
        </div>
      </section>
      <section className="story">
        <div className="portrait editorial-image">
          <img src="/Laura%20Anne.jpg" alt="Laura Anne" />
        </div>
        <div className="story-copy">
          <p className="eyebrow">Our experience</p>
          <h2>
            We’ve been
            <br />
            where you are.
          </h2>
          <p>
            When we first entered the aesthetics and laser industry, we spent
            thousands and thousands of pounds on machines, training and
            education.
          </p>
          <p>
            The industry can be an absolute minefield — knowing which machines
            to invest in, what training to choose, which qualifications you
            actually need, insurance, protocols, safety and where to turn for
            genuine advice.
          </p>
          <p>
            After 17 years in aesthetics and over 10 years of laser experience,
            we decided to use everything we’ve learned to do things differently.
          </p>
          <Link className="text-link" href="/about">
            Read our story <ArrowRight size={17} />
          </Link>
        </div>
      </section>
      <section className="manifesto">
        <p className="eyebrow">Our philosophy</p>
        <h2>
          We don’t gatekeep.
          <br />
          <i>We educate.</i>
        </h2>
        <p>If we know it, we’ll teach it. If you need help, we’ll help you.</p>
      </section>
      <section className="equipment">
        <div className="section-head">
          <div>
            <p className="eyebrow">Professional equipment</p>
            <h2>
              Technology without
              <br />
              the unnecessary outlay.
            </h2>
          </div>
          <p>
            We offer professional machines with advice centred on your{" "}
            <b>treatment menu</b>, <b>budget</b> and <b>business</b> — never
            simply the highest price.
          </p>
        </div>
        <div className="product-grid">
          {products.slice(0, 3).map((p, i) => (
            <ProductCard product={p} index={i + 1} key={p._id} />
          ))}
        </div>
        <Link className="button centred" href="/machines">
          View all machines
        </Link>
      </section>
      <section className="training" id="training">
        <p className="eyebrow">Professional education</p>
        <h2>
          Learn from people
          <br />
          who’ve actually done it.
        </h2>
        <p className="training-intro">
          Regulated qualifications and CPD training designed to support
          practitioners at different stages of their professional journey.
        </p>
        <div className="credentials">
          <span>Focus Awards</span>
          <span>ProQual</span>
          <span>Level 7 IQA</span>
          <span>Level 7 Assessors</span>
        </div>
        <div className="pathways">
          <article>
            <small>01</small>
            <h3>Regulated qualifications</h3>
            <p>
              For practitioners who require recognised qualifications for their
              professional pathway.
            </p>
            <a href="#contact">
              View qualifications <ArrowRight size={16} />
            </a>
          </article>
          <article>
            <small>02</small>
            <h3>CPD training</h3>
            <p>
              For practitioners looking to expand their knowledge, treatment
              offering and professional development.
            </p>
            <a href="#contact">
              View CPD training <ArrowRight size={16} />
            </a>
          </article>
        </div>
      </section>
      <section className="support" id="support">
        <div>
          <p className="eyebrow">Ongoing support</p>
          <h2>
            Your training may end.
            <br />
            <i>Our support doesn’t.</i>
          </h2>
          <p>
            Whether you’re unsure about your machine, need advice about a
            treatment, want help building confidence or simply have a question,
            you can come back to us.
          </p>
        </div>
        <div className="comparison">
          <article>
            <small>The typical experience</small>
            <p>Certificate.</p>
            <p>Machine.</p>
            <p>Good luck.</p>
          </article>
          <article className="zeryon-side">
            <small>The ZERYON experience</small>
            <p>Training.</p>
            <p>Equipment.</p>
            <p>Guidance.</p>
            <p>Support.</p>
            <p>Community.</p>
          </article>
        </div>
      </section>
      <section className="community">
        <p>You don’t just buy from us.</p>
        <h2>You join our community.</h2>
        <Link className="button" href="#contact">
          Join the ZERYON community
        </Link>
      </section>
      <section className="why">
        <p className="eyebrow">Why ZERYON</p>
        <div className="why-grid">
          {[
            ["17 years", "Aesthetics experience"],
            ["10+ years", "Laser experience"],
            ["Regulated", "Qualifications & CPD"],
            ["Level 7", "IQA & assessors"],
            ["Affordable", "Professional machines"],
            ["Professional", "Insurance"],
            ["Ongoing", "Support"],
            ["No", "Gatekeeping"],
          ].map((x) => (
            <div key={x[0]}>
              <b>{x[0]}</b>
              <span>{x[1]}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="faq" id="faqs">
        <p className="eyebrow">Questions, answered</p>
        <h2>Before you invest.</h2>
        {[
          [
            "How do I choose the right machine?",
            "We start with your experience, treatment menu, budget and business goals, then discuss suitable options.",
          ],
          [
            "Is training available with equipment?",
            "Training pathways can be discussed for each machine. Requirements vary, so we confirm them before purchase.",
          ],
          [
            "What support is available after training?",
            "Practitioners can return to ZERYON for practical guidance, confidence-building and equipment support.",
          ],
        ].map((x) => (
          <details key={x[0]}>
            <summary>
              {x[0]}
              <span>+</span>
            </summary>
            <p>{x[1]}</p>
          </details>
        ))}
      </section>
      <Contact />
    </>
  );
}
