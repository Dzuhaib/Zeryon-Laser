"use client";

import { SignIn, SignUp, UserProfile, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { FormEvent, useState } from "react";

export const clerkAppearance = {
  variables: {
    colorPrimary: "#d4af37",
    colorBackground: "#090909",
    colorInputBackground: "#11110f",
    colorInputText: "#f5f2ec",
    colorText: "#f5f2ec",
    colorTextSecondary: "#aaa69f",
    borderRadius: "4px",
  },
  elements: {
    cardBox: "clerk-card-box",
    card: "clerk-card",
    headerTitle: "clerk-title",
    headerSubtitle: "clerk-subtitle",
    logoBox: "clerk-hidden",
    footer: "clerk-hidden",
    footerAction: "clerk-hidden",
    footerPages: "clerk-hidden",
    developmentMode: "clerk-hidden",
    developmentModeBadge: "clerk-hidden",
    poweredBy: "clerk-hidden",
    socialButtonsBlockButton: "clerk-social-button",
    formButtonPrimary: "clerk-primary-button",
    formFieldInput: "clerk-input",
  },
};

export function ZeryonSignIn() {
  return (
    <AuthShell eyebrow="Customer account" title="Welcome back.">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        forceRedirectUrl="/account"
        appearance={clerkAppearance}
      />
      <p className="auth-switch">
        New to ZERYON? <Link href="/sign-up">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function ZeryonSignUp() {
  return (
    <AuthShell eyebrow="Create your account" title="Join ZERYON.">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        forceRedirectUrl="/account"
        appearance={clerkAppearance}
      />
      <p className="auth-switch">
        Already registered? <Link href="/sign-in">Sign in</Link>
      </p>
    </AuthShell>
  );
}

export function ZeryonUserProfile() {
  return (
    <UserProfile
      routing="path"
      path="/account/profile"
      appearance={clerkAppearance}
    />
  );
}

type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  postcode?: string;
  country?: string;
};

export function CustomerAddressForm({
  initialAddress,
}: {
  initialAddress?: Address;
}) {
  const { user, isLoaded } = useUser();
  const [address, setAddress] = useState<Address>(initialAddress || {});
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  if (!isLoaded) return <p className="muted">Loading your saved address...</p>;

  async function saveAddress(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setState("saving");
    try {
      await user.update({
        unsafeMetadata: { ...user.unsafeMetadata, address },
      });
      setState("saved");
    } catch {
      setState("error");
    }
  }

  return (
    <form className="customer-address-form" onSubmit={saveAddress}>
      <div className="address-form-grid">
        <label>
          Address line 1
          <input
            value={address.line1 || ""}
            onChange={(event) =>
              setAddress({ ...address, line1: event.target.value })
            }
            autoComplete="address-line1"
            required
          />
        </label>
        <label>
          Address line 2
          <input
            value={address.line2 || ""}
            onChange={(event) =>
              setAddress({ ...address, line2: event.target.value })
            }
            autoComplete="address-line2"
          />
        </label>
        <label>
          Town / city
          <input
            value={address.city || ""}
            onChange={(event) =>
              setAddress({ ...address, city: event.target.value })
            }
            autoComplete="address-level2"
            required
          />
        </label>
        <label>
          Postcode
          <input
            value={address.postcode || ""}
            onChange={(event) =>
              setAddress({ ...address, postcode: event.target.value })
            }
            autoComplete="postal-code"
            required
          />
        </label>
        <label>
          Country
          <input
            value={address.country || "United Kingdom"}
            onChange={(event) =>
              setAddress({ ...address, country: event.target.value })
            }
            autoComplete="country-name"
            required
          />
        </label>
      </div>
      <div className="address-form-actions">
        <button
          className="button small"
          type="submit"
          disabled={state === "saving"}
        >
          {state === "saving" ? "Saving..." : "Save address"}
        </button>
        {state === "saved" && (
          <span className="address-save-status">Address saved</span>
        )}
        {state === "error" && (
          <span className="address-save-status error">
            Unable to save address
          </span>
        )}
      </div>
    </form>
  );
}

function AuthShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="auth-page">
      <div className="auth-intro">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>Access your account and continue securely through checkout.</p>
      </div>
      <div className="auth-panel">{children}</div>
    </section>
  );
}
