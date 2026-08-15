import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import AdminDashboard from "@/components/AdminDashboard";

export default async function AdminPage() {
  if (!(await isAdmin())) redirect("/sign-in?redirect_url=/admin");
  return <AdminDashboard />;
}
