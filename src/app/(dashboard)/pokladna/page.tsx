"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPokladna, formatCZK, formatDate, type MockPokladniPohyb } from "@/lib/mock-data";
import { Wallet, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";

const columns: ColumnDef<MockPokladniPohyb>[] = [
  { accessorKey: "kod", header: "Číslo" },
  {
    accessorKey: "datVyst",
    header: "Datum",
    cell: ({ row }) => formatDate(row.original.datVyst),
  },
  {
    accessorKey: "popis",
    header: "Popis",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.popis}</span>,
  },
  {
    accessorKey: "pokladna",
    header: "Pokladna",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.pokladna}</Badge>
    ),
  },
  {
    accessorKey: "typPohybuK",
    header: "Typ",
    cell: ({ row }) => (
      <Badge variant={row.original.typPohybuK === "typPohybu.prijem" ? "default" : "secondary"}>
        {row.original.typPohybuK === "typPohybu.prijem" ? "Příjem" : "Výdej"}
      </Badge>
    ),
  },
  {
    accessorKey: "sumCelkem",
    header: "Částka",
    cell: ({ row }) => {
      const isPrijem = row.original.typPohybuK === "typPohybu.prijem";
      return (
        <span className={`font-semibold ${isPrijem ? "text-emerald-600" : "text-red-500"}`}>
          {isPrijem ? "+" : "−"}{formatCZK(row.original.sumCelkem)}
        </span>
      );
    },
  },
];

export default function PokladnaPage() {
  const prijmy = mockPokladna
    .filter((p) => p.typPohybuK === "typPohybu.prijem")
    .reduce((sum, p) => sum + p.sumCelkem, 0);
  const vydaje = mockPokladna
    .filter((p) => p.typPohybuK === "typPohybu.vydej")
    .reduce((sum, p) => sum + p.sumCelkem, 0);
  const zustatek = prijmy - vydaje;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pokladna</h1>
        <p className="text-muted-foreground">Pokladní pohyby</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Příjmy</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCZK(prijmy)}</div>
            <p className="text-xs text-muted-foreground">
              {mockPokladna.filter((p) => p.typPohybuK === "typPohybu.prijem").length} pohybů
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Výdaje</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCZK(vydaje)}</div>
            <p className="text-xs text-muted-foreground">
              {mockPokladna.filter((p) => p.typPohybuK === "typPohybu.vydej").length} pohybů
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zůstatek</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCZK(zustatek)}</div>
            <p className="text-xs text-muted-foreground">
              Celkem {mockPokladna.length} pohybů
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={mockPokladna}
        searchKey="popis"
        searchPlaceholder="Hledat pohyb..."
      />
    </div>
  );
}
