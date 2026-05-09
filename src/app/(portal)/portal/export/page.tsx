"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, Table, FileSpreadsheet, CheckCircle2 } from "lucide-react";

const exports = [
  {
    category: "Účetní výkazy",
    items: [
      { name: "Výsledovka (VZZ)", formats: ["PDF", "XLSX"], period: "Q1 2024", ready: true },
      { name: "Rozvaha", formats: ["PDF", "XLSX"], period: "Q1 2024", ready: true },
      { name: "Cash Flow přehled", formats: ["PDF", "XLSX"], period: "Březen 2024", ready: true },
      { name: "Obratová předvaha", formats: ["PDF", "XLSX", "CSV"], period: "Březen 2024", ready: true },
    ],
  },
  {
    category: "Daňové podklady",
    items: [
      { name: "DPH přiznání", formats: ["PDF", "XML"], period: "Q1 2024", ready: true },
      { name: "Kontrolní hlášení", formats: ["PDF", "XML"], period: "Q1 2024", ready: true },
      { name: "Souhrnné hlášení", formats: ["PDF", "XML"], period: "Q1 2024", ready: false },
    ],
  },
  {
    category: "Přehledy faktur",
    items: [
      { name: "Faktury vydané", formats: ["PDF", "XLSX", "CSV", "ISDOC"], period: "Březen 2024", ready: true },
      { name: "Faktury přijaté", formats: ["PDF", "XLSX", "CSV"], period: "Březen 2024", ready: true },
      { name: "Přehled pohledávek", formats: ["PDF", "XLSX"], period: "Aktuální", ready: true },
      { name: "Přehled závazků", formats: ["PDF", "XLSX"], period: "Aktuální", ready: true },
    ],
  },
  {
    category: "Bankovní a pokladní",
    items: [
      { name: "Bankovní pohyby", formats: ["PDF", "XLSX", "CSV"], period: "Březen 2024", ready: true },
      { name: "Pokladní kniha", formats: ["PDF", "XLSX"], period: "Březen 2024", ready: true },
    ],
  },
];

const formatIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  XLSX: FileSpreadsheet,
  CSV: Table,
  XML: FileText,
  ISDOC: FileText,
};

function triggerDownload(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportPage() {
  const [downloaded, setDownloaded] = useState<Set<string>>(new Set());

  function handleDownload(name: string, format: string) {
    const key = `${name}-${format}`;
    const ext = format.toLowerCase();
    const filename = `${name.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.${ext}`;
    const content = `[Demo export] ${name}\nFormát: ${format}\nPerioda: ${new Date().toLocaleDateString("cs-CZ")}\n\nTento soubor je demo export z portálu Fedic Finance.\nV produkčním prostředí bude vygenerován skutečný ${format} dokument z dat v Abra Flexi.`;

    triggerDownload(filename, content);
    setDownloaded((prev) => new Set(prev).add(key));
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export dat</h1>
        <p className="text-muted-foreground">
          Stáhněte si účetní výkazy a přehledy v různých formátech
        </p>
      </div>

      {exports.map((section) => (
        <div key={section.category}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            {section.category}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.items.map((item) => (
              <Card key={item.name} className={`transition-shadow hover:shadow-md ${!item.ready ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.period}</p>
                    </div>
                    {item.ready ? (
                      <Badge>Připraveno</Badge>
                    ) : (
                      <Badge variant="secondary">Připravuje se</Badge>
                    )}
                  </div>
                  {item.ready && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.formats.map((fmt) => {
                        const Icon = formatIcons[fmt] || FileText;
                        const key = `${item.name}-${fmt}`;
                        const wasDownloaded = downloaded.has(key);
                        return (
                          <Button
                            key={fmt}
                            variant={wasDownloaded ? "default" : "outline"}
                            size="sm"
                            className="gap-1.5"
                            onClick={() => handleDownload(item.name, fmt)}
                          >
                            {wasDownloaded ? (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            ) : (
                              <Icon className="h-3.5 w-3.5" />
                            )}
                            {fmt}
                            <Download className="h-3 w-3 ml-1" />
                          </Button>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
