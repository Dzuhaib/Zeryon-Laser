"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer>
      <div>
        <div className="wordmark footer-mark">
          <img
            className="brand-logo"
            src="/ZERYO%20LOGO%20TRANSPARENT.png"
            alt="ZERYON"
          />
        </div>
        <h2>
          We teach you.
          <br />
          We support you.
          <br />
          We help you grow.
        </h2>
      </div>
      <div className="footer-links">
        <Link href="/machines">Machines</Link>
        <Link href="/#training">Training</Link>
        <Link href="/about">About</Link>
        <Link href="/#support">Support</Link>
        <Link href="/#faqs">FAQs</Link>
        <Link href="/#contact">Contact</Link>
      </div>
      <div
        className="footer-brands"
        aria-label="Accreditation and training partners"
      >
        <img src="/brands/Logo-Usage.webp" alt="Logo Usage" />
        <img src="/brands/proqual-logo.webp" alt="ProQual" />
        <img
          src="/brands/the_cpd_group_award_winning_best_accreditation_body_raising_cpd_standards_provider_activities_events_employer_trainers_accredited.webp"
          alt="The CPD Group"
        />
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} ZERYON Advanced Aesthetic Technology
        </span>
        <span>Privacy · Terms · Delivery</span>
      </div>
    </footer>
  );
}
