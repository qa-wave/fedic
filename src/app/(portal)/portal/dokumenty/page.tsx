"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDokumenty, formatDate, type MockDokument } from "@/lib/mock-data";
import { Download, FileText, FileSpreadsheet, File, FolderOpen } from "lucide-react";

const typLabels: Record<MockDokument["typ"], string> = {
  smlouva: "Smlouva",
  podklad: "Podklad",
  report: "Report",
  faktura: "Faktura",
  ostatni: "Ostatní",
};

const typVariants: Record<MockDokument["typ"], "default" | "secondary" | "outline" | "destructive"> = {
  smlouva: "default",
  podklad: "secondary",
  report: "outline",
  faktura: "secondary",
  ostatni: "outline",
};

function FileIcon({ nazev }: { nazev: string }) {
  if (nazev.endsWith(".pdf")) return <FileText className="h-4 w-4 text-red-500" />;
  if (nazev.endsWith(".xlsx") || nazev.endsWith(".csv")) return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />;
  return <File className="h-4 w-4 text-muted-foreground" />;
}

const columns: ColumnDef<MockDokument>[] = [
  {
    accessorKey: "nazev",
    header: "Název souboru",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileIcon nazev={row.original.nazev} />
        <span className="font-medium">{row.original.nazev}</span>
      </div>
    ),
  },
  {
    accessorKey: "typ",
    header: "Typ",
    cell: ({ row }) => (
      <Badge variant={typVariants[row.original.typ]}>
        {typLabels[row.original.typ]}
      </Badge>
    ),
  },
  {
    accessorKey: "popis",
    header: "Popis",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.popis}</span>
    ),
  },
  {
    accessorKey: "velikost",
    header: "Velikost",
  },
  {
    accessorKey: "datum",
    header: "Nahráno",
    cell: ({ row }) => formatDate(row.original.datum),
  },
  {
    accessorKey: "nahral",
    header: "Nahrál",
  },
  {
    id: "actions",
    header: "",
    cell: () => (
      <Button variant="ghost" size="sm">
        <Download className="h-4 w-4" />
      </Button>
    ),
  },
];

export default function DokumentyPage() {
  const pocetTypu = mockDokumenty.reduce(
    (acc, d) => {
      acc[d.typ] = (acc[d.typ] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dokumenty</h1>
        <p className="text-muted-foreground">Sdílené dokumenty a přílohy</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkem</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDokumenty.length}</div>
            <p className="text-xs text-muted-foreground">dokumentů</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Smlouvy</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pocetTypu["smlouva"] || 0}</div>
            <p className="text-xs text-muted-foreground">aktivních smluv</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reporty</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pocetTypu["report"] || 0}</div>
            <p className="text-xs text-muted-foreground">účetních výstupů</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Podklady</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(pocetTypu["podklad"] || 0) + (pocetTypu["faktura"] || 0) + (pocetTypu["ostatni"] || 0)}</div>
            <p className="text-xs text-muted-foreground">nahraných souborů</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        columns={columns}
        data={mockDokumenty}
        searchKey="nazev"
        searchPlaceholder="Hledat dokument..."
      />
    </div>
  );
}
