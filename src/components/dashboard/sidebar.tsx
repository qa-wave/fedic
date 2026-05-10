"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  FileInput,
  Users,
  Landmark,
  Wallet,
  BarChart3,
  LogOut,
  Menu,
  X,
  Settings,
  Send,
  UserCog,
  ScrollText,
  Shield,
  Search,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockFakturyVydane, mockAdresar, mockBanka } from "@/lib/mock-data";

const accountingItems = [
  { href: "/dashboard", label: "Přehled", icon: LayoutDashboard },
  { href: "/faktury-vydane", label: "Faktury vydané", icon: FileText },
  { href: "/faktury-prijate", label: "Faktury přijaté", icon: FileInput },
  { href: "/adresar", label: "Adresář", icon: Users },
  { href: "/banka", label: "Banka", icon: Landmark },
  { href: "/pokladna", label: "Pokladna", icon: Wallet },
  { href: "/prehled", label: "Finanční přehledy", icon: BarChart3 },
];

const adminItems = [
  { href: "/admin/klienti", label: "Správa klientů", icon: Users },
  { href: "/admin/kanaly", label: "Doručovací kanály", icon: Send },
  { href: "/admin/uzivatele", label: "Uživatelé & role", icon: UserCog },
  { href: "/admin/logy", label: "Aktivita & logy", icon: ScrollText },
  { href: "/admin/nastaveni", label: "Nastavení systému", icon: Settings },
];

const searchableItems = [
  ...mockFakturyVydane.map((f) => ({ label: `${f.kod} — ${f.firmaObj?.nazev || f.firma}`, href: "/faktury-vydane", type: "Faktura" })),
  ...mockAdresar.map((a) => ({ label: `${a.nazev} (IČ: ${a.ic})`, href: "/adresar", type: "Kontakt" })),
  ...mockBanka.map((b) => ({ label: `${b.kod} — ${b.popis}`, href: "/banka", type: "Banka" })),
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchableItems.filter((item) => item.label.toLowerCase().includes(q)).slice(0, 6);
  }, [searchQuery]);

  function NavLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof LayoutDashboard }) {
    const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
    return (
      <Link
        href={href}
        onClick={() => setMobileOpen(false)}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-primary"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
        {label}
      </Link>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden text-white"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <Image src="/logo.jpg" alt="Fedic Finance" width={36} height={36} className="rounded-lg" />
          <div>
            <p className="text-sm font-semibold">Fedic Finance</p>
            <p className="text-xs text-sidebar-foreground/60">Administrace</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative px-3 pt-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-sidebar-foreground/40" />
            <input
              type="text"
              placeholder="Hledat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              className="w-full rounded-lg bg-sidebar-accent/50 py-2 pl-9 pr-3 text-xs text-sidebar-foreground placeholder:text-sidebar-foreground/40 outline-none focus:bg-sidebar-accent focus:ring-1 focus:ring-sidebar-primary/30"
            />
          </div>
          {searchFocused && searchResults.length > 0 && (
            <div className="absolute left-3 right-3 top-full z-50 mt-1 rounded-lg border border-sidebar-border bg-sidebar shadow-lg overflow-hidden">
              {searchResults.map((result, i) => (
                <button
                  key={i}
                  onMouseDown={() => { router.push(result.href); setSearchQuery(""); setMobileOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-sidebar-accent/50 transition-colors"
                >
                  <span className="text-sidebar-foreground/50 min-w-[50px]">{result.type}</span>
                  <span className="text-sidebar-foreground truncate">{result.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {/* Accounting section */}
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            Účetnictví
          </p>
          <div className="space-y-1">
            {accountingItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>

          <Separator className="my-4 bg-sidebar-border" />

          {/* Admin section */}
          <p className="mb-2 flex items-center gap-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            <Shield className="h-3 w-3" />
            Administrace
          </p>
          <div className="space-y-1">
            {adminItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="mb-2 flex items-center gap-3 px-3 py-1">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-accent text-xs font-bold text-sidebar-primary">
              RF
            </div>
            <div>
              <p className="text-xs font-medium">Radek Fedič</p>
              <p className="text-[10px] text-sidebar-foreground/50">Administrátor</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          >
            <LogOut className="h-4 w-4" />
            Odhlásit se
          </button>
        </div>
      </aside>
    </>
  );
}
