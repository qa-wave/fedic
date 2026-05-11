"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { LayoutDashboard, FileText, FolderOpen, LogOut, Download, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { StylePicker } from "@/components/shared/style-picker";
import { VisualStyleProvider, useVisualStyle } from "@/components/shared/style-switcher";

const portalNav = [
  { href: "/portal", label: "Přehled", icon: LayoutDashboard },
  { href: "/portal/moje-faktury", label: "Faktury", icon: FileText },
  { href: "/portal/export", label: "Export", icon: Download },
  { href: "/portal/nastaveni", label: "Zasílání", icon: Settings },
  { href: "/portal/dokumenty", label: "Dokumenty", icon: FolderOpen },
  { href: "/portal/profil", label: "Profil", icon: User },
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <VisualStyleProvider>
      <PortalLayoutInner>{children}</PortalLayoutInner>
    </VisualStyleProvider>
  );
}

function PortalLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
      {/* Top nav bar */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-sm ${
        isDark ? "bg-gray-950/80 border-white/10" :
        style === "brutalist" ? "bg-yellow-300 border-black" :
        "bg-card/80"
      }`}>
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Image src="/logo.jpg" alt="Fedic Finance" width={32} height={32} className="rounded-lg" />
              <span className="font-semibold">Fedic Finance</span>
            </div>
            <nav className="flex gap-1">
              {portalNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? isDark ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
                      : isDark ? "text-gray-400 hover:text-white" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <StylePicker />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className={isDark ? "text-gray-400 hover:text-white" : "text-muted-foreground"}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Odhlásit</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
      <ThemeSwitcher />
    </div>
  );
}
