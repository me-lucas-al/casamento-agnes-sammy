import { describe, expect, it } from "vitest";
import { parseSuggestionQuery } from "../schemas/suggestion-query-params";
import { buildActiveFilterChips } from "./active-filter-chips";

describe("buildActiveFilterChips", () => {
  it("returns no chips for the default query", () => {
    expect(buildActiveFilterChips(parseSuggestionQuery({}))).toEqual([]);
  });

  it("creates one chip per active filter with removal changes", () => {
    const chips = buildActiveFilterChips(
      parseSuggestionQuery({ q: "panela", loja: "kabum,amazon-br", categoria: "cozinha", precoMin: "50", precoMax: "150", modo: "cotas" }),
    );

    expect(chips.map((chip) => chip.id)).toEqual(["q", "categoria", "loja-kabum", "loja-amazon-br", "preco", "modo"]);
    expect(chips.find((chip) => chip.id === "loja-kabum")?.removal).toEqual({ loja: "amazon-br" });
    expect(chips.find((chip) => chip.id === "preco")?.removal).toEqual({ precoMin: null, precoMax: null });
  });

  it("clears the store param when the last store chip is removed", () => {
    const [chip] = buildActiveFilterChips(parseSuggestionQuery({ loja: "kabum" }));
    expect(chip.removal).toEqual({ loja: null });
  });
});
