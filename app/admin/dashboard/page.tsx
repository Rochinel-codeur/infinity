import { redirect } from "next/navigation";
import { getAdminFromCookies } from "@/lib/auth";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function DashboardPage() {
  const admin = await getAdminFromCookies();
  
  if (!admin) {
    redirect("/admin");
  }

  return <AdminDashboard admin={admin} />;
}
