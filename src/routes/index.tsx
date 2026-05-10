import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, Building2, Landmark, ShieldCheck, FileSpreadsheet, FileText, BarChart3 } from "lucide-react";
import { INDUSTRIES } from "@/store/planner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Business Planner — AI бизнес-план для МСП" },
      { name: "description", content: "AI-бизнес-план для малого и среднего бизнеса за 15 минут. С учётом налогов РФ, отраслей и реальной аналитики." },
      { property: "og:title", content: "Smart Business Planner — AI бизнес-план для МСП" },
      { property: "og:description", content: "Готовый бизнес-план для банка, инвестора или гранта." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[image:var(--gradient-soft)]" aria-hidden />
          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="secondary" className="mb-6">Платформа №1 для бизнес-планирования в РФ</Badge>
              <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
                AI-бизнес-план для малого и среднего бизнеса <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">за 15 минут</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                С учётом налогов РФ, отраслевых макетов и реальной аналитики из ФНС, банков и Яндекса
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" className="bg-[image:var(--gradient-hero)] shadow-[var(--shadow-elegant)] hover:opacity-95">
                  <Link to="/wizard">Создать бизнес-план <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/pricing">Посмотреть тарифы</Link>
                </Button>
              </div>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Landmark className="h-4 w-4" /> Интеграция с ФНС</span>
                <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Альфа-Банк, Т-Банк, Сбер</span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Центры «Мой бизнес»</span>
              </div>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Отраслевые макеты</h2>
            <p className="mt-3 text-muted-foreground">
              Каждая отрасль — своя структура плана и финансовая модель
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            {INDUSTRIES.map((i) => (
              <Card key={i.id} className="transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-card)]">
                <CardContent className="p-6 text-center">
                  <div className="mb-3 text-4xl">{i.icon}</div>
                  <h3 className="font-semibold">{i.label}</h3>
                  <p className="mt-2 text-xs text-muted-foreground">{i.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Outputs */}
        <section className="bg-surface py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold md:text-4xl">Что вы получаете</h2>
              <p className="mt-3 text-muted-foreground">Готовые документы для банка, инвестора или гранта</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: FileText, title: "PDF для банка", desc: "Резюме, рынок, операционка, P&L, CF, баланс, точка безубыточности и риски" },
                { icon: FileSpreadsheet, title: "Excel-модель", desc: "Полная финансовая модель с возможностью редактирования и сценариев" },
                { icon: BarChart3, title: "JSON для API", desc: "Структурированные данные для интеграции с CRM и системами банка" },
              ].map((o) => (
                <Card key={o.title} className="border-2">
                  <CardHeader>
                    <div className="mb-2 grid h-12 w-12 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <o.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{o.title}</CardTitle>
                    <CardDescription>{o.desc}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing preview */}
        <section className="container mx-auto px-4 py-20">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Прозрачные тарифы</h2>
            <p className="mt-3 text-muted-foreground">Начните бесплатно, масштабируйтесь по мере роста</p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            <PricingCard name="Бесплатно" price="0 ₽" features={["1 бизнес-план", "PDF без брендинга", "Базовая аналитика"]} />
            <PricingCard
              name="Профессиональный"
              price="1 990 ₽"
              suffix="/мес"
              highlight
              features={["Все отрасли", "Excel и PDF без ограничений", "API-ключи ФНС, Яндекс", "Аналитика по региону"]}
            />
            <PricingCard name="Корпоративный" price="По запросу" features={["Для банков и акселераторов", "Белая метка", "SLA и поддержка", "On-premise развёртывание"]} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PricingCard({ name, price, suffix, features, highlight }: { name: string; price: string; suffix?: string; features: string[]; highlight?: boolean }) {
  return (
    <Card className={highlight ? "relative border-primary shadow-[var(--shadow-elegant)]" : ""}>
      {highlight && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Популярный</Badge>}
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price}</span>
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {features.map((f) => (
          <div key={f} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
            <span>{f}</span>
          </div>
        ))}
        <Button asChild className="mt-4 w-full" variant={highlight ? "default" : "outline"}>
          <Link to="/wizard">Выбрать</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
