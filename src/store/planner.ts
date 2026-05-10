import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Segment = "small" | "medium";
export type Industry = "manufacturing" | "logistics" | "agriculture" | "retail" | "services";
export type TaxSystem = "USN" | "Patent" | "OSN" | "auto";

export const INDUSTRIES: { id: Industry; label: string; icon: string; desc: string }[] = [
  { id: "manufacturing", label: "Производство", icon: "🏭", desc: "Себестоимость, загрузка оборудования, амортизация" },
  { id: "logistics", label: "Логистика", icon: "🚚", desc: "Маржа рейса, топливо, амортизация транспорта" },
  { id: "agriculture", label: "Сельское хозяйство", icon: "🌾", desc: "Сезонность, субсидии, цикл урожая" },
  { id: "retail", label: "Торговля", icon: "🛒", desc: "Оборачиваемость запасов, эффективность полки" },
  { id: "services", label: "Услуги", icon: "💼", desc: "Человеко-часы, загрузка специалистов" },
];

export interface ApiKeys {
  fns?: string;
  yandex?: string;
  bank?: string;
  status: "untested" | "active" | "error";
}

export interface PlannerState {
  segment: Segment | null;
  industry: Industry | null;
  budget: number;
  city: string;
  taxSystem: TaxSystem;
  monthlyRevenue: number | null;
  apiKeys: ApiKeys;
  setField: <K extends keyof PlannerState>(k: K, v: PlannerState[K]) => void;
  setApiKeys: (k: Partial<ApiKeys>) => void;
  reset: () => void;
}

const initial = {
  segment: null,
  industry: null,
  budget: 1000000,
  city: "",
  taxSystem: "auto" as TaxSystem,
  monthlyRevenue: null,
  apiKeys: { status: "untested" as const },
};

export const usePlanner = create<PlannerState>()(
  persist(
    (set) => ({
      ...initial,
      setField: (k, v) => set({ [k]: v } as never),
      setApiKeys: (k) => set((s) => ({ apiKeys: { ...s.apiKeys, ...k } })),
      reset: () => set(initial),
    }),
    { name: "smart-planner-store" }
  )
);
