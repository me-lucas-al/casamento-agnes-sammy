"use client";

import { useCallback, useReducer } from "react";
import {
  confirmDialogReducer,
  DEFAULT_CONFIRM_ERROR,
  initialConfirmDialogState,
  type ConfirmRequest,
} from "./lib/confirm-dialog-state";

export function useConfirmDialog() {
  const [state, dispatch] = useReducer(confirmDialogReducer, initialConfirmDialogState);

  const ask = useCallback((request: ConfirmRequest) => dispatch({ type: "open", request }), []);
  const cancel = useCallback(() => dispatch({ type: "dismiss" }), []);

  const confirm = useCallback(async () => {
    if (state.status !== "open") return;
    dispatch({ type: "submit" });
    const outcome = await state.request.onConfirm().catch(() => ({ ok: false, error: DEFAULT_CONFIRM_ERROR }));
    if (outcome.ok) return dispatch({ type: "succeed" });
    dispatch({ type: "fail", error: outcome.error ?? DEFAULT_CONFIRM_ERROR });
  }, [state]);

  return { ask, dialogProps: { state, onConfirm: confirm, onCancel: cancel } };
}
