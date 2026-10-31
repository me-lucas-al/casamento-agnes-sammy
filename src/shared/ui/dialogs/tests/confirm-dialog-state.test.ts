import { describe, expect, it } from "vitest";
import {
  confirmDialogReducer,
  initialConfirmDialogState,
  type ConfirmRequest,
} from "../confirm-dialog-state";

const request: ConfirmRequest = {
  title: "Excluir Maria?",
  description: "Essa ação não pode ser desfeita.",
  confirmLabel: "Excluir",
  onConfirm: async () => ({ ok: true }),
};

const opened = confirmDialogReducer(initialConfirmDialogState, { type: "open", request });

describe("confirmDialogReducer", () => {
  it("opens with the request and no error", () => {
    expect(opened).toEqual({ status: "open", request, error: "" });
  });

  it("moves to pending on submit", () => {
    expect(confirmDialogReducer(opened, { type: "submit" }).status).toBe("pending");
  });

  it("ignores dismiss while pending", () => {
    const pending = confirmDialogReducer(opened, { type: "submit" });
    expect(confirmDialogReducer(pending, { type: "dismiss" })).toBe(pending);
  });

  it("returns to open with the error on failure", () => {
    const pending = confirmDialogReducer(opened, { type: "submit" });
    expect(confirmDialogReducer(pending, { type: "fail", error: "Erro" })).toEqual({
      status: "open",
      request,
      error: "Erro",
    });
  });

  it("closes on dismiss when open", () => {
    expect(confirmDialogReducer(opened, { type: "dismiss" }).status).toBe("closed");
  });

  it("ignores events while closed", () => {
    expect(confirmDialogReducer(initialConfirmDialogState, { type: "submit" })).toBe(initialConfirmDialogState);
  });

  it("closes after success", () => {
    const pending = confirmDialogReducer(opened, { type: "submit" });
    expect(confirmDialogReducer(pending, { type: "succeed" }).status).toBe("closed");
  });
});
