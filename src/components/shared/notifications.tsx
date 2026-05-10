"use client";

import { useState } from "react";
import { Bell, X, FileText, Send, LogIn, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const initialNotifications = [
  { id: 1, text: "Nová faktura FV-2024/009 vytvořena", time: "před 5 min", icon: FileText, read: false },
  { id: 2, text: "Úhrada 125 000 Kč přijata od ABC Systems", time: "před 30 min", icon: Send, read: false },
  { id: 3, text: "Tomáš Mertin se přihlásil do portálu", time: "před 1 hod", icon: LogIn, read: false },
  { id: 4, text: "Měsíční reporty odeslány (6 klientů)", time: "před 2 hod", icon: Send, read: true },
  { id: 5, text: "Aktivován kanál QR platba", time: "včera", icon: Settings, read: true },
];

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismiss(id: number) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-muted"
      >
        <Bell className="h-4.5 w-4.5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border bg-card shadow-xl overflow-hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Notifikace</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-primary hover:underline">
                  Označit vše přečtené
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${!n.read ? "bg-primary/5" : ""}`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <n.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${!n.read ? "font-medium" : "text-muted-foreground"}`}>{n.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                  <button onClick={() => dismiss(n.id)} className="shrink-0 text-muted-foreground hover:text-foreground">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )) : (
                <p className="px-4 py-8 text-center text-xs text-muted-foreground">Žádné notifikace</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
