"use client";

import { SignIn, SignUp, UserProfile } from "@clerk/nextjs";
import Link from "next/link";

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
