"use client";

import { useState, useRef, useCallback } from "react";
import { KpiCard } from "@/components/shared/kpi-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Wallet, TrendingUp, ArrowUpRight, Download, Upload,
  Mail, Camera, MessageSquare, Cloud, FolderUp, Send,
  BarChart3, Calendar, Bell, CheckCircle2, Loader2,
} from "lucide-react";
import { mockFakturyVydane, formatCZK, formatDate, getStatusLabel, getStatusVariant } from "@/lib/mock-data";

const myFaktury = mockFakturyVydane.slice(0, 5);
const neuhrazeno = myFaktury.filter((f) => f.stavUhrK !== "stavUhr.uhrazeno").reduce((s, f) => s + f.sumCelkem, 0);
const celkem = myFaktury.reduce((s, f) => s + f.sumCelkem, 0);

const uploadChannels = [
  { icon: Upload, name: "Drag & Drop", desc: "Přetáhněte soubory sem", active: true },
  { icon: Mail, name: "Email", desc: "doklady@fedicfinance.com", active: true },
  { icon: Camera, name: "Foto dokladu", desc: "Vyfotit mobilem", active: true },
  { icon: MessageSquare, name: "Slack", desc: "Kanál #doklady", active: true },
  { icon: Cloud, name: "Cloud", desc: "Google Drive, OneDrive", active: false },
  { icon: Send, name: "Datová schránka", desc: "Automatický příjem", active: false },
];

interface UploadedFile {
  name: string;
  date: string;
  status: "nahrávání" | "zpracovává se" | "zpracováno";
  type: string;
  size: string;
}

