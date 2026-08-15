import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ADMIN_USER_ID } from "@/lib/admin";

export default async function PostSignInPage() {
  const { userId } = await auth();
  redirect(userId === ADMIN_USER_ID ? "/admin" : "/account");
}
