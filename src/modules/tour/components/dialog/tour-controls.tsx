"use client";

import { createContext, useContext } from "react";

type TourControls = { closeTour: () => void };

const TourControlsContext = createContext<TourControls>({ closeTour: () => undefined });

export const TourControlsProvider = TourControlsContext.Provider;

export function useTourControls(): TourControls {
  return useContext(TourControlsContext);
}
