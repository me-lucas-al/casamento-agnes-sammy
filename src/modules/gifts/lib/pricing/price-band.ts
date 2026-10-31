export const PRICE_BAND_IDS = ["until-100", "100-300", "300-600", "600-plus"] as const;

export type PriceBandId = (typeof PRICE_BAND_IDS)[number];

export type PriceBand = {
  id: PriceBandId;
  label: string;
  minCentsExclusive: number | null;
  maxCentsInclusive: number | null;
};

export const PRICE_BANDS: readonly PriceBand[] = [
  { id: "until-100", label: "Até R$ 100", minCentsExclusive: null, maxCentsInclusive: 10000 },
  { id: "100-300", label: "R$ 100 a R$ 300", minCentsExclusive: 10000, maxCentsInclusive: 30000 },
  { id: "300-600", label: "R$ 300 a R$ 600", minCentsExclusive: 30000, maxCentsInclusive: 60000 },
  { id: "600-plus", label: "Acima de R$ 600", minCentsExclusive: 60000, maxCentsInclusive: null },
];

export function findPriceBand(bandId: string | undefined): PriceBand | undefined {
  return PRICE_BANDS.find((band) => band.id === bandId);
}

export function isPriceInBand(priceCents: number, band: PriceBand): boolean {
  const aboveMinimum = band.minCentsExclusive === null || priceCents > band.minCentsExclusive;
  const belowMaximum = band.maxCentsInclusive === null || priceCents <= band.maxCentsInclusive;
  return aboveMinimum && belowMaximum;
}
