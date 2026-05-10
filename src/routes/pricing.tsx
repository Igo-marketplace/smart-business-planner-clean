import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Тарифы — Smart Business Planner" }] }),
  component: PricingPage,
});

const PLANS = [
  { name: "Бесплатно", price: "0 ₽", suffix: "", features: ["1 бизнес-план", "PDF без брендинга", "Базовая аналитика", "Сохранение в облаке"] },
  { name: "Профессиональный", price: "1 990 ₽", suffix: "/мес", highlight: true, features: ["Все отрасли", "Excel и PDF без ограничений", "API-ключи ФНС, Яндекс, банков", "Аналитика по региону и городу", "Сценарный анализ", "Приоритетная поддержка"] },
  { name: "Корпоративный", price: "По запросу", suffix: "", features: ["Для банков и акселераторов", "Белая метка (white-label)", "SLA 99.9%", "On-premise развёртывание", "Интеграция с CRM банка", "Обучение команды"] },
];

function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h1 className="text-4xl font-bold md:text-5xl">Тарифы</h1>
            <p className="mt-3 text-muted-foreground">Начните бесплатно. Платите только за то, что нужно вашему бизнесу.</p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {PLANS.map((p) => (
              <Card key={p.name} className={p.highlight ? "relative border-primary shadow-[var(--shadow-elegant)]" : ""}>
                {p.highlight && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Популярный</Badge>}
                <CardHeader>
                  <CardTitle>{p.name}</CardTitle>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{p.price}</span>
                    {p.suffix && <span className="text-sm text-muted-foreground">{p.suffix}</span>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{f}</span>
                    </div>
                  ))}
                  <Button asChild className="mt-4 w-full" variant={p.highlight ? "default" : "outline"}>
                    <Link to="/wizard">Выбрать</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
