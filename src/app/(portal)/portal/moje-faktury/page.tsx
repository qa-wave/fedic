"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { FlexiFakturaVydana } from "@/lib/flexi-types";
import { mockFakturyVydane, formatCZK, formatDate, getStatusLabel, getStatusVariant } from "@/lib/mock-data";
import { Download, Eye } from "lucide-react";

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MojeFakturyPage() {
  const [detailFaktura, setDetailFaktura] = useState<FlexiFakturaVydana | null>(null);
  const myFaktury = mockFakturyVydane.slice(0, 4);

  function exportCSV() {
    const header = "Číslo;Vystaveno;Splatnost;Částka;Stav;Popis";
    const rows = myFaktury.map((f) =>
      `${f.kod};${f.datVyst};${f.datSplat};${f.sumCelkem};${getStatusLabel(f.stavUhrK)};${f.popis || ""}`
    );
    triggerDownload("moje_faktury.csv", [header, ...rows].join("\n"));
  }

  const columns: ColumnDef<FlexiFakturaVydana>[] = [
    { accessorKey: "kod", header: "Číslo faktury" },
    { accessorKey: "datVyst", header: "Vystaveno", cell: ({ row }) => formatDate(row.original.datVyst) },
    { accessorKey: "datSplat", header: "Splatnost", cell: ({ row }) => formatDate(row.original.datSplat) },
    { accessorKey: "sumCelkem", header: "Částka", cell: ({ row }) => <span className="font-semibold">{formatCZK(row.original.sumCelkem)}</span> },
    {
      accessorKey: "stavUhrK", header: "Stav",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.stavUhrK)}>
          {getStatusLabel(row.original.stavUhrK)}
        </Badge>
      ),
    },
    {
      accessorKey: "popis", header: "Popis",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.popis}</span>,
    },
    {
      id: "actions", header: "",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailFaktura(row.original)} title="Detail">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Stáhnout PDF"
            onClick={() => triggerDownload(`${row.original.kod}.txt`, `[Demo] Faktura ${row.original.kod}\nČástka: ${row.original.sumCelkem} CZK\n${row.original.popis || ""}`)}>
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Moje faktury</h1>
          <p className="text-muted-foreground">Přehled vašich faktur</p>
        </div>
        <Button variant="outline" size="sm" onClick={exportCSV}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <DataTable columns={columns} data={myFaktury} searchKey="kod" searchPlaceholder="Hledat fakturu..." />

      {/* Detail dialog */}
      <Dialog open={!!detailFaktura} onOpenChange={(open) => !open && setDetailFaktura(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faktura {detailFaktura?.kod}</DialogTitle>
            <DialogDescription>{detailFaktura?.popis}</DialogDescription>
          </DialogHeader>
          {detailFaktura && (
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Vystaveno</span><span className="font-medium">{formatDate(detailFaktura.datVyst)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Splatnost</span><span className="font-medium">{formatDate(detailFaktura.datSplat)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Částka</span><span className="font-bold text-lg">{formatCZK(detailFaktura.sumCelkem)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">VS</span><span className="font-medium">{detailFaktura.varSym || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stav</span><Badge variant={getStatusVariant(detailFaktura.stavUhrK)}>{getStatusLabel(detailFaktura.stavUhrK)}</Badge></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { if (detailFaktura) triggerDownload(`${detailFaktura.kod}.txt`, `[Demo] Faktura ${detailFaktura.kod}`); }}>
              <Download className="mr-2 h-4 w-4" /> Stáhnout PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
