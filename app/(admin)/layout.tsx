import { notFound } from "next/navigation";
import { getAdmin } from "@/actions/admin";
import Header from "@/components/header";
import Sidebar from "./admin/_components/sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdmin();

  // If user not found in our db or not an admin, redirect to 404
  if (!admin.authorized) {
    return notFound();
  }

  return (
    <div className="h-full">
      <Header isAdminPage={true} />

      <div className="flex h-full">
        {/* Desktop sidebar wrapper */}
        <div className="hidden md:flex w-56 flex-col fixed inset-y-0 z-50">
          {/* Only renders the desktop view from Sidebar */}
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 md:ml-56 pt-[80px] h-full bg-gray-50">
          {children}
        </main>
      </div>

      {/* Mobile sidebar (bottom tabs) — rendered outside the hidden md:flex */}
      <div className="md:hidden">
        <Sidebar />
      </div>
    </div>
  );
}
