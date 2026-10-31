import { describe, expect, it } from "vitest";
import { isAllowedImageUrl } from "@/shared/lib/images/image-host-rules";
import {
  formatPriceCheckedDate,
  hasTrackingParams,
  isAllowedProductUrl,
  storeNameForProductUrl,
} from "../product-link-rules";

describe("isAllowedProductUrl", () => {
  it("accepts https urls on allowed store hosts", () => {
    expect(isAllowedProductUrl("https://www.magazineluiza.com.br/p/abc/")).toBe(true);
    expect(isAllowedProductUrl("https://produto.mercadolivre.com.br/MLB-1")).toBe(true);
  });

  it("rejects http, unknown hosts, lookalikes and garbage", () => {
    expect(isAllowedProductUrl("http://www.magazineluiza.com.br/p/abc/")).toBe(false);
    expect(isAllowedProductUrl("https://www.shopee.com.br/x")).toBe(false);
    expect(isAllowedProductUrl("https://www.magazineluiza.com.br.evil.com/x")).toBe(false);
    expect(isAllowedProductUrl("https://magazineluiza.com.br/x")).toBe(false);
    expect(isAllowedProductUrl("not a url")).toBe(false);
  });
});

describe("hasTrackingParams", () => {
  it("detects tracking and affiliate params", () => {
    expect(hasTrackingParams("https://www.amazon.com.br/dp/B0?tag=x-20")).toBe(true);
    expect(hasTrackingParams("https://www.amazon.com.br/dp/B0?utm_source=a")).toBe(true);
    expect(hasTrackingParams("https://www.amazon.com.br/dp/B0")).toBe(false);
  });
});

describe("storeNameForProductUrl", () => {
  it("maps hosts to store names", () => {
    expect(storeNameForProductUrl("https://www.amazon.com.br/dp/B0")).toBe("Amazon");
    expect(storeNameForProductUrl("https://example.com/x")).toBeNull();
    expect(storeNameForProductUrl(null)).toBeNull();
  });
});

describe("formatPriceCheckedDate", () => {
  it("formats iso dates as dd/mm/yyyy", () => {
    expect(formatPriceCheckedDate("2026-11-01")).toBe("01/11/2026");
    expect(formatPriceCheckedDate(null)).toBeNull();
  });
});

describe("isAllowedImageUrl", () => {
  it("requires https and an allowed host", () => {
    expect(isAllowedImageUrl("https://cdn.example/a.jpg", ["cdn.example"])).toBe(true);
    expect(isAllowedImageUrl("http://cdn.example/a.jpg", ["cdn.example"])).toBe(false);
    expect(isAllowedImageUrl("https://other.example/a.jpg", ["cdn.example"])).toBe(false);
  });
});
