"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { mockPokladna, formatCZK, formatDate, type MockPokladniPohyb } from "@/lib/mock-data";
import { Wallet, TrendingUp, TrendingDown, Plus, Download, Save } from "lucide-react";

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PokladnaPage() {
  const [data, setData] = useState(mockPokladna);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [form, setForm] = useState({ datVyst: "", sumCelkem: "", popis: "", typPohybuK: "typPohybu.vydej", pokladna: "Hlavní pokladna" });

  const prijmy = data.filter((p) => p.typPohybuK === "typPohybu.prijem").reduce((sum, p) => sum + p.sumCelkem, 0);
  const vydaje = data.filter((p) => p.typPohybuK === "typPohybu.vydej").reduce((sum, p) => sum + p.sumCelkem, 0);
  const zustatek = prijmy - vydaje;

  function addEntry() {
    const entry: MockPokladniPohyb = {
      id: Date.now(),
      kod: `PP-${new Date().getFullYear()}/${String(data.length + 1).padStart(3, "0")}`,
      datVyst: form.datVyst || new Date().toISOString().slice(0, 10),
      sumCelkem: Math.abs(Number(form.sumCelkem)),
      popis: form.popis,
      typPohybuK: form.typPohybuK,
      pokladna: form.pokladna,
    };
    setData((prev) => [entry, ...prev]);
    setAddDialogOpen(false);
    setForm({ datVyst: "", sumCelkem: "", popis: "", typPohybuK: "typPohybu.vydej", pokladna: "Hlavní pokladna" });
  }

  function exportCSV() {
    const header = "Číslo;Datum;Popis;Pokladna;Typ;Částka";
    const rows = data.map((d) =>
      `${d.kod};${d.datVyst};${d.popis};${d.pokladna};${d.typPohybuK === "typPohybu.prijem" ? "Příjem" : "Výdej"};${d.sumCelkem}`
    );
    triggerDownload("pokladna_export.csv", [header, ...rows].join("\n"));
  }

  const columns: ColumnDef<MockPokladniPohyb>[] = [
    { accessorKey: "kod", header: "Číslo" },
    { accessorKey: "datVyst", header: "Datum", cell: ({ row }) => formatDate(row.original.datVyst) },
    { accessorKey: "popis", header: "Popis", cell: ({ row }) => <span className="text-muted-foreground">{row.original.popis}</span> },
    { accessorKey: "pokladna", header: "Pokladna", cell: ({ row }) => <Badge variant="outline">{row.original.pokladna}</Badge> },
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
        const isPrijem = row.original.typPohybuK === "typPohybu.prijem";
        return (
          <span className={`font-semibold ${isPrijem ? "text-emerald-600" : "text-red-500"}`}>
            {isPrijem ? "+" : "−"}{formatCZK(row.original.sumCelkem)}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pokladna</h1>
          <p className="text-muted-foreground">Pokladní pohyby</p>
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Příjmy</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCZK(prijmy)}</div>
            <p className="text-xs text-muted-foreground">{data.filter((p) => p.typPohybuK === "typPohybu.prijem").length} pohybů</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Výdaje</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{formatCZK(vydaje)}</div>
            <p className="text-xs text-muted-foreground">{data.filter((p) => p.typPohybuK === "typPohybu.vydej").length} pohybů</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zůstatek</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCZK(zustatek)}</div>
            <p className="text-xs text-muted-foreground">Celkem {data.length} pohybů</p>
          </CardContent>
        </Card>
      </div>

      <DataTable columns={columns} data={data} searchKey="popis" searchPlaceholder="Hledat pohyb..." />

      {/* Add dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nový pokladní pohyb</DialogTitle>
            <DialogDescription>Přidejte nový pokladní záznam</DialogDescription>
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
                <Label>Pokladna</Label>
                <Select value={form.pokladna} onValueChange={(v) => v && setForm({ ...form, pokladna: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hlavní pokladna">Hlavní pokladna</SelectItem>
                    <SelectItem value="Drobná pokladna">Drobná pokladna</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Popis</Label>
              <Input value={form.popis} onChange={(e) => setForm({ ...form, popis: e.target.value })} placeholder="Popis pohybu" />
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
