"use client";

import { useState } from "react";
import { useVisualStyle, visualStyles } from "./style-switcher";
import { Palette, Check } from "lucide-react";

export function StylePicker() {
  const { style, setStyle } = useVisualStyle();
  const [open, setOpen] = useState(false);
  const current = visualStyles.find((s) => s.id === style);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        title="Vizuální styl"
      >
        <div className={`h-4 w-4 rounded-full ${current?.preview} shadow-inner border border-black/10`} />
        <span className="hidden lg:inline text-muted-foreground">{current?.name}</span>
        <Palette className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border bg-card shadow-xl overflow-hidden">
            <div className="border-b px-3 py-2.5">
              <p className="text-xs font-semibold">Vizuální styl</p>
              <p className="text-[10px] text-muted-foreground">Vyberte vzhled aplikace</p>
            </div>
            <div className="p-1.5 max-h-80 overflow-y-auto">
              {visualStyles.map((vs) => {
                const isActive = style === vs.id;
                return (
                  <button
                    key={vs.id}
                    onClick={() => { setStyle(vs.id); setOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      isActive ? "bg-primary/10" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className={`h-6 w-6 shrink-0 rounded-lg ${vs.preview} shadow-inner border border-black/10`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium ${isActive ? "text-primary" : ""}`}>{vs.name}</p>
                      <p className="text-[10px] text-muted-foreground">{vs.desc}</p>
                    </div>
                    {isActive && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
