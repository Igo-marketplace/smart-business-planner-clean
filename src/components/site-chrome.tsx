import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  const navLinkCls = "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-elegant)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-bold">Smart Business Planner</span>
            <span className="text-[11px] text-muted-foreground">Бизнес-план за 15 минут</span>
          </div>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className={navLinkCls} activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Главная</Link>
          <Link to="/plans" className={navLinkCls} activeProps={{ className: "text-foreground" }}>Мои планы</Link>
          <Link to="/profile" className={navLinkCls} activeProps={{ className: "text-foreground" }}>API-ключи</Link>
          <Link to="/pricing" className={navLinkCls} activeProps={{ className: "text-foreground" }}>Тарифы</Link>
        </nav>
        <Link
          to="/wizard"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Создать план
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <p className="text-sm text-muted-foreground">
          © 2026 Smart Business Planner. Сделано для российского бизнеса.
        </p>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">О проекте</a>
          <a href="#" className="hover:text-foreground transition-colors">Контакты</a>
          <a href="#" className="hover:text-foreground transition-colors">Пользовательское соглашение</a>
        </nav>
      </div>
    </footer>
  );
}
