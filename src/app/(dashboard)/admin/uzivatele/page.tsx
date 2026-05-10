"use client";

import { useState } from "react";
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
import { Plus, Shield, User, MoreHorizontal, Key, Pencil, Trash2, Save, Eye } from "lucide-react";

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: "admin" | "accountant" | "client";
  lastLogin: string;
  status: "online" | "offline";
}

const initialUsers: UserItem[] = [
  { id: 1, name: "Radek Fedič", email: "radek@fedicfinance.com", role: "admin", lastLogin: "2026-04-17 08:30", status: "online" },
  { id: 2, name: "Tomáš Mertin", email: "tomas.mertin@gmail.com", role: "client", lastLogin: "2026-04-16 14:22", status: "offline" },
  { id: 3, name: "Jana Svobodová", email: "jana@xyz.cz", role: "client", lastLogin: "2026-04-15 09:10", status: "offline" },
  { id: 4, name: "Petr Dvořák", email: "petr@def.cz", role: "client", lastLogin: "2026-04-14 16:45", status: "offline" },
  { id: 5, name: "Marie Nováková", email: "marie@fedicfinance.com", role: "accountant", lastLogin: "2026-04-17 07:55", status: "online" },
  { id: 6, name: "David Černý", email: "david@mno.cz", role: "client", lastLogin: "2026-04-12 11:30", status: "offline" },
];

const roleConfig: Record<string, { label: string; icon: typeof Shield; variant: "default" | "secondary" | "outline" }> = {
  admin: { label: "Administrátor", icon: Shield, variant: "default" },
  accountant: { label: "Účetní", icon: Key, variant: "secondary" },
  client: { label: "Klient", icon: User, variant: "outline" },
};

type UserForm = { name: string; email: string; role: "admin" | "accountant" | "client" };
const emptyForm: UserForm = { name: "", email: "", role: "client" };

export default function AdminUzivatele() {
  const [users, setUsers] = useState(initialUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [detailUser, setDetailUser] = useState<UserItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<UserItem | null>(null);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(u: UserItem) {
    setEditingId(u.id);
    setForm({ name: u.name, email: u.email, role: u.role });
    setDialogOpen(true);
  }

  function saveUser() {
    if (editingId) {
      setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...form } : u)));
    } else {
      setUsers((prev) => [...prev, { id: Date.now(), ...form, lastLogin: "—", status: "offline" as const }]);
    }
    setDialogOpen(false);
  }

  function doDelete() {
    if (!deleteConfirm) return;
    setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
    setDeleteConfirm(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Uživatelé & role</h1>
          <p className="text-muted-foreground">Správa přístupů do systému</p>
        </div>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Přidat uživatele</Button>
      </div>

      {/* Role overview */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Object.entries(roleConfig).map(([key, config]) => {
          const count = users.filter((u) => u.role === key).length;
          return (
            <Card key={key}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <config.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{config.label}</p>
                  <p className="text-sm text-muted-foreground">{count} {count === 1 ? "uživatel" : "uživatelů"}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Permissions info */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-semibold mb-3">Oprávnění rolí</h3>
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <p className="font-medium flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Administrátor</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>Plný přístup ke všem datům</li>
                <li>Správa klientů a uživatelů</li>
                <li>Konfigurace doručovacích kanálů</li>
                <li>Nastavení systému a API</li>
                <li>Přístup k logům a auditům</li>
              </ul>
            </div>
            <div>
              <p className="font-medium flex items-center gap-2"><Key className="h-4 w-4 text-primary" /> Účetní</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>Správa faktur a účetních dokladů</li>
                <li>Přístup k adresáři a bance</li>
                <li>Odesílání faktur klientům</li>
                <li>Finanční přehledy a reporty</li>
              </ul>
            </div>
            <div>
              <p className="font-medium flex items-center gap-2"><User className="h-4 w-4 text-primary" /> Klient</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                <li>Zobrazení vlastních faktur</li>
                <li>Stahování dokladů (PDF)</li>
                <li>Přehled pohledávek/závazků</li>
                <li>Sdílené dokumenty</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User list */}
      <div className="space-y-3">
        {users.map((user) => {
          const role = roleConfig[user.role];
          return (
            <Card key={user.id} className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    {user.status === "online" && (
                      <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-emerald-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={role.variant}>{role.label}</Badge>
                  <span className="text-xs text-muted-foreground">Poslední přihlášení: {user.lastLogin}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>} />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDetailUser(user)}>
                        <Eye className="mr-2 h-4 w-4" /> Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openEdit(user)}>
                        <Pencil className="mr-2 h-4 w-4" /> Upravit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setDeleteConfirm(user)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Smazat
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add/Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Upravit uživatele" : "Přidat uživatele"}</DialogTitle>
            <DialogDescription>{editingId ? "Upravte údaje uživatele" : "Vytvořte nový účet"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Jméno</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jan Novák" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jan@firma.cz" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => v && setForm({ ...form, role: v as UserForm["role"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrátor</SelectItem>
                  <SelectItem value="accountant">Účetní</SelectItem>
                  <SelectItem value="client">Klient</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Zrušit</Button>
            <Button onClick={saveUser} disabled={!form.name || !form.email}>
              <Save className="mr-2 h-4 w-4" /> {editingId ? "Uložit" : "Vytvořit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail dialog */}
      <Dialog open={!!detailUser} onOpenChange={(open) => !open && setDetailUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{detailUser?.name}</DialogTitle>
            <DialogDescription>{roleConfig[detailUser?.role || "client"]?.label}</DialogDescription>
          </DialogHeader>
          {detailUser && (
            <div className="space-y-3 py-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{detailUser.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Role</span><Badge variant={roleConfig[detailUser.role].variant}>{roleConfig[detailUser.role].label}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Poslední přihlášení</span><span className="font-medium">{detailUser.lastLogin}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Stav</span><Badge variant={detailUser.status === "online" ? "default" : "secondary"}>{detailUser.status === "online" ? "Online" : "Offline"}</Badge></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { if (detailUser) { setDetailUser(null); openEdit(detailUser); } }}>
              <Pencil className="mr-2 h-4 w-4" /> Upravit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smazat uživatele</DialogTitle>
            <DialogDescription>Opravdu chcete smazat účet {deleteConfirm?.name}? Tuto akci nelze vrátit.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Zrušit</Button>
            <Button variant="destructive" onClick={doDelete}><Trash2 className="mr-2 h-4 w-4" /> Smazat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
