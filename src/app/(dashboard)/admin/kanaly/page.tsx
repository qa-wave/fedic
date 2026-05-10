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
  Mail, Send, FileText, Upload, MessageSquare, Camera,
  Cloud, Globe, Smartphone, Settings, ArrowDown, ArrowUp,
  CheckCircle2, Loader2, Save,
} from "lucide-react";

interface Channel {
  id: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  stats: number;
  color: string;
  config?: string;
}

const initialInbound: Channel[] = [
  { id: "upload", name: "Drag & Drop upload", desc: "Klient nahraje doklady přímo v portálu přetažením souborů.", icon: Upload, enabled: true, stats: 890, color: "from-blue-500 to-indigo-600" },
  { id: "email", name: "Email příjem", desc: "Klient pošle doklady na doklady@fedicfinance.com.", icon: Mail, enabled: true, stats: 1240, color: "from-emerald-500 to-teal-600", config: "doklady@fedicfinance.com" },
  { id: "photo", name: "Foto dokladu", desc: "Klient vyfotí účtenku mobilem. OCR rozpoznání.", icon: Camera, enabled: true, stats: 340, color: "from-violet-500 to-purple-600" },
  { id: "slack", name: "Slack kanál", desc: "Klient pošle doklad do Slack kanálu #doklady.", icon: MessageSquare, enabled: true, stats: 120, color: "from-pink-500 to-rose-600", config: "#doklady" },
  { id: "cloud", name: "Cloud storage", desc: "Sdílená složka Google Drive nebo OneDrive.", icon: Cloud, enabled: false, stats: 0, color: "from-cyan-500 to-sky-600" },
  { id: "datovka", name: "Datová schránka", desc: "Automatický příjem z datové schránky. ISDS integrace.", icon: Send, enabled: false, stats: 0, color: "from-gray-500 to-gray-600" },
];

const initialOutbound: Channel[] = [
  { id: "email-out", name: "Email (PDF)", desc: "Pravidelné zasílání reportů emailem.", icon: Mail, enabled: true, stats: 560, color: "from-blue-500 to-indigo-600", config: "smtp.gmail.com" },
  { id: "portal", name: "Klientský portál", desc: "Reporty dostupné ke stažení v klientské zóně.", icon: Globe, enabled: true, stats: 890, color: "from-amber-500 to-orange-600" },
  { id: "datovka-out", name: "Datová schránka", desc: "Odesílání přiznání a výkazů přes ISDS.", icon: Send, enabled: true, stats: 340, color: "from-emerald-500 to-teal-600" },
  { id: "sms", name: "SMS notifikace", desc: "Upozornění na termíny a splatnosti.", icon: Smartphone, enabled: true, stats: 2100, color: "from-cyan-500 to-sky-600", config: "+420 777 123 456" },
  { id: "slack-out", name: "Slack notifikace", desc: "Automatické notifikace do Slack kanálu.", icon: MessageSquare, enabled: true, stats: 420, color: "from-pink-500 to-rose-600", config: "#účetnictví" },
  { id: "isdoc", name: "ISDOC / XML export", desc: "Elektronické faktury v ISDOC formátu.", icon: FileText, enabled: true, stats: 560, color: "from-violet-500 to-purple-600" },
];

