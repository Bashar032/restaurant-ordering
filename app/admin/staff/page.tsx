import StaffHeader from "@/components/admin/StaffHeader";
import StaffSessionGuard from "@/components/admin/StaffSessionGuard";
import AdminStaffBoard from "@/components/admin/AdminStaffBoard";
import { requireStaff } from "@/lib/auth/requireStaff";

export default async function AdminStaffPage() {
  const { profile } = await requireStaff({
    roles: ["owner"],
  });

  return (
    <main className="min-h-screen bg-[#171512] text-white">
      <StaffSessionGuard />

      <StaffHeader
        fullName={profile.full_name}
        section="Daloona admin"
        role={profile.role}
      />

      <AdminStaffBoard />
    </main>
  );
}