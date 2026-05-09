"use client";

import { useState, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function doLogin(username: string, password: string) {
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Nesprávné přihlašovací údaje");
    } else {
      router.push(username === "Radek" ? "/dashboard" : "/portal");
      router.refresh();
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await doLogin(formData.get("username") as string, formData.get("password") as string);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[oklch(0.18_0.04_255)] to-[oklch(0.25_0.06_260)] p-4">
      <Card className="w-full max-w-md border-0 shadow-2xl">
        <CardHeader className="space-y-3 text-center">
          <Image src="/logo.jpg" alt="Fedic Finance" width={64} height={64} className="mx-auto rounded-xl shadow-md" />
          <CardTitle className="text-2xl">Klientská zóna</CardTitle>
          <CardDescription>Přihlaste se do účetního portálu Fedic Finance</CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Uživatel</Label>
              <Input
                id="username"
                name="username"
                placeholder="Jméno"
                required
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Heslo</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Heslo"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Přihlašuji..." : "Přihlásit se"}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Demo přístupy</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                disabled={loading}
                onClick={() => doLogin("Tomáš", "Mertin")}
                className="flex items-center gap-2 rounded-lg border p-3 text-left text-xs transition-colors hover:bg-muted disabled:opacity-50"
              >
                <User className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-semibold">Klient</p>
                  <p className="text-muted-foreground">Tomáš / Mertin</p>
                </div>
              </button>
              <button
                disabled={loading}
                onClick={() => doLogin("Radek", "Fedič")}
                className="flex items-center gap-2 rounded-lg border p-3 text-left text-xs transition-colors hover:bg-muted disabled:opacity-50"
              >
                <Shield className="h-4 w-4 text-accent" />
                <div>
                  <p className="font-semibold">Administrátor</p>
                  <p className="text-muted-foreground">Radek / Fedič</p>
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