export default function AdminKanalyPage() {
  const [inbound, setInbound] = useState(initialInbound);
  const [outbound, setOutbound] = useState(initialOutbound);
  const [editChannel, setEditChannel] = useState<Channel | null>(null);
  const [editDirection, setEditDirection] = useState<"in" | "out">("in");
  const [configValue, setConfigValue] = useState("");
  const [channelEnabled, setChannelEnabled] = useState(true);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "ok">("idle");

  function openEdit(ch: Channel, direction: "in" | "out") {
    setEditChannel(ch);
    setEditDirection(direction);
    setConfigValue(ch.config || "");
    setChannelEnabled(ch.enabled);
    setTestStatus("idle");
  }

  function saveChannel() {
    if (!editChannel) return;
    const update = (channels: Channel[]) =>
      channels.map((c) =>
        c.id === editChannel.id ? { ...c, enabled: channelEnabled, config: configValue } : c
      );
    if (editDirection === "in") setInbound(update);
    else setOutbound(update);
    setEditChannel(null);
  }

  function testConnection() {
    setTestStatus("testing");
    setTimeout(() => setTestStatus("ok"), 1200);
  }

  function toggleChannel(id: string, direction: "in" | "out") {
    const update = (channels: Channel[]) =>
      channels.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c));
    if (direction === "in") setInbound(update);
    else setOutbound(update);
  }

  const totalIn = inbound.reduce((s, c) => s + c.stats, 0);
  const totalOut = outbound.reduce((s, c) => s + c.stats, 0);

  function ChannelGrid({ channels, direction }: { channels: Channel[]; direction: "in" | "out" }) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {channels.map((ch) => (
          <Card key={ch.id} className="group transition-shadow hover:shadow-lg">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${ch.color} text-white shadow`}>
                  <ch.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleChannel(ch.id, direction)} className="cursor-pointer">
                    <Badge variant={ch.enabled ? "default" : "secondary"} className="cursor-pointer">
                      {ch.enabled ? "Aktivní" : "Vypnuto"}
                    </Badge>
                  </button>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(ch, direction)}>
                    <Settings className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              <h3 className="mt-3 font-semibold">{ch.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{ch.desc}</p>
              {ch.config && <p className="mt-1 text-xs text-muted-foreground font-mono">{ch.config}</p>}
              <div className="mt-3 text-sm">
                <span className="text-muted-foreground">{direction === "in" ? "Přijato" : "Odesláno"}: </span>
                <span className="font-semibold">{ch.stats.toLocaleString("cs-CZ")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Doručovací kanály</h1>
        <p className="text-muted-foreground">
          Kanály pro příjem dokladů od klientů a zasílání reportů zpět
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Příjem dokladů</p><p className="text-2xl font-bold">{totalIn.toLocaleString("cs-CZ")}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Aktivní vstupní</p><p className="text-2xl font-bold text-emerald-600">{inbound.filter((c) => c.enabled).length}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Odesláno reportů</p><p className="text-2xl font-bold">{totalOut.toLocaleString("cs-CZ")}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-sm text-muted-foreground">Aktivní výstupní</p><p className="text-2xl font-bold text-emerald-600">{outbound.filter((c) => c.enabled).length}</p></CardContent></Card>
      </div>

      {/* Inbound */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowDown className="h-5 w-5 text-emerald-500" /> Příjem dokladů od klientů
        </h2>
        <ChannelGrid channels={inbound} direction="in" />
      </div>

      {/* Outbound */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowUp className="h-5 w-5 text-blue-500" /> Zasílání reportů klientům
        </h2>
        <ChannelGrid channels={outbound} direction="out" />
      </div>

      {/* Channel settings dialog */}
      <Dialog open={!!editChannel} onOpenChange={(open) => !open && setEditChannel(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nastavení: {editChannel?.name}</DialogTitle>
            <DialogDescription>{editChannel?.desc}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
            <div className="space-y-2">
              <Label>Konfigurace</Label>
              <Input value={configValue} onChange={(e) => setConfigValue(e.target.value)} placeholder="URL, email, kanál..." />
            </div>
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testStatus === "testing"}>
              {testStatus === "testing" ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testuji...</>
              ) : testStatus === "ok" ? (
                <><CheckCircle2 className="mr-2 h-4 w-4 text-emerald-600" /> Připojení OK</>
              ) : (
                "Otestovat připojení"
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditChannel(null)}>Zrušit</Button>
            <Button onClick={saveChannel}><Save className="mr-2 h-4 w-4" /> Uložit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
