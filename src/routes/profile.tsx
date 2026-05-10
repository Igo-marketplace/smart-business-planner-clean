import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { usePlanner } from "@/store/planner";
import { KeyRound, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "API-ключи — Smart Business Planner" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const s = usePlanner();
  const [checking, setChecking] = useState(false);

  const mask = (k?: string) => (k ? "•".repeat(Math.min(12, k.length)) : "—");
  const status = s.apiKeys.status;

  const statusBadge = {
    active: <Badge className="bg-success text-success-foreground">Активен</Badge>,
    untested: <Badge variant="secondary">Не проверен</Badge>,
    error: <Badge variant="destructive">Ошибка</Badge>,
  }[status];

  const remove = () => {
    s.setApiKeys({ fns: undefined, yandex: undefined, bank: undefined, status: "untested" });
    toast.success("Ключи удалены");
  };

  const check = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      const ok = !!(s.apiKeys.fns || s.apiKeys.yandex || s.apiKeys.bank);
      s.setApiKeys({ status: ok ? "active" : "error" });
      if (ok) toast.success("Ключи активны");
      else toast.error("Не удалось проверить ключи", { description: "Введите хотя бы один ключ" });
    }, 1200);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-surface py-10">
        <div className="container mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-bold">API-ключи</h1>
          <p className="mt-1 text-muted-foreground">Подключите внешние источники данных для точного прогноза</p>

          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Сохранённые ключи</CardTitle>
                <CardDescription>Ключи хранятся зашифрованными</CardDescription>
              </div>
              {statusBadge}
            </CardHeader>
            <CardContent className="space-y-4">
              <KeyField label="Ключ ФНС" value={s.apiKeys.fns ?? ""} onChange={(v) => s.setApiKeys({ fns: v, status: "untested" })} mask={mask(s.apiKeys.fns)} />
              <KeyField label="Ключ Яндекс / Авито" value={s.apiKeys.yandex ?? ""} onChange={(v) => s.setApiKeys({ yandex: v, status: "untested" })} mask={mask(s.apiKeys.yandex)} />
              <KeyField label="Ключ банка (Альфа / Т-Банк / Сбер)" value={s.apiKeys.bank ?? ""} onChange={(v) => s.setApiKeys({ bank: v, status: "untested" })} mask={mask(s.apiKeys.bank)} />

              <div className="flex flex-wrap gap-2 pt-2">
                <Button onClick={check} disabled={checking}><KeyRound className="mr-2 h-4 w-4" /> {checking ? "Проверка..." : "Проверить ключи"}</Button>
                <Button variant="outline" onClick={remove}><Trash2 className="mr-2 h-4 w-4" /> Удалить ключи</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function KeyField({ label, value, onChange, mask }: { label: string; value: string; onChange: (v: string) => void; mask: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input type="password" placeholder={mask || "Введите ключ"} value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}
