"use client";

import { Card, CardContent } from "@/components/ui/card";
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
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Mail, Send, FileText, Building2, Pencil, Trash2, Eye, Save } from "lucide-react";
import { useState } from "react";

interface Client {
  id: number;
  name: string;
  company: string;
  ic: string;
  email: string;
  status: "active" | "paused";
  invoiceChannel: string;
  invoiceCount: number;
  balance: number;
}

const initialClients: Client[] = [
  { id: 1, name: "Tomáš Mertin", company: "TM Solutions s.r.o.", ic: "12345678", email: "tomas.mertin@gmail.com", status: "active", invoiceChannel: "email", invoiceCount: 24, balance: 45600 },
  { id: 2, name: "Jana Svobodová", company: "XYZ Trading a.s.", ic: "87654321", email: "jana@xyz.cz", status: "active", invoiceChannel: "datovka", invoiceCount: 18, balance: 0 },
  { id: 3, name: "Petr Dvořák", company: "DEF Consulting s.r.o.", ic: "11223344", email: "petr@def.cz", status: "active", invoiceChannel: "portal", invoiceCount: 12, balance: 78900 },
  { id: 4, name: "Martin Kovář", company: "GHI Manufacturing s.r.o.", ic: "55667788", email: "martin@ghi.cz", status: "active", invoiceChannel: "email", invoiceCount: 36, balance: 0 },
  { id: 5, name: "Eva Procházková", company: "JKL Services s.r.o.", ic: "99887766", email: "eva@jkl.cz", status: "paused", invoiceChannel: "posta", invoiceCount: 6, balance: 18700 },
  { id: 6, name: "David Černý", company: "MNO Digital a.s.", ic: "33445566", email: "david@mno.cz", status: "active", invoiceChannel: "isdoc", invoiceCount: 42, balance: 0 },
];

const channelLabels: Record<string, { label: string; icon: typeof Mail }> = {
  email: { label: "Email", icon: Mail },
  datovka: { label: "Datová schránka", icon: Send },
  portal: { label: "Klientský portál", icon: FileText },
  posta: { label: "Pošta", icon: Send },
  isdoc: { label: "ISDOC", icon: FileText },
};

function formatCZK(amount: number) {
  return new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", minimumFractionDigits: 0 }).format(amount);
}

type ClientForm = { name: string; company: string; ic: string; email: string; invoiceChannel: string; status: "active" | "paused" };
const emptyForm: ClientForm = { name: "", company: "", ic: "", email: "", invoiceChannel: "email", status: "active" };