const initialUploads: UploadedFile[] = [
  { name: "faktura_2024_03_hotel.pdf", date: "17.04.2026 08:15", status: "zpracováno", type: "Faktura přijatá", size: "1.2 MB" },
  { name: "uctenka_benzin_340.jpg", date: "16.04.2026 14:30", status: "zpracovává se", type: "Účtenka", size: "3.4 MB" },
  { name: "smlouva_pronájem_kancelar.pdf", date: "15.04.2026 09:00", status: "zpracováno", type: "Smlouva", size: "890 KB" },
  { name: "faktura_adobe_creative.pdf", date: "14.04.2026 11:20", status: "zpracováno", type: "Faktura přijatá", size: "540 KB" },
  { name: "vypis_fio_03_2024.pdf", date: "12.04.2026 08:00", status: "zpracováno", type: "Bankovní výpis", size: "1.8 MB" },
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function generateReportCSV(): string {
  const header = "Kód;Popis;Datum vystavení;Datum splatnosti;Částka;Stav";
  const rows = myFaktury.map((f) =>
    `${f.kod};${f.popis};${f.datVyst};${f.datSplat};${f.sumCelkem};${getStatusLabel(f.stavUhrK)}`
  );
  return [header, ...rows].join("\n");
}

export default function PortalPage() {
  const [uploads, setUploads] = useState<UploadedFile[]>(initialUploads);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newFiles: UploadedFile[] = Array.from(files).map((f) => ({
      name: f.name,
      date: new Date().toLocaleString("cs-CZ", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      status: "nahrávání" as const,
      type: f.type.includes("image") ? "Účtenka" : "Doklad",
      size: formatFileSize(f.size),
    }));

    setUploads((prev) => [...newFiles, ...prev]);

    // Simulate processing
    setTimeout(() => {
      setUploads((prev) =>
        prev.map((u) => (u.status === "nahrávání" ? { ...u, status: "zpracovává se" } : u))
      );
      setUploading(false);
    }, 1500);

    setTimeout(() => {
      setUploads((prev) =>
        prev.map((u) => (u.status === "zpracovává se" ? { ...u, status: "zpracováno" } : u))
      );
    }, 4000);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  }

  function handleDownloadPDF(reportName: string) {
    triggerDownload(`${reportName.replace(/\s+/g, "_")}.txt`, `[Demo] ${reportName}\n\nTento soubor je demo export z portálu Fedic Finance.\nV produkčním prostředí bude vygenerován skutečný PDF dokument z dat v Abra Flexi.`);
  }

  function handleDownloadInvoicePDF(kod: string) {
    triggerDownload(`${kod}.txt`, `[Demo] Faktura ${kod}\n\nTento soubor je demo export.\nV produkčním prostředí bude vygenerován skutečný PDF z Abra Flexi.`);
  }

  function handleExportCSV() {
    triggerDownload("faktury_export.csv", generateReportCSV());
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dobrý den, Tomáši</h1>
        <p className="text-muted-foreground">Přehled vašeho účetnictví u Fedic Finance</p>
      </div>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-4">
        <KpiCard title="Obrat" value={formatCZK(celkem)} icon={TrendingUp} trend={{ value: "12%", positive: true }} description="oproti min. měsíci" />
        <KpiCard title="Pohledávky" value={formatCZK(neuhrazeno)} icon={Wallet} description="k úhradě" />
        <KpiCard title="Nahrané doklady" value={String(uploads.length)} icon={FolderUp} description="tento měsíc" />
        <KpiCard title="Zpracováno" value={String(uploads.filter((u) => u.status === "zpracováno").length)} icon={FileText} description={`${uploads.filter((u) => u.status !== "zpracováno").length} čekají`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upload zone */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Nahrát doklady</CardTitle>
            <CardDescription>Vyberte způsob, jakým chcete dodat podklady ke zpracování</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Drag & drop zone */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.xlsx,.csv"
              className="hidden"
              onChange={(e) => processFiles(e.target.files)}
            />
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`mb-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors cursor-pointer ${
                dragOver
                  ? "border-primary bg-primary/15 scale-[1.01]"
                  : "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10"
              }`}
            >
              {uploading ? (
                <Loader2 className="mb-3 h-10 w-10 text-primary animate-spin" />
              ) : (
                <Upload className="mb-3 h-10 w-10 text-primary/50" />
              )}
              <p className="font-medium">
                {dragOver ? "Pusťte soubory zde" : uploading ? "Nahrávání..." : "Přetáhněte soubory sem"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">nebo klikněte pro výběr (PDF, JPG, PNG, XLSX)</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                Vybrat soubory
              </Button>
            </div>

            {/* Other channels */}
            <p className="mb-3 text-sm font-medium text-muted-foreground">Další způsoby nahrání:</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {uploadChannels.slice(1).map((ch) => (
                <div
                  key={ch.name}
                  className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                    ch.active ? "hover:border-primary/30 hover:bg-muted/50 cursor-pointer" : "opacity-50"
                  }`}
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ch.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{ch.name}</p>
                    <p className="text-[11px] text-muted-foreground">{ch.desc}</p>
                  </div>
                  {!ch.active && <Badge variant="secondary" className="ml-auto text-[10px]">Brzy</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent uploads */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Poslední nahrané</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {uploads.slice(0, 6).map((doc, i) => (
              <div key={`${doc.name}-${i}`} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {doc.status === "nahrávání" ? (
                    <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />
                  ) : doc.status === "zpracováno" ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{doc.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {doc.type} &middot; {doc.size} &middot; {doc.date}
                  </p>
                  <Badge
                    variant={doc.status === "zpracováno" ? "default" : doc.status === "nahrávání" ? "destructive" : "secondary"}
                    className="mt-0.5 text-[10px]"
                  >
                    {doc.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Accounting overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Přehled účetnictví</CardTitle>
              <CardDescription>Výkazy zpracované vaším účetním</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Exportovat
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Výsledovka (VZZ)", period: "Q1 2024", ready: true },
              { label: "Rozvaha", period: "Q1 2024", ready: true },
              { label: "Cash Flow přehled", period: "Březen 2024", ready: true },
              { label: "DPH přiznání", period: "Q1 2024", ready: true },
              { label: "Přehled faktur vydaných", period: "Březen 2024", ready: true },
              { label: "Přehled faktur přijatých", period: "Březen 2024", ready: true },
              { label: "Mzdové náklady", period: "Březen 2024", ready: false },
              { label: "Přehled pohledávek", period: "Březen 2024", ready: true },
            ].map((report) => (
              <div
                key={report.label}
                className={`flex flex-col justify-between rounded-xl border p-4 transition-colors ${
                  report.ready ? "hover:border-primary/30 hover:bg-muted/50" : "opacity-60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    {report.ready ? (
                      <Badge className="text-[10px]">Hotovo</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">Připravuje se</Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium">{report.label}</p>
                  <p className="text-xs text-muted-foreground">{report.period}</p>
                </div>
                {report.ready && (
                  <Button variant="ghost" size="sm" className="mt-3 w-full justify-start" onClick={() => handleDownloadPDF(report.label)}>
                    <Download className="mr-2 h-3.5 w-3.5" />
                    Stáhnout PDF
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent invoices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vaše faktury</CardTitle>
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {myFaktury.map((f) => (
            <div key={f.id} className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{f.kod}</p>
                  <p className="text-xs text-muted-foreground">{f.popis} &middot; {formatDate(f.datVyst)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCZK(f.sumCelkem)}</p>
                  <Badge variant={getStatusVariant(f.stavUhrK)} className="text-xs">
                    {getStatusLabel(f.stavUhrK)}
                  </Badge>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Stáhnout PDF" onClick={() => handleDownloadInvoicePDF(f.kod)}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
