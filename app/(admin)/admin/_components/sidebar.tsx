"use client";
import { cn } from "@/lib/utils";
import { Calendar, Car, Cog, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    label: "Cars",
    icon: Car,
    href: "/admin/cars",
  },
  {
    label: "Test Drives",
    icon: Calendar,
    href: "/admin/test-drives",
  },
  {
    label: "Settings",
    icon: Cog,
    href: "/admin/settings",
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col space-y-3 mt-20 py-4 overflow-y-auto h-full">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all mx-2 rounded-lg",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
              )}
            >
              <route.icon className="w-5 h-5 shrink-0" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-50">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          return (
            <Link
              key={route.href}
              href={route.href}
              className="flex flex-col items-center justify-center text-xs font-medium"
            >
              <route.icon
                className={cn(
                  "h-6 w-6 mb-1",
                  isActive ? "text-blue-700" : "text-slate-500"
                )}
              />
              <span className={isActive ? "text-blue-700" : "text-slate-500"}>
                {route.label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