export default function AdminKlientiPage() {
  const [clients, setClients] = useState(initialClients);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailClient, setDetailClient] = useState<Client | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ClientForm>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<Client | null>(null);

  const filtered = clients.filter((c) =>
    `${c.name} ${c.company} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(client: Client) {
    setEditingId(client.id);
    setForm({ name: client.name, company: client.company, ic: client.ic, email: client.email, invoiceChannel: client.invoiceChannel, status: client.status });
    setDialogOpen(true);
  }

  function saveClient() {
    if (editingId) {
      setClients((prev) =>
        prev.map((c) => (c.id === editingId ? { ...c, ...form } : c))
      );
    } else {
      setClients((prev) => [
        ...prev,
        { id: Date.now(), ...form, status: form.status as "active" | "paused", invoiceCount: 0, balance: 0 },
      ]);
    }
    setDialogOpen(false);
  }

  function confirmDelete(client: Client) {
    setDeleteConfirm(client);
  }

  function doDelete() {
    if (!deleteConfirm) return;
    setClients((prev) => prev.filter((c) => c.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  }

  function toggleStatus(client: Client) {
    setClients((prev) =>
      prev.map((c) =>
        c.id === client.id ? { ...c, status: c.status === "active" ? "paused" as const : "active" as const } : c
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Správa klientů</h1>
          <p className="text-muted-foreground">Přehled a správa klientského portfolia</p>
        </div>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Nový klient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Celkem klientů</p>
            <p className="text-2xl font-bold">{clients.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Aktivních</p>
            <p className="text-2xl font-bold text-emerald-600">{clients.filter((c) => c.status === "active").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Neuhrazené pohledávky</p>
            <p className="text-2xl font-bold text-amber-600">{formatCZK(clients.reduce((s, c) => s + c.balance, 0))}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Celkem faktur</p>
            <p className="text-2xl font-bold">{clients.reduce((s, c) => s + c.invoiceCount, 0)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Hledat klienta..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Client list */}
      <div className="space-y-3">
        {filtered.map((client) => {
          const channel = channelLabels[client.invoiceChannel] || { label: client.invoiceChannel, icon: Mail };
          return (
            <Card key={client.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
                    {client.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{client.name}</p>
                      <Badge variant={client.status === "active" ? "default" : "secondary"}>
                        {client.status === "active" ? "Aktivní" : "Pozastaven"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{client.company}</span>
                      <span>IČ: {client.ic}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Kanál</p>
                    <p className="flex items-center gap-1 font-medium">
                      <channel.icon className="h-3.5 w-3.5" />
                      {channel.label}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Faktur</p>
                    <p className="font-medium">{client.invoiceCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Dluh</p>
                    <p className={`font-medium ${client.balance > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                      {client.balance > 0 ? formatCZK(client.balance) : "—"}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>} />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDetailClient(client)}>
                        <Eye className="mr-2 h-4 w-4" /> Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(client)}>
                        <Pencil className="mr-2 h-4 w-4" /> Upravit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleStatus(client)}>
                        {client.status === "active" ? "Pozastavit" : "Aktivovat"}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => confirmDelete(client)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Smazat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Žádní klienti nenalezeni</p>
        )}
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Upravit klienta" : "Nový klient"}</DialogTitle>
            <DialogDescription>
              {editingId ? "Upravte údaje klienta" : "Vyplňte údaje nového klienta"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Jméno</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jan Novák" />
              </div>
              <div className="space-y-2">
                <Label>Společnost</Label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Firma s.r.o." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>IČ</Label>
                <Input value={form.ic} onChange={(e) => setForm({ ...form, ic: e.target.value })} placeholder="12345678" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jan@firma.cz" type="email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Kanál faktur</Label>
                <Select value={form.invoiceChannel} onValueChange={(v) => v && setForm({ ...form, invoiceChannel: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="datovka">Datová schránka</SelectItem>
                    <SelectItem value="portal">Klientský portál</SelectItem>
                    <SelectItem value="posta">Pošta</SelectItem>
                    <SelectItem value="isdoc">ISDOC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stav</Label>
                <Select value={form.status} onValueChange={(v) => v && setForm({ ...form, status: v as "active" | "paused" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktivní</SelectItem>
                    <SelectItem value="paused">Pozastaven</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrušit</Button>
            <Button onClick={saveClient} disabled={!form.name || !form.company}>
              <Save className="mr-2 h-4 w-4" /> {editingId ? "Uložit" : "Vytvořit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detailClient} onOpenChange={(open) => !open && setDetailClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailClient?.name}</DialogTitle>
            <DialogDescription>{detailClient?.company}</DialogDescription>
          </DialogHeader>
          {detailClient && (
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">IČ</span><span className="font-medium">{detailClient.ic}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{detailClient.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stav</span><Badge variant={detailClient.status === "active" ? "default" : "secondary"}>{detailClient.status === "active" ? "Aktivní" : "Pozastaven"}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Kanál faktur</span><span className="font-medium">{channelLabels[detailClient.invoiceChannel]?.label || detailClient.invoiceChannel}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Počet faktur</span><span className="font-medium">{detailClient.invoiceCount}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Neuhrazeno</span><span className={`font-medium ${detailClient.balance > 0 ? "text-amber-600" : "text-emerald-600"}`}>{detailClient.balance > 0 ? formatCZK(detailClient.balance) : "Vše uhrazeno"}</span></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setDetailClient(null); if (detailClient) openEdit(detailClient); }}>
              <Pencil className="mr-2 h-4 w-4" /> Upravit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smazat klienta</DialogTitle>
            <DialogDescription>
              Opravdu chcete smazat klienta {deleteConfirm?.name} ({deleteConfirm?.company})? Tuto akci nelze vrátit.
            </DialogDescription>
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
