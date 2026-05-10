"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { FlexiFakturaPrijata } from "@/lib/flexi-types";
import {
  mockFakturyPrijate,
  formatCZK,
  formatDate,
  getStatusLabel,
  getStatusVariant,
} from "@/lib/mock-data";
import { Plus, Download, Eye, CheckCircle2, Save } from "lucide-react";

type StatusFilter = "all" | "stavUhr.uhrazeno" | "stavUhr.castUhr" | "stavUhr.neuhrazeno";

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FakturyPrijatePage() {
  const [faktury, setFaktury] = useState(mockFakturyPrijate);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [detailFaktura, setDetailFaktura] = useState<FlexiFakturaPrijata | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [form, setForm] = useState({
    kod: "", firma: "", datVyst: "", datSplat: "", sumCelkem: "", varSym: "", popis: "",
  });

  const filtered = statusFilter === "all"
    ? faktury
    : faktury.filter((f) => f.stavUhrK === statusFilter);

  function markAsPaid(id: number) {
    setFaktury((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, stavUhrK: "stavUhr.uhrazeno", zbpiStav: "stavUhr.uhrazeno" } : f
      )
    );
    setDetailFaktura(null);
  }

  function addFaktura() {
    const newF: FlexiFakturaPrijata = {
      id: Date.now(),
      kod: form.kod || `FP-${new Date().getFullYear()}/${String(faktury.length + 1).padStart(3, "0")}`,
      datVyst: form.datVyst || new Date().toISOString().slice(0, 10),
      datSplat: form.datSplat || new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      firma: `code:NEW`,
      firmaObj: { nazev: form.firma },
      sumCelkem: Number(form.sumCelkem) || 0,
      zbpiStav: "stavUhr.neuhrazeno",
      stavUhrK: "stavUhr.neuhrazeno",
      typDokl: "code:FAKTURA",
      varSym: form.varSym,
      popis: form.popis,
    };
    setFaktury((prev) => [newF, ...prev]);
    setAddDialogOpen(false);
    setForm({ kod: "", firma: "", datVyst: "", datSplat: "", sumCelkem: "", varSym: "", popis: "" });
  }

  function exportCSV() {
    const header = "Číslo;Dodavatel;Vystaveno;Splatnost;Částka;VS;Stav;Popis";
    const rows = filtered.map((f) =>
      `${f.kod};${f.firmaObj?.nazev || f.firma};${f.datVyst};${f.datSplat};${f.sumCelkem};${f.varSym || ""};${getStatusLabel(f.stavUhrK)};${f.popis || ""}`
    );
    triggerDownload("faktury_prijate.csv", [header, ...rows].join("\n"));
  }

  const columns: ColumnDef<FlexiFakturaPrijata>[] = [
    { accessorKey: "kod", header: "Číslo" },
    {
      accessorKey: "firmaObj.nazev",
      header: "Dodavatel",
      cell: ({ row }) => row.original.firmaObj?.nazev ?? row.original.firma,
    },
    {
      accessorKey: "datVyst",
      header: "Vystaveno",
      cell: ({ row }) => formatDate(row.original.datVyst),
    },
    {
      accessorKey: "datSplat",
      header: "Splatnost",
      cell: ({ row }) => formatDate(row.original.datSplat),
    },
    {
      accessorKey: "sumCelkem",
      header: "Částka",
      cell: ({ row }) => (
        <span className="font-semibold">{formatCZK(row.original.sumCelkem)}</span>
      ),
    },
    {
      accessorKey: "stavUhrK",
      header: "Stav",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.stavUhrK)}>
          {getStatusLabel(row.original.stavUhrK)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailFaktura(row.original)} title="Detail">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Stáhnout" onClick={() => triggerDownload(`${row.original.kod}.txt`, `[Demo] Faktura ${row.original.kod}\n${row.original.firmaObj?.nazev}\nČástka: ${row.original.sumCelkem} CZK`)}>
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
          <h1 className="text-3xl font-bold tracking-tight">Faktury přijaté</h1>
          <p className="text-muted-foreground">Přehled všech přijatých faktur</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nová faktura
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "stavUhr.uhrazeno", "stavUhr.castUhr", "stavUhr.neuhrazeno"] as StatusFilter[]).map((s) => (
          <Button
            key={s}
            variant={statusFilter === s ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "Vše" : getStatusLabel(s)}
            {s !== "all" && (
              <Badge variant="secondary" className="ml-2 text-[10px]">
                {faktury.filter((f) => f.stavUhrK === s).length}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="firma"
        searchPlaceholder="Hledat faktury..."
      />

      {/* Detail dialog */}
      <Dialog open={!!detailFaktura} onOpenChange={(open) => !open && setDetailFaktura(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Faktura {detailFaktura?.kod}</DialogTitle>
            <DialogDescription>{detailFaktura?.firmaObj?.nazev}</DialogDescription>
          </DialogHeader>
          {detailFaktura && (
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Dodavatel</span><span className="font-medium">{detailFaktura.firmaObj?.nazev}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vystaveno</span><span className="font-medium">{formatDate(detailFaktura.datVyst)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Splatnost</span><span className="font-medium">{formatDate(detailFaktura.datSplat)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Částka</span><span className="font-bold text-lg">{formatCZK(detailFaktura.sumCelkem)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">VS</span><span className="font-medium">{detailFaktura.varSym || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stav</span><Badge variant={getStatusVariant(detailFaktura.stavUhrK)}>{getStatusLabel(detailFaktura.stavUhrK)}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Popis</span><span className="font-medium">{detailFaktura.popis || "—"}</span></div>
            </div>
          )}
          <DialogFooter>
            {detailFaktura && detailFaktura.stavUhrK !== "stavUhr.uhrazeno" && (
              <Button variant="outline" onClick={() => markAsPaid(detailFaktura.id)}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Označit jako uhrazeno
              </Button>
            )}
            <Button variant="outline" onClick={() => { if (detailFaktura) triggerDownload(`${detailFaktura.kod}.txt`, `[Demo] Faktura ${detailFaktura.kod}`); }}>
              <Download className="mr-2 h-4 w-4" /> Stáhnout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nová faktura přijatá</DialogTitle>
            <DialogDescription>Zaevidujte přijatou fakturu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Číslo faktury</Label>
                <Input value={form.kod} onChange={(e) => setForm({ ...form, kod: e.target.value })} placeholder="FP-2024/005" />
              </div>
              <div className="space-y-2">
                <Label>Dodavatel</Label>
                <Input value={form.firma} onChange={(e) => setForm({ ...form, firma: e.target.value })} placeholder="Firma s.r.o." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Datum vystavení</Label>
                <Input type="date" value={form.datVyst} onChange={(e) => setForm({ ...form, datVyst: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Datum splatnosti</Label>
                <Input type="date" value={form.datSplat} onChange={(e) => setForm({ ...form, datSplat: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Částka (CZK)</Label>
                <Input type="number" value={form.sumCelkem} onChange={(e) => setForm({ ...form, sumCelkem: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Variabilní symbol</Label>
                <Input value={form.varSym} onChange={(e) => setForm({ ...form, varSym: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Popis</Label>
              <Input value={form.popis} onChange={(e) => setForm({ ...form, popis: e.target.value })} placeholder="Popis dodávky" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Zrušit</Button>
            <Button onClick={addFaktura} disabled={!form.firma}>
              <Save className="mr-2 h-4 w-4" /> Zaevidovat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
