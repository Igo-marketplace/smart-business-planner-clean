import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { INDUSTRIES, usePlanner } from "@/store/planner";
import { FileText, FileSpreadsheet, Code2, TrendingUp, AlertTriangle, Sparkles, Calculator } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/results")({
  head: () => ({ meta: [{ title: "Готовый план — Smart Business Planner" }] }),
  component: ResultsPage,
});

function fmtMoney(n: number) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(n);
}

function ResultsPage() {
  const s = usePlanner();
  const industry = INDUSTRIES.find((i) => i.id === s.industry);

  if (!s.segment || !s.industry) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <div className="container mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
            <h1 className="text-2xl font-bold">Нет готового плана</h1>
            <p className="mt-2 text-muted-foreground">Заполните анкету, чтобы сгенерировать бизнес-план.</p>
            <Button asChild className="mt-6"><Link to="/wizard">Начать</Link></Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Mock derived numbers
  const breakEvenMonth = s.segment === "small" ? 7 : 14;
  const irr = s.segment === "medium" ? "22,4%" : "—";
  const recommendedTax = s.segment === "small" ? (s.industry === "services" ? "Патент" : "УСН «Доходы минус расходы» 15%") : "ОСН";
  const monthly = s.monthlyRevenue ?? Math.round(s.budget * 0.18);
  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
  const seasonFactor = s.industry === "agriculture" ? [0.4,0.5,0.7,0.9,1.1,1.3,1.5,1.4,1.2,1.0,0.7,0.5] : [0.7,0.75,0.85,0.95,1.05,1.1,1.05,1.0,1.1,1.15,1.2,1.3];
  const revenue = seasonFactor.map((f) => Math.round(monthly * f));
  const maxRev = Math.max(...revenue);

  const risks = [
    { title: "Рост стоимости сырья", mitigation: "Диверсификация поставщиков, фьючерсные контракты" },
    { title: "Снижение спроса в регионе", mitigation: "Расширение каналов продаж, онлайн-присутствие" },
    { title: "Ужесточение регулирования", mitigation: "Консультации с юристом, мониторинг 219-ФЗ" },
  ];

  const downloadStub = (kind: string) => {
    if (kind === "JSON") {
      const data = JSON.stringify({ segment: s.segment, industry: s.industry, budget: s.budget, city: s.city, breakEvenMonth, irr, recommendedTax, revenue }, null, 2);
      navigator.clipboard.writeText(data).then(() => toast.success("JSON скопирован в буфер обмена"));
      return;
    }
    toast.message(`Скачивание ${kind}`, { description: "Доступно в платной версии — оформите тариф «Профессиональный»" });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-surface py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <Badge variant="secondary" className="mb-2"><Sparkles className="mr-1 h-3 w-3" /> Готов</Badge>
              <h1 className="text-3xl font-bold md:text-4xl">Ваш бизнес-план</h1>
              <p className="mt-1 text-muted-foreground">
                {industry?.icon} {industry?.label} · {s.segment === "small" ? "Малый бизнес" : "Средний бизнес"} · {s.city || "Россия"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => downloadStub("PDF")}><FileText className="mr-2 h-4 w-4" /> Скачать PDF (для банка)</Button>
              <Button variant="outline" onClick={() => downloadStub("Excel")}><FileSpreadsheet className="mr-2 h-4 w-4" /> Скачать Excel</Button>
              <Button variant="outline" onClick={() => downloadStub("JSON")}><Code2 className="mr-2 h-4 w-4" /> Копировать JSON</Button>
            </div>
          </div>

          {s.apiKeys.status === "active" && (
            <Alert className="mb-6 border-primary/30 bg-accent/50">
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Аналитика на основе ваших API-данных</AlertTitle>
              <AlertDescription>
                По данным ФНС для города «{s.city || "вашего региона"}»: средний чек на 15% ниже отраслевого бенчмарка. Прогноз выручки скорректирован.
              </AlertDescription>
            </Alert>
          )}

          {/* KPI grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <Kpi icon={<Calculator className="h-5 w-5" />} label="Точка безубыточности" value={`${breakEvenMonth} мес`} />
            <Kpi icon={<TrendingUp className="h-5 w-5" />} label="IRR" value={irr} hint={s.segment === "small" ? "Только для среднего" : undefined} />
            <Kpi icon={<FileText className="h-5 w-5" />} label="Рекомендуемая система налогообложения" value={recommendedTax} compact />
            <Kpi icon={<Calculator className="h-5 w-5" />} label="Бюджет проекта" value={fmtMoney(s.budget)} />
          </div>

          {/* Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Прогноз выручки по месяцам</CardTitle>
              <CardDescription>Учтена сезонность отрасли «{industry?.label}»</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-56 items-end gap-2">
                {revenue.map((v, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t bg-[image:var(--gradient-hero)] transition-all hover:opacity-80"
                      style={{ height: `${(v / maxRev) * 100}%` }}
                      title={fmtMoney(v)}
                    />
                    <span className="text-xs text-muted-foreground">{months[i]}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risks */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" /> Топ-3 риска</CardTitle>
              <CardDescription>С предложенными мерами снижения</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {risks.map((r, i) => (
                <div key={i} className="rounded-lg border border-border bg-background p-4">
                  <div className="flex items-start gap-3">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-warning/20 text-xs font-semibold text-warning-foreground">{i + 1}</div>
                    <div>
                      <div className="font-medium">{r.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground"><span className="font-medium text-foreground">Снижение:</span> {r.mitigation}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Kpi({ icon, label, value, hint, compact }: { icon: React.ReactNode; label: string; value: string; hint?: string; compact?: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-xs uppercase tracking-wide">{label}</span>
        </div>
        <div className={`mt-2 font-bold ${compact ? "text-base" : "text-2xl"}`}>{value}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </CardContent>
    </Card>
  );
}
