export type ConfirmTone = "default" | "destructive";

export type ConfirmOutcome = { ok: boolean; error?: string };

export type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  tone?: ConfirmTone;
  onConfirm: () => Promise<ConfirmOutcome>;
};

export type ConfirmDialogState =
  | { status: "closed"; request: ConfirmRequest | null }
  | { status: "open"; request: ConfirmRequest; error: string }
  | { status: "pending"; request: ConfirmRequest };

export type ConfirmDialogEvent =
  | { type: "open"; request: ConfirmRequest }
  | { type: "submit" }
  | { type: "succeed" }
  | { type: "fail"; error: string }
  | { type: "dismiss" };

export const initialConfirmDialogState: ConfirmDialogState = { status: "closed", request: null };

export const DEFAULT_CONFIRM_ERROR = "Não foi possível concluir a ação. Tente novamente.";

export function confirmDialogReducer(state: ConfirmDialogState, event: ConfirmDialogEvent): ConfirmDialogState {
  if (event.type === "open") return { status: "open", request: event.request, error: "" };
  if (!state.request) return state;
  if (event.type === "submit") {
    return state.status === "open" ? { status: "pending", request: state.request } : state;
  }
  if (event.type === "succeed") {
    return state.status === "pending" ? { status: "closed", request: state.request } : state;
  }
  if (event.type === "fail") {
    return state.status === "pending" ? { status: "open", request: state.request, error: event.error } : state;
  }
  return state.status === "open" ? { status: "closed", request: state.request } : state;
}
