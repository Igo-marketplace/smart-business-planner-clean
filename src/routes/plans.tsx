import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INDUSTRIES, usePlanner } from "@/store/planner";
import { FileText, Plus } from "lucide-react";

export const Route = createFileRoute("/plans")({
  head: () => ({ meta: [{ title: "Мои планы — Smart Business Planner" }] }),
  component: PlansPage,
});

function PlansPage() {
  const s = usePlanner();
  const hasPlan = !!(s.segment && s.industry);
  const industry = INDUSTRIES.find((i) => i.id === s.industry);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-surface py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Мои планы</h1>
              <p className="mt-1 text-muted-foreground">Все ваши бизнес-планы в одном месте</p>
            </div>
            <Button asChild><Link to="/wizard"><Plus className="mr-2 h-4 w-4" /> Новый план</Link></Button>
          </div>

          {!hasPlan ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <FileText className="h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-xl font-semibold">Пока нет планов</h2>
                <p className="mt-1 text-muted-foreground">Создайте первый бизнес-план — это займёт 15 минут</p>
                <Button asChild className="mt-6"><Link to="/wizard">Создать план</Link></Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="transition-all hover:shadow-[var(--shadow-card)]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{industry?.icon}</div>
                      <div>
                        <CardTitle>{industry?.label}</CardTitle>
                        <CardDescription>{s.city || "Россия"} · {s.segment === "small" ? "Малый" : "Средний"} бизнес</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary">Готов</Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button asChild variant="default" size="sm"><Link to="/results">Открыть</Link></Button>
                  <Button asChild variant="outline" size="sm"><Link to="/wizard">Изменить</Link></Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
