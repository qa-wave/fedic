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
import {
  Mail, Send, MessageSquare, Globe, FileText, Smartphone, Calendar,
  Clock, CheckCircle2, Bell, Settings, Plus, Save,
} from "lucide-react";

interface DeliveryChannel {
  id: string;
  name: string;
  desc: string;
  icon: typeof Mail;
  enabled: boolean;
  target: string;
  color: string;
}

interface Schedule {
  id: number;
  report: string;
  frequency: string;
  day: string;
  channel: string;
  enabled: boolean;
}

const initialChannels: DeliveryChannel[] = [
  { id: "email", name: "Email", desc: "Pravidelné reporty a přehledy na váš email jako PDF příloha.", icon: Mail, enabled: true, target: "tomas.mertin@gmail.com", color: "from-blue-500 to-indigo-600" },
  { id: "datovka", name: "Datová schránka", desc: "Odesílání výkazů a přiznání přes ISDS. Právně závazné doručení.", icon: Send, enabled: false, target: "—", color: "from-emerald-500 to-teal-600" },
  { id: "slack", name: "Slack", desc: "Notifikace o nových reportech a upozornění na důležité termíny.", icon: MessageSquare, enabled: true, target: "#účetnictví", color: "from-purple-500 to-violet-600" },
  { id: "sms", name: "SMS", desc: "Upozornění na důležité daňové termíny a splatnosti.", icon: Smartphone, enabled: true, target: "+420 *** *** 789", color: "from-cyan-500 to-sky-600" },
  { id: "portal", name: "Klientský portál", desc: "Vše automaticky dostupné ke stažení přímo zde v portálu.", icon: Globe, enabled: true, target: "Vždy aktivní", color: "from-amber-500 to-orange-600" },
];

const initialSchedules: Schedule[] = [
  { id: 1, report: "Měsíční přehled účetnictví", frequency: "Měsíčně", day: "5. den v měsíci", channel: "Email + Portál", enabled: true },
  { id: 2, report: "Přehled pohledávek a závazků", frequency: "Týdně", day: "Pondělí", channel: "Slack", enabled: true },
  { id: 3, report: "DPH přiznání", frequency: "Čtvrtletně", day: "20. den po konci Q", channel: "Email + Datovka", enabled: true },
  { id: 4, report: "Cash Flow report", frequency: "Měsíčně", day: "10. den v měsíci", channel: "Email", enabled: true },
  { id: 5, report: "Upozornění na splatnosti", frequency: "Průběžně", day: "3 dny před splatností", channel: "SMS + Slack", enabled: true },
  { id: 6, report: "Roční závěrka", frequency: "Ročně", day: "Březen", channel: "Email + Datovka + Portál", enabled: false },
];

