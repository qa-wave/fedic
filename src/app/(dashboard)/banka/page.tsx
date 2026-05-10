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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { FlexiBanka } from "@/lib/flexi-types";
import { mockBanka, formatCZK, formatDate } from "@/lib/mock-data";
import { Plus, Download, Save } from "lucide-react";

type TypeFilter = "all" | "typPohybu.prijem" | "typPohybu.vydej";

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BankaPage() {
  const [data, setData] = useState(mockBanka);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [form, setForm] = useState({ datVyst: "", sumCelkem: "", popis: "", typPohybuK: "typPohybu.prijem", sparpiSym: "" });

  const filtered = typeFilter === "all" ? data : data.filter((d) => d.typPohybuK === typeFilter);

  function addEntry() {
    const entry: FlexiBanka = {
      id: Date.now(),
      kod: `BV-${new Date().getFullYear()}/${String(data.length + 1).padStart(3, "0")}`,
      datVyst: form.datVyst || new Date().toISOString().slice(0, 10),
      sumCelkem: form.typPohybuK === "typPohybu.vydej" ? -Math.abs(Number(form.sumCelkem)) : Math.abs(Number(form.sumCelkem)),
      popis: form.popis,
      typPohybuK: form.typPohybuK,
      sparpiSym: form.sparpiSym,
    };
    setData((prev) => [entry, ...prev]);
    setAddDialogOpen(false);
    setForm({ datVyst: "", sumCelkem: "", popis: "", typPohybuK: "typPohybu.prijem", sparpiSym: "" });
  }

  function exportCSV() {
    const header = "Číslo;Datum;Popis;VS;Typ;Částka";
    const rows = filtered.map((d) =>
      `${d.kod};${d.datVyst};${d.popis || ""};${d.sparpiSym || ""};${d.typPohybuK === "typPohybu.prijem" ? "Příjem" : "Výdej"};${d.sumCelkem}`
    );
    triggerDownload("banka_export.csv", [header, ...rows].join("\n"));
  }

  const columns: ColumnDef<FlexiBanka>[] = [
    { accessorKey: "kod", header: "Číslo" },
    { accessorKey: "datVyst", header: "Datum", cell: ({ row }) => formatDate(row.original.datVyst) },
    { accessorKey: "popis", header: "Popis", cell: ({ row }) => <span className="text-muted-foreground">{row.original.popis}</span> },
    { accessorKey: "sparpiSym", header: "VS" },
    {
      accessorKey: "typPohybuK", header: "Typ",
      cell: ({ row }) => (
        <Badge variant={row.original.typPohybuK === "typPohybu.prijem" ? "default" : "secondary"}>
          {row.original.typPohybuK === "typPohybu.prijem" ? "Příjem" : "Výdej"}
        </Badge>
      ),
    },
    {
      accessorKey: "sumCelkem", header: "Částka",
      cell: ({ row }) => {
        const amount = row.original.sumCelkem;
        return (
          <span className={`font-semibold ${amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
            {amount > 0 ? "+" : ""}{formatCZK(amount)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bankovní pohyby</h1>
          <p className="text-muted-foreground">Přehled bankovních transakcí</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm" onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nový pohyb
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "typPohybu.prijem", "typPohybu.vydej"] as TypeFilter[]).map((t) => (
          <Button key={t} variant={typeFilter === t ? "default" : "outline"} size="sm" onClick={() => setTypeFilter(t)}>
            {t === "all" ? "Vše" : t === "typPohybu.prijem" ? "Příjmy" : "Výdaje"}
            {t !== "all" && <Badge variant="secondary" className="ml-2 text-[10px]">{data.filter((d) => d.typPohybuK === t).length}</Badge>}
          </Button>
        ))}
      </div>

      <DataTable columns={columns} data={filtered} searchKey="popis" searchPlaceholder="Hledat pohyb..." />

      {/* Add dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nový bankovní pohyb</DialogTitle>
            <DialogDescription>Přidejte manuální bankovní záznam</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Datum</Label>
                <Input type="date" value={form.datVyst} onChange={(e) => setForm({ ...form, datVyst: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Typ</Label>
                <Select value={form.typPohybuK} onValueChange={(v) => v && setForm({ ...form, typPohybuK: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="typPohybu.prijem">Příjem</SelectItem>
                    <SelectItem value="typPohybu.vydej">Výdej</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Částka (CZK)</Label>
                <Input type="number" value={form.sumCelkem} onChange={(e) => setForm({ ...form, sumCelkem: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>VS</Label>
                <Input value={form.sparpiSym} onChange={(e) => setForm({ ...form, sparpiSym: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Popis</Label>
              <Input value={form.popis} onChange={(e) => setForm({ ...form, popis: e.target.value })} placeholder="Popis transakce" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Zrušit</Button>
            <Button onClick={addEntry} disabled={!form.sumCelkem || !form.popis}>
              <Save className="mr-2 h-4 w-4" /> Přidat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
