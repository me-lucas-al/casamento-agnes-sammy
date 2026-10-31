"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Role } from "@/modules/auth/types";
import { completeTourAction, restartTourAction } from "@/modules/tour/controllers/actions/tour.actions";
import { buildTourSteps } from "@/modules/tour/lib/build-tour-steps";
import { TourDialog } from "../dialog/tour-dialog";

type TourContextValue = { openTour: () => void };

const TourContext = createContext<TourContextValue>({ openTour: () => undefined });

export function useTour(): TourContextValue {
  return useContext(TourContext);
}

type TourProviderProps = { role: Role; shouldAutoOpen: boolean; children: ReactNode };

export function TourProvider({ role, shouldAutoOpen, children }: TourProviderProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const hasAutoOpenedRef = useRef(false);
  const steps = useMemo(() => buildTourSteps(role), [role]);

  useEffect(() => {
    if (!shouldAutoOpen || hasAutoOpenedRef.current || pathname !== "/painel") return;
    hasAutoOpenedRef.current = true;
    setIsOpen(true);
  }, [shouldAutoOpen, pathname]);

  const openTour = useCallback(() => {
    setIsOpen(true);
    void restartTourAction();
  }, []);

  const handleClosed = useCallback(() => {
    setIsOpen(false);
    void completeTourAction();
  }, []);

  const value = useMemo(() => ({ openTour }), [openTour]);
  return (
    <TourContext.Provider value={value}>
      {children}
      {isOpen && steps.length > 0 ? <TourDialog steps={steps} onClosed={handleClosed} /> : null}
    </TourContext.Provider>
  );
}
