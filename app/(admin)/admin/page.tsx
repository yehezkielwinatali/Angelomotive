import { getDashboardData } from "@/actions/admin";
import { Dashboard } from "./_components/dashboard";

export default async function AdminDashboardPage() {
  // Fetch dashboard data
  const dashboardData = await getDashboardData();

  if (!dashboardData.success || !dashboardData.data) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="text-red-600 font-semibold">
          {dashboardData.error || "Failed to load dashboard data."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Dashboard initialData={dashboardData} />
    </div>
  );
}
