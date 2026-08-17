import Link from "next/link";

export const metadata = {
  title: "Terms and Conditions | ZERYON",
  description:
    "Insurance, training and practitioner responsibility terms for ZERYON training courses.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-intro">
        <p className="eyebrow">Terms and conditions</p>
        <h1>Insurance, training &amp; practitioner responsibility</h1>
        <p>
          By booking and attending any training course with LBL Aesthetics &amp;
          Laser / LBL Aesthetics Academy, the student acknowledges and agrees to
          the following terms and conditions.
        </p>
      </div>

      <div className="legal-content">
        <TermsSection title="1. Insurance responsibility">
          <p>
            It is the sole responsibility of the student/practitioner to obtain
            and maintain suitable insurance before carrying out any treatment
            following completion of training.
          </p>
          <p>
            The student must ensure that their insurance policy specifically
            covers:
          </p>
          <ul>
            <li>The treatment(s) they have been trained to perform.</li>
            <li>The equipment and/or technology being used.</li>
            <li>Their practitioner status and existing qualifications.</li>
            <li>
              Their intended working environment, including salon, clinic, home
              or mobile practice where applicable.
            </li>
            <li>
              Any additional requirements imposed by their insurer, local
              authority, licensing authority or other relevant regulatory body.
            </li>
          </ul>
          <p>
            LBL Aesthetics &amp; Laser / LBL Aesthetics Academy does not provide
            insurance to students and does not guarantee that any student will
            be accepted for insurance or that a particular treatment will be
            covered under an individual policy.
          </p>
          <p>
            Completion of a training course or receipt of a certificate does not
            automatically provide insurance cover and should not be interpreted
            as confirmation that the student is permitted to practise a
            treatment.
          </p>
        </TermsSection>

        <TermsSection title="2. Insurance providers">
          <p>
            Our academy works in accordance with the requirements and standards
            of recognised aesthetics insurance providers, including Insync and
            Beauty Insured, where applicable.
          </p>
          <p>
            We may recommend these providers to students because they offer
            specialist insurance options for beauty and aesthetics
            practitioners. However, the final decision to provide insurance, the
            level of cover provided and the treatments permitted under the
            policy remain entirely between the student and their chosen insurer.
          </p>
          <p>
            Students must contact their insurer directly and obtain confirmation
            that they are appropriately insured before treating members of the
            public.
          </p>
        </TermsSection>

        <TermsSection title="3. Qualifications, scope of practice & legal requirements">
          <p>
            Students are responsible for ensuring that they have the appropriate
            qualifications, previous experience, professional status and legal
            authority required to perform any treatment they undertake.
          </p>
          <p>Students must also independently check any applicable:</p>
          <ul>
            <li>Local authority licensing requirements.</li>
            <li>Premises requirements.</li>
            <li>Treatment restrictions.</li>
            <li>Professional or regulatory requirements.</li>
            <li>Manufacturer instructions and contraindications.</li>
            <li>Insurance requirements.</li>
            <li>
              Additional qualifications or prerequisites required by their
              insurer.
            </li>
          </ul>
          <p>
            LBL Aesthetics &amp; Laser / LBL Aesthetics Academy cannot accept
            responsibility for a student&apos;s decision to perform a treatment
            where they do not have the appropriate insurance, qualifications,
            licensing, experience or legal authority to do so.
          </p>
        </TermsSection>

        <TermsSection title="4. Training does not guarantee competency">
          <p>
            Our training provides education, practical instruction and guidance
            within the scope of the course purchased.
          </p>
          <p>
            Successful completion of a course does not mean that a student is
            automatically competent to treat every client or every skin type
            without further practice or experience.
          </p>
          <p>
            It remains the student&apos;s responsibility to assess their own
            competence and seek further education, supervised practice or
            additional training where appropriate.
          </p>
        </TermsSection>

        <TermsSection title="5. Use of equipment">
          <p>
            Where equipment is purchased as part of a training package, the
            student is responsible for ensuring that the equipment is used in
            accordance with:
          </p>
          <ul>
            <li>Manufacturer instructions.</li>
            <li>Training provided.</li>
            <li>Relevant safety procedures.</li>
            <li>Insurance requirements.</li>
            <li>Applicable legislation and local authority requirements.</li>
          </ul>
          <p>
            Where equipment is supplied, students must also ensure they have
            appropriate insurance and any required permissions before using the
            equipment commercially.
          </p>
        </TermsSection>

        <TermsSection title="6. Client safety">
          <p>
            Students remain responsible for their own clients once they begin
            practising independently. This includes appropriate:
          </p>
          <ul>
            <li>Consultation and client assessment.</li>
            <li>Medical history and contraindication checks.</li>
            <li>Consent procedures.</li>
            <li>Patch testing where required.</li>
            <li>Treatment records.</li>
            <li>Aftercare.</li>
            <li>Infection control.</li>
            <li>Emergency and complication procedures.</li>
            <li>Follow-up and appropriate referral where necessary.</li>
          </ul>
        </TermsSection>

        <TermsSection title="7. Limitation of academy responsibility">
          <p>
            To the fullest extent permitted by law, LBL Aesthetics &amp; Laser /
            LBL Aesthetics Academy shall not be responsible for losses, claims,
            injuries, treatment complications, insurance refusals, licensing
            issues, regulatory action or financial losses arising from a
            student&apos;s independent practice after training, where such
            matters arise from the student&apos;s own actions, omissions,
            failure to obtain appropriate insurance, failure to comply with
            manufacturer guidance, failure to comply with applicable laws or
            regulations, or practising outside their competence or permitted
            scope.
          </p>
          <p>
            Nothing within these terms excludes or limits any liability which
            cannot legally be excluded or limited.
          </p>
        </TermsSection>

        <TermsSection title="8. Student confirmation">
          <p>
            By booking a course, the student confirms that they understand that:
          </p>
          <blockquote>
            “I am responsible for obtaining my own appropriate insurance and
            ensuring that I am legally and professionally permitted to carry out
            any treatment I undertake following my training.”
          </blockquote>
          <p>
            Students are strongly advised to obtain written confirmation from
            their insurer before commencing treatments on paying clients.
          </p>
          <p>
            By proceeding with a booking, the student confirms that they have
            read, understood and accepted these terms and conditions.
          </p>
        </TermsSection>

        <Link className="button" href="/">
          Return to website
        </Link>
      </div>
    </main>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}
