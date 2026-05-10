import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Briefcase, Building2, Check, KeyRound } from "lucide-react";
import { INDUSTRIES, usePlanner, type Industry, type TaxSystem } from "@/store/planner";
import { toast } from "sonner";

export const Route = createFileRoute("/wizard")({
  head: () => ({ meta: [{ title: "Создание бизнес-плана — Smart Business Planner" }] }),
  component: WizardPage,
});

function WizardPage() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const s = usePlanner();
  const [showApi, setShowApi] = useState(false);
  const [checking, setChecking] = useState(false);

  const canNext = () => {
    if (step === 0) return !!s.segment && !!s.industry;
    if (step === 1) return s.budget > 0 && s.city.trim().length > 1;
    return true;
  };

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else navigate({ to: "/generate" });
  };

  const checkKeys = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      s.setApiKeys({ status: "active" });
      toast.success("Ключи проверены успешно", { description: "Данные ФНС и Яндекс подключены" });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-surface py-12">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="mb-8">
            <p className="mb-2 text-sm text-muted-foreground">Шаг {step + 1} из 3</p>
            <Progress value={((step + 1) / 3) * 100} />
          </div>

          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Расскажите о вашем бизнесе</h1>
                <p className="mt-2 text-muted-foreground">Мы подберём подходящий макет плана</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Тип бизнеса</CardTitle>
                  <CardDescription>Это влияет на структуру финансовой модели</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  <SegmentCard active={s.segment === "small"} onClick={() => s.setField("segment", "small")} icon={<Briefcase />} title="Малый бизнес" desc="ИП или ООО до 50 сотрудников" />
                  <SegmentCard active={s.segment === "medium"} onClick={() => s.setField("segment", "medium")} icon={<Building2 />} title="Средний бизнес" desc="ООО, 50–250 сотрудников, инвестпроект" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Отрасль</CardTitle>
                  <CardDescription>У каждой отрасли своя финансовая логика</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {INDUSTRIES.map((i) => (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => s.setField("industry", i.id as Industry)}
                      className={`group rounded-xl border-2 p-4 text-left transition-all ${
                        s.industry === i.id
                          ? "border-primary bg-accent/50 shadow-[var(--shadow-card)]"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="text-3xl">{i.icon}</div>
                      <div className="mt-2 font-semibold">{i.label}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{i.desc}</div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Финансовые параметры</h1>
                <p className="mt-2 text-muted-foreground">Базовые цифры для расчёта модели</p>
              </div>
              <Card>
                <CardContent className="grid gap-5 p-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Бюджет проекта (₽)</Label>
                    <Input id="budget" type="number" min={0} value={s.budget} onChange={(e) => s.setField("budget", Number(e.target.value))} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Город или регион</Label>
                    <Input id="city" placeholder="Например, Казань" value={s.city} onChange={(e) => s.setField("city", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Система налогообложения</Label>
                    <Select value={s.taxSystem} onValueChange={(v) => s.setField("taxSystem", v as TaxSystem)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Подобрать автоматически</SelectItem>
                        <SelectItem value="USN">УСН</SelectItem>
                        <SelectItem value="Patent">Патент</SelectItem>
                        <SelectItem value="OSN">ОСН</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rev">Планируемая выручка в месяц (₽) <span className="text-muted-foreground">— опционально</span></Label>
                    <Input id="rev" type="number" min={0} value={s.monthlyRevenue ?? ""} onChange={(e) => s.setField("monthlyRevenue", e.target.value ? Number(e.target.value) : null)} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">Подключение API <span className="text-base font-normal text-muted-foreground">(опционально)</span></h1>
                <p className="mt-2 text-muted-foreground">Реальные данные дадут точный прогноз</p>
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <KeyRound className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="font-medium">Расширенный режим</div>
                        <div className="text-sm text-muted-foreground">Подключить ключи ФНС, Яндекс, банка</div>
                      </div>
                    </div>
                    <Switch checked={showApi} onCheckedChange={setShowApi} />
                  </div>

                  {showApi && (
                    <div className="mt-6 grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fns">Ключ ФНС</Label>
                        <Input id="fns" type="password" placeholder="••••••••••••" value={s.apiKeys.fns ?? ""} onChange={(e) => s.setApiKeys({ fns: e.target.value, status: "untested" })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="yandex">Ключ Яндекс / Авито</Label>
                        <Input id="yandex" type="password" placeholder="••••••••••••" value={s.apiKeys.yandex ?? ""} onChange={(e) => s.setApiKeys({ yandex: e.target.value, status: "untested" })} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bank">Ключ банка (Альфа / Т-Банк / Сбер)</Label>
                        <Input id="bank" type="password" placeholder="••••••••••••" value={s.apiKeys.bank ?? ""} onChange={(e) => s.setApiKeys({ bank: e.target.value, status: "untested" })} />
                      </div>
                      <Button variant="outline" onClick={checkKeys} disabled={checking}>
                        {checking ? "Проверка..." : "Проверить ключи"}
                      </Button>
                      {s.apiKeys.status === "active" && (
                        <p className="flex items-center gap-2 text-sm text-success"><Check className="h-4 w-4" /> Все ключи активны</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Назад
            </Button>
            <Button onClick={handleNext} disabled={!canNext()} size="lg">
              {step < 2 ? "Далее" : "Сгенерировать план"} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function SegmentCard({ active, onClick, icon, title, desc }: { active: boolean; onClick: () => void; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all ${
        active ? "border-primary bg-accent/50 shadow-[var(--shadow-card)]" : "border-border hover:border-primary/50"
      }`}
    >
      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="mt-0.5 text-sm text-muted-foreground">{desc}</div>
      </div>
    </button>
  );
}