export default function PortalNastaveniPage() {
  const [channels, setChannels] = useState(initialChannels);
  const [schedules, setSchedules] = useState(initialSchedules);

  // Channel edit dialog
  const [editChannel, setEditChannel] = useState<DeliveryChannel | null>(null);
  const [channelTarget, setChannelTarget] = useState("");
  const [channelEnabled, setChannelEnabled] = useState(true);

  // Schedule edit/add dialog
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [schedForm, setSchedForm] = useState({ report: "", frequency: "Měsíčně", day: "", channel: "" });

  const [saved, setSaved] = useState(false);

  function openChannelEdit(ch: DeliveryChannel) {
    setEditChannel(ch);
    setChannelTarget(ch.target);
    setChannelEnabled(ch.enabled);
  }

  function saveChannel() {
    if (!editChannel) return;
    setChannels((prev) =>
      prev.map((ch) =>
        ch.id === editChannel.id ? { ...ch, target: channelTarget, enabled: channelEnabled } : ch
      )
    );
    setEditChannel(null);
    flashSaved();
  }

  function openScheduleEdit(sched: Schedule) {
    setEditSchedule(sched);
    setSchedForm({ report: sched.report, frequency: sched.frequency, day: sched.day, channel: sched.channel });
    setScheduleDialogOpen(true);
  }

  function openScheduleAdd() {
    setEditSchedule(null);
    setSchedForm({ report: "", frequency: "Měsíčně", day: "", channel: "" });
    setScheduleDialogOpen(true);
  }

  function saveSchedule() {
    if (editSchedule) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editSchedule.id ? { ...s, ...schedForm } : s
        )
      );
    } else {
      setSchedules((prev) => [
        ...prev,
        { id: Date.now(), ...schedForm, enabled: true },
      ]);
    }
    setScheduleDialogOpen(false);
    flashSaved();
  }

  function toggleSchedule(id: number) {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  }

  function flashSaved() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success("Nastavení uloženo");
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nastavení zasílání</h1>
          <p className="text-muted-foreground">
            Nastavte si, jakými kanály a jak často chcete dostávat přehledy o vašem účetnictví
          </p>
        </div>
        {saved && (
          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 gap-1">
            <CheckCircle2 className="h-3 w-3" /> Uloženo
          </Badge>
        )}
      </div>

      {/* Delivery channels */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Doručovací kanály</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((ch) => (
            <Card key={ch.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${ch.color} text-white shadow`}>
                    <ch.icon className="h-5 w-5" />
                  </div>
                  <Badge variant={ch.enabled ? "default" : "secondary"}>
                    {ch.enabled ? "Aktivní" : "Vypnuto"}
                  </Badge>
                </div>
                <h3 className="mt-3 font-semibold">{ch.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{ch.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{ch.target}</span>
                  <Button variant="ghost" size="sm" onClick={() => openChannelEdit(ch)}>
                    <Settings className="mr-1 h-3 w-3" /> Upravit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Scheduled reports */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Pravidelné reporty</h2>
          <Button variant="outline" size="sm" onClick={openScheduleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Přidat report
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {schedules.map((sched) => (
                <div key={sched.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {sched.frequency === "Průběžně" ? <Bell className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{sched.report}</p>
                      <p className="text-sm text-muted-foreground">
                        <Clock className="mr-1 inline h-3 w-3" />
                        {sched.frequency} &middot; {sched.day}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-1">
                      {sched.channel.split(" + ").map((ch) => (
                        <Badge key={ch} variant="outline" className="text-[10px]">{ch}</Badge>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleSchedule(sched.id)}
                      className="cursor-pointer"
                    >
                      <Badge variant={sched.enabled ? "default" : "secondary"} className="shrink-0 cursor-pointer">
                        {sched.enabled ? "Aktivní" : "Neaktivní"}
                      </Badge>
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => openScheduleEdit(sched)}>Upravit</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload channels info */}
      <Card>
        <CardHeader>
          <CardTitle>Jak nám dodat doklady</CardTitle>
          <CardDescription>Způsoby, kterými můžete nahrávat faktury a další podklady ke zpracování</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, name: "Drag & Drop", desc: "Přetáhněte soubory přímo na stránku Přehled" },
              { icon: Mail, name: "Email", desc: "Pošlete na doklady@fedicfinance.com" },
              { icon: Smartphone, name: "Mobilní foto", desc: "Vyfoťte doklad a nahrajte přes portál" },
              { icon: MessageSquare, name: "Slack", desc: "Pošlete do kanálu #doklady" },
              { icon: Globe, name: "Cloud storage", desc: "Sdílená složka Google Drive / OneDrive (brzy)" },
              { icon: Send, name: "Datová schránka", desc: "Automatický příjem (brzy)" },
            ].map((ch) => (
              <div key={ch.name} className="flex items-center gap-3 rounded-xl border p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                  <ch.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{ch.name}</p>
                  <p className="text-[11px] text-muted-foreground">{ch.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Channel edit dialog */}
      <Dialog open={!!editChannel} onOpenChange={(open) => !open && setEditChannel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upravit kanál: {editChannel?.name}</DialogTitle>
            <DialogDescription>{editChannel?.desc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Cíl / adresa</Label>
              <Input value={channelTarget} onChange={(e) => setChannelTarget(e.target.value)} />
            </div>
            <div className="flex items-center gap-3">
              <Label>Stav</Label>
              <Button
                variant={channelEnabled ? "default" : "secondary"}
                size="sm"
                onClick={() => setChannelEnabled(!channelEnabled)}
              >
                {channelEnabled ? "Aktivní" : "Vypnuto"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditChannel(null)}>Zrušit</Button>
            <Button onClick={saveChannel}>
              <Save className="mr-2 h-4 w-4" /> Uložit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule edit/add dialog */}
      <Dialog open={scheduleDialogOpen} onOpenChange={setScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editSchedule ? "Upravit report" : "Přidat nový report"}</DialogTitle>
            <DialogDescription>Nastavte pravidelné zasílání reportu</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Název reportu</Label>
              <Input value={schedForm.report} onChange={(e) => setSchedForm({ ...schedForm, report: e.target.value })} placeholder="Např. Měsíční přehled" />
            </div>
            <div className="space-y-2">
              <Label>Frekvence</Label>
              <Select value={schedForm.frequency} onValueChange={(v) => v && setSchedForm({ ...schedForm, frequency: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Denně">Denně</SelectItem>
                  <SelectItem value="Týdně">Týdně</SelectItem>
                  <SelectItem value="Měsíčně">Měsíčně</SelectItem>
                  <SelectItem value="Čtvrtletně">Čtvrtletně</SelectItem>
                  <SelectItem value="Ročně">Ročně</SelectItem>
                  <SelectItem value="Průběžně">Průběžně</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Kdy</Label>
              <Input value={schedForm.day} onChange={(e) => setSchedForm({ ...schedForm, day: e.target.value })} placeholder="Např. 5. den v měsíci" />
            </div>
            <div className="space-y-2">
              <Label>Kanál zasílání</Label>
              <Input value={schedForm.channel} onChange={(e) => setSchedForm({ ...schedForm, channel: e.target.value })} placeholder="Např. Email + Portál" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleDialogOpen(false)}>Zrušit</Button>
            <Button onClick={saveSchedule} disabled={!schedForm.report || !schedForm.day || !schedForm.channel}>
              <Save className="mr-2 h-4 w-4" /> {editSchedule ? "Uložit" : "Přidat"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
