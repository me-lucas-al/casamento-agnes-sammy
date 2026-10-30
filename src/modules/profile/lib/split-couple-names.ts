export function splitCoupleNames(coupleNames: string): [string, string] {
  const [first = coupleNames, second = ""] = coupleNames.split("&").map((name) => name.trim());
  return [first, second];
}
