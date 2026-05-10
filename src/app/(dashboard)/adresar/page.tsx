"use client";

import { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { FlexiAdresar } from "@/lib/flexi-types";
import { mockAdresar } from "@/lib/mock-data";
import { Plus, Download, Eye, Pencil, Trash2, Save } from "lucide-react";

type ContactForm = {
  nazev: string; ic: string; dic: string; ulice: string; mesto: string; psc: string; email: string; tel: string;
};

const emptyForm: ContactForm = { nazev: "", ic: "", dic: "", ulice: "", mesto: "", psc: "", email: "", tel: "" };

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdresarPage() {
  const [contacts, setContacts] = useState<FlexiAdresar[]>(mockAdresar);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ContactForm>(emptyForm);
  const [detailContact, setDetailContact] = useState<FlexiAdresar | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<FlexiAdresar | null>(null);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(c: FlexiAdresar) {
    setEditingId(c.id);
    setForm({ nazev: c.nazev, ic: c.ic || "", dic: c.dic || "", ulice: c.ulice || "", mesto: c.mesto || "", psc: c.psc || "", email: c.email || "", tel: c.tel || "" });
    setDialogOpen(true);
  }

  function saveContact() {
    if (editingId) {
      setContacts((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form, kod: c.kod } : c))
      );
    } else {
      setContacts((prev) => [
        ...prev,
        { id: Date.now(), kod: form.nazev.substring(0, 3).toUpperCase(), ...form },
      ]);
    }
    setDialogOpen(false);
  }

  function doDelete() {
    if (!deleteConfirm) return;
    setContacts((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  }

  function exportCSV() {
    const header = "Název;IČ;DIČ;Ulice;Město;PSČ;Email;Telefon";
    const rows = contacts.map((c) =>
      `${c.nazev};${c.ic || ""};${c.dic || ""};${c.ulice || ""};${c.mesto || ""};${c.psc || ""};${c.email || ""};${c.tel || ""}`
    );
    triggerDownload("adresar.csv", [header, ...rows].join("\n"));
  }

  const columns: ColumnDef<FlexiAdresar>[] = [
    {
      accessorKey: "nazev",
      header: "Název",
      cell: ({ row }) => <span className="font-medium">{row.original.nazev}</span>,
    },
    { accessorKey: "ic", header: "IČ" },
    { accessorKey: "dic", header: "DIČ" },
    {
      accessorKey: "mesto",
      header: "Adresa",
      cell: ({ row }) => {
        const a = row.original;
        return (
          <span className="text-muted-foreground">
            {[a.ulice, a.mesto, a.psc].filter(Boolean).join(", ")}
          </span>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <a href={`mailto:${row.original.email}`} className="text-primary hover:underline">
          {row.original.email}
        </a>
      ),
    },
    { accessorKey: "tel", header: "Telefon" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailContact(row.original)} title="Detail">
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(row.original)} title="Upravit">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeleteConfirm(row.original)} title="Smazat">
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Adresář</h1>
          <p className="text-muted-foreground">Firmy a kontakty</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
          <Button size="sm" onClick={openAdd}>
            <Plus className="mr-2 h-4 w-4" /> Nový kontakt
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        searchKey="nazev"
        searchPlaceholder="Hledat firmu..."
      />

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Upravit kontakt" : "Nový kontakt"}</DialogTitle>
            <DialogDescription>{editingId ? "Upravte údaje firmy" : "Přidejte novou firmu do adresáře"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Název firmy</Label>
              <Input value={form.nazev} onChange={(e) => setForm({ ...form, nazev: e.target.value })} placeholder="Firma s.r.o." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>IČ</Label>
                <Input value={form.ic} onChange={(e) => setForm({ ...form, ic: e.target.value })} placeholder="12345678" />
              </div>
              <div className="space-y-2">
                <Label>DIČ</Label>
                <Input value={form.dic} onChange={(e) => setForm({ ...form, dic: e.target.value })} placeholder="CZ12345678" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ulice</Label>
              <Input value={form.ulice} onChange={(e) => setForm({ ...form, ulice: e.target.value })} placeholder="Hlavní 1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Město</Label>
                <Input value={form.mesto} onChange={(e) => setForm({ ...form, mesto: e.target.value })} placeholder="Praha" />
              </div>
              <div className="space-y-2">
                <Label>PSČ</Label>
                <Input value={form.psc} onChange={(e) => setForm({ ...form, psc: e.target.value })} placeholder="11000" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="info@firma.cz" type="email" />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input value={form.tel} onChange={(e) => setForm({ ...form, tel: e.target.value })} placeholder="+420 111 222 333" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrušit</Button>
            <Button onClick={saveContact} disabled={!form.nazev}>
              <Save className="mr-2 h-4 w-4" /> {editingId ? "Uložit" : "Přidat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detailContact} onOpenChange={(open) => !open && setDetailContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailContact?.nazev}</DialogTitle>
          </DialogHeader>
          {detailContact && (
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">IČ</span><span className="font-medium">{detailContact.ic || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">DIČ</span><span className="font-medium">{detailContact.dic || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Adresa</span><span className="font-medium">{[detailContact.ulice, detailContact.mesto, detailContact.psc].filter(Boolean).join(", ") || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span>{detailContact.email ? <a href={`mailto:${detailContact.email}`} className="text-primary hover:underline font-medium">{detailContact.email}</a> : <span>—</span>}</div>
              <div className="flex justify-between"><span className="text-muted-foreground">Telefon</span><span className="font-medium">{detailContact.tel || "—"}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { if (detailContact) { setDetailContact(null); openEdit(detailContact); } }}>
              <Pencil className="mr-2 h-4 w-4" /> Upravit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smazat kontakt</DialogTitle>
            <DialogDescription>Opravdu chcete smazat {deleteConfirm?.nazev}? Tuto akci nelze vrátit.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Zrušit</Button>
            <Button variant="destructive" onClick={doDelete}>
              <Trash2 className="mr-2 h-4 w-4" /> Smazat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
