"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useVisualStyle, visualStyles, type VisualStyleId } from "@/components/shared/style-switcher";
import { CheckCircle2, Palette, User, Save, Moon, Sun } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ProfilPage() {
  const { style, setStyle } = useVisualStyle();
  const [name, setName] = useState("Radek Fedič");
  const [email, setEmail] = useState("radek@fedicfinance.com");
  const [saved, setSaved] = useState(false);

  function saveProfile() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    toast.success("Profil uložen");
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Můj profil</h1>
        <p className="text-muted-foreground">Osobní údaje a vizuální nastavení</p>
      </div>

      {/* User info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Osobní údaje</CardTitle>
              <CardDescription>Vaše přihlašovací a kontaktní informace</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jméno</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value="Administrátor" readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Heslo</Label>
              <Input value="••••••••" type="password" readOnly className="bg-muted" />
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={saveProfile}>
            <Save className="mr-2 h-4 w-4" /> Uložit změny
          </Button>
        </CardContent>
      </Card>

      {/* Theme gallery */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">Vizuální styl</CardTitle>
              <CardDescription>Vyberte si vzhled aplikace. Změna se projeví okamžitě.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visualStyles.map((vs) => {
              const isActive = style === vs.id;
              return (
                <motion.button
                  key={vs.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStyle(vs.id)}
                  className={`group relative overflow-hidden rounded-xl border-2 text-left transition-all ${
                    isActive
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-transparent hover:border-muted-foreground/20"
                  }`}
                >
                  {/* Preview area */}
                  <div className={`h-24 ${vs.preview} relative`}>
                    {/* Fake UI elements */}
                    <div className="absolute inset-3 flex gap-2">
                      <div className="w-12 rounded bg-white/20 backdrop-blur-sm" />
                      <div className="flex-1 space-y-2 pt-2">
                        <div className="h-2 w-3/4 rounded bg-white/30" />
                        <div className="h-2 w-1/2 rounded bg-white/20" />
                        <div className="flex gap-1 mt-3">
                          <div className="h-4 w-8 rounded bg-white/25" />
                          <div className="h-4 w-8 rounded bg-white/15" />
                          <div className="h-4 w-8 rounded bg-white/15" />
                        </div>
                      </div>
                    </div>
                    {isActive && (
                      <div className="absolute top-2 right-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <div className="bg-card p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{vs.name}</p>
                        <p className="text-xs text-muted-foreground">{vs.desc}</p>
                      </div>
                      {isActive && (
                        <Badge className="text-[10px]">Aktivní</Badge>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
