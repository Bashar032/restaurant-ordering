"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "@/components/admin/LogoutButton";
import AdminNotifications from "@/components/admin/AdminNotifications";

type StaffRole =
  | "owner"
  | "admin"
  | "kitchen";

type StaffHeaderProps = {
  fullName: string;
  section?: string;
  role: StaffRole;
};

const adminNavigation = [
  {
    label: "Bokningar",
    href: "/admin",
  },
  {
    label: "Kök",
    href: "/kitchen",
  },
  {
    label: "Orders",
    href: "/admin/orders",
  },
  {
    label: "Event",
    href: "/admin/events",
  },
];

const kitchenNavigation = [
  {
    label: "Kök",
    href: "/kitchen",
  },
];

export default function StaffHeader({
  fullName,
  section = "Daloona admin",
  role,
}: StaffHeaderProps) {
  const pathname = usePathname();

  const navigation =
    role === "kitchen"
      ? kitchenNavigation
      : adminNavigation;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#171512]">
      <div className="mx-auto flex min-h-24 max-w-[1600px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-14">
        <div>
          <p className="text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[#B08A52]">
            {section}
          </p>

          <p className="mt-1 font-serif text-2xl">
            {fullName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {navigation.map(
            (item) => {
              const active =
                item.href === "/admin"
                  ? pathname ===
                    "/admin"
                  : pathname.startsWith(
                      item.href,
                    );

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`border px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition ${
                    active
                      ? "border-[#B08A52] text-[#D4B27C]"
                      : "border-white/15 text-white/70 hover:border-[#B08A52] hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            },
          )}

          {role === "owner" && (
            <Link
              href="/admin/staff"
              className={`border px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] transition ${
                pathname.startsWith(
                  "/admin/staff",
                )
                  ? "border-[#B08A52] text-[#D4B27C]"
                  : "border-white/15 text-white/70 hover:border-[#B08A52] hover:text-white"
              }`}
            >
              Personal
            </Link>
          )}

          <AdminNotifications
            role={role}
          />

          <LogoutButton />
        </div>
      </div>
    </header>
  );
}