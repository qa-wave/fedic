"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { NotificationBell } from "@/components/shared/notifications";
import { StylePicker } from "@/components/shared/style-picker";
import { VisualStyleProvider, useVisualStyle } from "@/components/shared/style-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VisualStyleProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </VisualStyleProvider>
  );
}

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const { style } = useVisualStyle();

  const isDark = style === "dark" || style === "neon" || style === "aurora" || style === "ocean";

  return (
    <div className={`min-h-screen ${
      isDark ? "bg-gray-950 text-gray-100" :
      style === "brutalist" ? "bg-yellow-50" :
      style === "warm" ? "bg-gradient-to-br from-amber-50/50 to-orange-50/30" :
      style === "glass" ? "bg-gradient-to-br from-blue-50/30 to-indigo-50/20" :
      "bg-background"
    }`}>
      <DashboardSidebar />
      <main className="lg:pl-64">
        <div className="border-b bg-background/60 backdrop-blur-sm">
          <div className="flex items-center justify-end gap-2 px-4 py-2">
            <StylePicker />
            <NotificationBell />
          </div>
        </div>
        <div className="p-6 lg:p-8">
          <div className="mb-4"><Breadcrumbs /></div>
          {children}
        </div>
      </main>
      <ThemeSwitcher />
    </div>
  );
}
