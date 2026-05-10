import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { usePlanner } from "@/store/planner";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/generate")({
  head: () => ({ meta: [{ title: "Генерация — Smart Business Planner" }] }),
  component: GeneratePage,
});

const STEPS = [
  "Анализируем отрасль и регион...",
  "Загружаем макроданные Росстата...",
  "Считаем точку безубыточности и налоги РФ...",
  "Формируем P&L, Cash Flow и баланс...",
  "Оцениваем риски и собираем PDF...",
];

function GeneratePage() {
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const navigate = useNavigate();
  const planner = usePlanner();

  useEffect(() => {
    if (!planner.segment || !planner.industry) {
      navigate({ to: "/wizard" });
      return;
    }
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + 4);
        setStepIdx(Math.min(STEPS.length - 1, Math.floor((next / 100) * STEPS.length)));
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate({ to: "/results" }), 400);
        }
        return next;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [navigate, planner.segment, planner.industry]);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-surface">
        <div className="container mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-12">
          <Card className="w-full">
            <CardContent className="space-y-8 p-8 md:p-12">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)]">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
                <h1 className="text-2xl font-bold">Создаём ваш бизнес-план</h1>
                <p className="mt-2 text-sm text-muted-foreground">Это займёт до 30 секунд</p>
              </div>
              <Progress value={progress} />
              <div className="space-y-2">
                {STEPS.map((s, i) => (
                  <div key={s} className={`flex items-center gap-3 text-sm transition-opacity ${i <= stepIdx ? "opacity-100" : "opacity-40"}`}>
                    <span className={`h-2 w-2 rounded-full ${i < stepIdx ? "bg-success" : i === stepIdx ? "bg-primary animate-pulse" : "bg-muted-foreground/40"}`} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Не закрывайте страницу. Если что-то пойдёт не так — <Link to="/wizard" className="underline">вернуться к настройкам</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
