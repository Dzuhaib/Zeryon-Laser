"use client";

import { useState } from "react";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(
        result.error || "Your enquiry could not be sent. Please try again.",
      );
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("sent");
  }

  return (
    <section className="contact" id="contact">
      <div>
        <p className="eyebrow">Start a conversation</p>
        <h2>
          Let&apos;s talk about
          <br />
          your next step.
        </h2>
        <p>
          Tell us where you are in your journey. We&apos;ll respond with
          practical, relevant guidance.
        </p>
      </div>
      <form onSubmit={submit}>
        {status === "sent" ? (
          <div className="success">
            Thank you. Your enquiry has been received.
          </div>
        ) : (
          <>
            <div className="form-grid">
              <label>
                Name
                <input required name="name" maxLength={100} />
              </label>
              <label>
                Email
                <input required type="email" name="email" maxLength={254} />
              </label>
              <label>
                Phone
                <input name="phone" maxLength={40} />
              </label>
              <label>
                Business
                <input name="business" maxLength={140} />
              </label>
            </div>
            <label>
              I&apos;m interested in
              <select name="interest">
                <option>Machines</option>
                <option>Training</option>
                <option>Machines + Training</option>
                <option>General advice</option>
              </select>
            </label>
            <label className="contact-trap" aria-hidden="true">
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
            <label>
              Message
              <textarea required rows={4} name="message" maxLength={3000} />
            </label>
            {status === "error" && <p className="error">{error}</p>}
            <button className="button" disabled={status === "sending"}>
              {status === "sending" ? "Sending..." : "Send enquiry"}
            </button>
          </>
        )}
      </form>
    </section>
  );
}
