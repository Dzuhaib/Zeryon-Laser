import { auth } from "@clerk/nextjs/server";

export const ADMIN_USER_ID = "user_3HxrDialvAzpkLnIw8XhhBWcCEY";

export async function isAdmin() {
  const { userId } = await auth();
  return userId === ADMIN_USER_ID;
}

export async function requireAdmin() {
  const { userId } = await auth();
  if (userId !== ADMIN_USER_ID) throw new Error("ADMIN_UNAUTHORIZED");
  return userId;
}
