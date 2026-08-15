# ZERYON Security Operations

Application controls are only one layer. Apply these production controls before treating a deployment as hardened.

## Required Vercel settings

- Set `RATE_LIMIT_SECRET` to a randomly generated value of at least 32 bytes.
- Keep `SANITY_API_WRITE_TOKEN`, `RESEND_API_KEY`, `CLERK_SECRET_KEY`, and `RATE_LIMIT_SECRET` server-only.
- Enable Vercel Firewall rate limits for `/api/orders`, `/api/analytics`, `/sign-in`, and `/sign-up`.
- Restrict production environment-variable access to the production deployment.
- Enable deployment protection for preview deployments that use production data.

## Required Clerk settings

- Require MFA for the administrator account.
- Enable breached-password, bot, and sign-in attack protection.
- Disable unused social and passwordless sign-in methods.
- Review active administrator sessions and revoke unfamiliar sessions.

## Required Sanity settings

- Use a dedicated token with the minimum dataset write role. Do not use an administrator token.
- Keep the production dataset private unless public reads are explicitly required.
- Rotate the write token immediately if it appears in logs, support messages, screenshots, or source control.

## Ongoing operations

- Review `adminAuditLog` documents after unexpected catalogue or order changes.
- Review Clerk and Vercel security logs weekly.
- Run `npm audit --omit=dev` before production releases.
- Rotate privileged credentials periodically and immediately after staff access changes.
- Arrange an external penetration test after significant checkout, authentication, or admin changes.
