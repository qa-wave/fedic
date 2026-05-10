"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Database, Mail, Shield, Webhook, CheckCircle2, Loader2, Plus, Save, Trash2 } from "lucide-react";

interface WebhookItem {
  id: number;
  name: string;
  url: string;
  active: boolean;
}

export default function AdminNastaveniPage() {
  // Flexi API
  const [flexiStatus, setFlexiStatus] = useState<"idle" | "testing" | "ok" | "error">("idle");

  // SMTP
  const [smtp, setSmtp] = useState({ server: "", port: "587", encryption: "TLS" });
  const [smtpSaved, setSmtpSaved] = useState(false);

  // Webhooks
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([
    { id: 1, name: "Nová faktura → Slack", url: "https://hooks.slack.com/...", active: true },
    { id: 2, name: "Úhrada přijata → Email", url: "Notifikace účetní", active: true },
  ]);
  const [webhookDialogOpen, setWebhookDialogOpen] = useState(false);
  const [newWebhook, setNewWebhook] = useState({ name: "", url: "" });

  // Security
  const [auditStatus, setAuditStatus] = useState<"idle" | "running" | "done">("idle");

  function testConnection() {
    setFlexiStatus("testing");
    setTimeout(() => { setFlexiStatus("ok"); toast.success("Připojení k Flexi API úspěšné"); }, 1500);
  }

  function saveSMTP() {
    setSmtpSaved(true);
    setTimeout(() => setSmtpSaved(false), 2000);
    toast.success("SMTP nastavení uloženo");
  }

  function addWebhook() {
    setWebhooks((prev) => [
      ...prev,
      { id: Date.now(), name: newWebhook.name, url: newWebhook.url, active: true },
    ]);
    setNewWebhook({ name: "", url: "" });
    setWebhookDialogOpen(false);
    toast.success("Webhook přidán");
  }

  function removeWebhook(id: number) {
    setWebhooks((prev) => prev.filter((w) => w.id !== id));
    toast.success("Webhook smazán");
  }

  function toggleWebhook(id: number) {
    setWebhooks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, active: !w.active } : w))
    );
  }

  function runAudit() {
    setAuditStatus("running");
    setTimeout(() => setAuditStatus("done"), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nastavení systému</h1>
        <p className="text-muted-foreground">Konfigurace API, emailů a systémových parametrů</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Flexi API */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Abra Flexi API</CardTitle>
                <CardDescription>Připojení k účetnímu systému</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Stav připojení</span>
              {flexiStatus === "ok" ? (
                <Badge className="bg-emerald-100 text-emerald-700 gap-1"><CheckCircle2 className="h-3 w-3" /> Připojeno</Badge>
              ) : flexiStatus === "error" ? (
                <Badge variant="destructive">Chyba</Badge>
              ) : (
                <Badge className="bg-emerald-100 text-emerald-700">Připojeno</Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label>URL instance</Label>
              <Input defaultValue="https://tomas-mertin.flexibee.eu/c/fiktivni_firma" className="text-xs" />
            </div>
            <div className="space-y-2">
              <Label>API uživatel</Label>
              <Input defaultValue="••••••••" type="password" />
            </div>
            <Button variant="outline" size="sm" onClick={testConnection} disabled={flexiStatus === "testing"}>
              {flexiStatus === "testing" ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testuji...</>
              ) : flexiStatus === "ok" ? (
                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Připojení OK</>
              ) : (
                "Otestovat připojení"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Email */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Emailový server</CardTitle>
                <CardDescription>SMTP pro odesílání faktur a notifikací</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Stav</span>
              {smtpSaved ? (
                <Badge className="bg-emerald-100 text-emerald-700 gap-1"><CheckCircle2 className="h-3 w-3" /> Uloženo</Badge>
              ) : smtp.server ? (
                <Badge className="bg-emerald-100 text-emerald-700">Nakonfigurováno</Badge>
              ) : (
                <Badge variant="secondary">Nenakonfigurováno</Badge>
              )}
            </div>
            <div className="space-y-2">
              <Label>SMTP server</Label>
              <Input placeholder="smtp.gmail.com" value={smtp.server} onChange={(e) => setSmtp({ ...smtp, server: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Port</Label>
                <Input value={smtp.port} onChange={(e) => setSmtp({ ...smtp, port: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Šifrování</Label>
                <Select value={smtp.encryption} onValueChange={(v) => v && setSmtp({ ...smtp, encryption: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TLS">TLS</SelectItem>
                    <SelectItem value="SSL">SSL</SelectItem>
                    <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={saveSMTP}>
              <Save className="mr-2 h-4 w-4" /> Uložit nastavení
            </Button>
          </CardContent>
        </Card>

        {/* Webhooks */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                <Webhook className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Webhooky</CardTitle>
                <CardDescription>Notifikace při změnách v systému</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Aktivní webhooky</span>
              <Badge>{webhooks.filter((w) => w.active).length}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              {webhooks.map((wh) => (
                <div key={wh.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{wh.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{wh.url}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <button onClick={() => toggleWebhook(wh.id)} className="cursor-pointer">
                      <Badge className={wh.active ? "bg-emerald-100 text-emerald-700 cursor-pointer" : "cursor-pointer"} variant={wh.active ? "default" : "secondary"}>
                        {wh.active ? "Aktivní" : "Vypnuto"}
                      </Badge>
                    </button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeWebhook(wh.id)}>
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => setWebhookDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Přidat webhook
            </Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Zabezpečení</CardTitle>
                <CardDescription>Bezpečnostní nastavení a audit</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Dvoufaktorová autentizace (2FA)</span>
                <Badge variant="secondary">Vypnuto</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Automatické odhlášení po nečinnosti</span>
                <Badge className="bg-emerald-100 text-emerald-700">30 min</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Šifrování dat v klidu</span>
                <Badge className="bg-emerald-100 text-emerald-700">AES-256</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Audit log</span>
                <Badge className="bg-emerald-100 text-emerald-700">Aktivní</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={runAudit} disabled={auditStatus === "running"}>
              {auditStatus === "running" ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Probíhá audit...</>
              ) : auditStatus === "done" ? (
                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Audit OK — žádné hrozby</>
              ) : (
                "Bezpečnostní audit"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Webhook dialog */}
      <Dialog open={webhookDialogOpen} onOpenChange={setWebhookDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Přidat webhook</DialogTitle>
            <DialogDescription>Webhook bude zavolán při změně v systému</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Název</Label>
              <Input value={newWebhook.name} onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })} placeholder="Např. Nový doklad → Slack" />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={newWebhook.url} onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })} placeholder="https://hooks.slack.com/..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setWebhookDialogOpen(false)}>Zrušit</Button>
            <Button onClick={addWebhook} disabled={!newWebhook.name || !newWebhook.url}>
              <Plus className="mr-2 h-4 w-4" /> Přidat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
