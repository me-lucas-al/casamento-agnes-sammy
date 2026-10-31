"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/shared/lib/styling/utils";

export type LoginTab = "convidado" | "noivos";

type LoginTabsProps = {
  initialTab: LoginTab;
  guestPanel: ReactNode;
  couplePanel: ReactNode;
};

const TABS: ReadonlyArray<{ id: LoginTab; label: string }> = [
  { id: "convidado", label: "Sou convidado(a)" },
  { id: "noivos", label: "Somos os noivos" },
];

export function LoginTabs({ initialTab, guestPanel, couplePanel }: LoginTabsProps) {
  const [activeTab, setActiveTab] = useState<LoginTab>(initialTab);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panels: Record<LoginTab, ReactNode> = { convidado: guestPanel, noivos: couplePanel };

  function moveTo(index: number) {
    const targetIndex = (index + TABS.length) % TABS.length;
    const target = TABS[targetIndex];
    if (!target) return;
    setActiveTab(target.id);
    tabRefs.current[targetIndex]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") moveTo(index + 1);
    else if (event.key === "ArrowLeft") moveTo(index - 1);
    else if (event.key === "Home") moveTo(0);
    else if (event.key === "End") moveTo(TABS.length - 1);
    else return;
    event.preventDefault();
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="Como você quer entrar" className="grid grid-cols-2 gap-1 rounded-full bg-blush p-1">
        {TABS.map((tab, index) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`login-tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`login-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={cn(
                "whitespace-nowrap rounded-full px-2 py-2 text-base font-semibold transition-colors",
                isActive ? "bg-rose text-white shadow-sm" : "text-wine hover:bg-white/60",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`login-panel-${tab.id}`}
          aria-labelledby={`login-tab-${tab.id}`}
          hidden={tab.id !== activeTab}
        >
          {panels[tab.id]}
        </div>
      ))}
    </div>
  );
}
