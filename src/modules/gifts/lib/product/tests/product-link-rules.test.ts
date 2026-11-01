import { describe, expect, it } from "vitest";
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

describe("isAllowedProductUrl hostile urls", () => {
  it.each([
    "https://user:x@www.amazon.com.br/x",
    "https://www.amazon.com.br:8443/x",
    "https://www.amazon.com.br@evil.com",
    "https://www.amazon.com.br.evil.com/x",
    "javascript:alert(1)",
    "data:text/html,<script>1</script>",
    "http://www.amazon.com.br/x",
  ])("rejects %s", (url) => {
    expect(isAllowedProductUrl(url)).toBe(false);
  });

  it("keeps accepting the default https port written explicitly", () => {
    expect(isAllowedProductUrl("https://www.amazon.com.br:443/x")).toBe(true);
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
