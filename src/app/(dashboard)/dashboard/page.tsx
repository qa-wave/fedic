"use client";

import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import {
  mockFakturyVydane,
  mockFakturyPrijate,
  mockBanka,
  formatCZK,
  formatDate,
  getStatusLabel,
  getStatusVariant,
} from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const totalVydane = mockFakturyVydane.reduce((s, f) => s + f.sumCelkem, 0);
const totalPrijate = mockFakturyPrijate.reduce((s, f) => s + f.sumCelkem, 0);
const neuhrazeneVydane = mockFakturyVydane.filter((f) => f.stavUhrK !== "stavUhr.uhrazeno").reduce((s, f) => s + f.sumCelkem, 0);
const neuhrazenePrijate = mockFakturyPrijate.filter((f) => f.stavUhrK !== "stavUhr.uhrazeno").reduce((s, f) => s + f.sumCelkem, 0);

const cashflowData = [
  { name: "Led", prijem: 320000, vydej: 85000 },
  { name: "Úno", prijem: 280000, vydej: 92000 },
  { name: "Bře", prijem: 758800, vydej: 55250 },
  { name: "Dub", prijem: 0, vydej: 0 },
];

const statusData = [
  { name: "Uhrazeno", value: mockFakturyVydane.filter((f) => f.stavUhrK === "stavUhr.uhrazeno").length, color: "oklch(0.55 0.10 160)" },
  { name: "Částečně", value: mockFakturyVydane.filter((f) => f.stavUhrK === "stavUhr.castUhr").length, color: "oklch(0.75 0.15 75)" },
  { name: "Neuhrazeno", value: mockFakturyVydane.filter((f) => f.stavUhrK === "stavUhr.neuhrazeno").length, color: "oklch(0.577 0.245 27.325)" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Přehled</h1>
        <p className="text-muted-foreground">Vítejte v účetním portálu Fedic Finance</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Obrat (vydané faktury)"
          value={formatCZK(totalVydane)}
          icon={TrendingUp}
          trend={{ value: "12%", positive: true }}
          description="oproti min. měsíci"
        />
        <KpiCard
          title="Náklady (přijaté faktury)"
          value={formatCZK(totalPrijate)}
          icon={TrendingDown}
          trend={{ value: "5%", positive: false }}
          description="oproti min. měsíci"
        />
        <KpiCard
          title="Pohledávky (nezaplacené)"
          value={formatCZK(neuhrazeneVydane)}
          icon={FileText}
          description={`${mockFakturyVydane.filter((f) => f.stavUhrK !== "stavUhr.uhrazeno").length} faktur`}
        />
        <KpiCard
          title="Závazky (nezaplacené)"
          value={formatCZK(neuhrazenePrijate)}
          icon={Wallet}
          description={`${mockFakturyPrijate.filter((f) => f.stavUhrK !== "stavUhr.uhrazeno").length} faktur`}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Cashflow chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cash Flow</CardTitle>
            <CardDescription>Příjmy a výdaje po měsících</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.01 250)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip
                    formatter={(value) => formatCZK(Number(value))}
                    contentStyle={{ borderRadius: "8px", border: "1px solid oklch(0.90 0.01 250)" }}
                  />
                  <Bar dataKey="prijem" name="Příjmy" fill="oklch(0.55 0.10 160)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="vydej" name="Výdaje" fill="oklch(0.75 0.15 75)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status pie chart */}
        <Card>
          <CardHeader>
            <CardTitle>Stav faktur</CardTitle>
            <CardDescription>Vydané faktury dle úhrady</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                    fontSize={11}
                  >
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {statusData.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  {s.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent invoices */}
        <Card>
          <CardHeader>
            <CardTitle>Poslední vydané faktury</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockFakturyVydane.slice(0, 5).map((f) => (
              <div key={f.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{f.firmaObj?.nazev}</p>
                    <p className="text-xs text-muted-foreground">{f.kod} &middot; {formatDate(f.datVyst)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCZK(f.sumCelkem)}</p>
                  <Badge variant={getStatusVariant(f.stavUhrK)} className="text-xs">
                    {getStatusLabel(f.stavUhrK)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent bank movements */}
        <Card>
          <CardHeader>
            <CardTitle>Poslední bankovní pohyby</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockBanka.slice(0, 5).map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${b.sumCelkem > 0 ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-red-50 text-red-500 dark:bg-red-950 dark:text-red-400"}`}>
                    {b.sumCelkem > 0 ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{b.popis}</p>
                    <p className="text-xs text-muted-foreground">{b.kod} &middot; {formatDate(b.datVyst)}</p>
                  </div>
                </div>
                <p className={`text-sm font-semibold ${b.sumCelkem > 0 ? "text-emerald-600" : "text-red-500"}`}>
                  {b.sumCelkem > 0 ? "+" : ""}{formatCZK(b.sumCelkem)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
