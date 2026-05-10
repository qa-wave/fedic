"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

const pathLabels: Record<string, string> = {
  dashboard: "Přehled",
  "faktury-vydane": "Faktury vydané",
  "faktury-prijate": "Faktury přijaté",
  adresar: "Adresář",
  banka: "Banka",
  pokladna: "Pokladna",
  prehled: "Finanční přehledy",
  admin: "Administrace",
  klienti: "Správa klientů",
  kanaly: "Doručovací kanály",
  uzivatele: "Uživatelé & role",
  logy: "Aktivita & logy",
  nastaveni: "Nastavení",
  portal: "Portál",
  "moje-faktury": "Moje faktury",
  export: "Export dat",
  dokumenty: "Dokumenty",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = pathLabels[seg] || seg;
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Link href="/dashboard" className="hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
