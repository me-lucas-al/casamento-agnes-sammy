import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const cardsDirectory = join(process.cwd(), "src/modules/gifts/components/cards");

function productImageTag(fileName: string): string {
  const source = readFileSync(join(cardsDirectory, fileName), "utf8");
  return source.match(/<ProductImage[^>]*\/>/)?.[0] ?? "";
}

describe("gift card product image alt", () => {
  it("is decorative inside the card link because the heading names the gift", () => {
    expect(productImageTag("gift-card.tsx")).toContain('alt=""');
  });

  it("keeps a descriptive alt in the panel card", () => {
    expect(productImageTag("panel-gift-card.tsx")).toContain("alt={gift.name}");
  });
});
