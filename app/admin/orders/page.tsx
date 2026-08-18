import AdminOrdersBoard from "@/components/admin/AdminOrdersBoard";
import StaffHeader from "@/components/admin/StaffHeader";
import StaffSessionGuard from "@/components/admin/StaffSessionGuard";
import { requireStaff } from "@/lib/auth/requireStaff";

export default async function AdminOrdersPage() {
  const { profile } = await requireStaff({
    roles: ["owner", "admin"],
  });

  return (
    <main className="min-h-screen bg-[#171512] text-white">
      <StaffSessionGuard />

      <StaffHeader
        fullName={profile.full_name}
        section="Daloona admin"
        role={profile.role}
      />

      <AdminOrdersBoard />
    </main>
  );
}