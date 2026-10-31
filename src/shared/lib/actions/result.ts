export type ActionSuccess<Value> = { ok: true; data: Value };
export type ActionFailure = { ok: false; error: string };
export type ActionResult<Value = undefined> = ActionSuccess<Value> | ActionFailure;

export function success(): ActionSuccess<undefined>;
export function success<Value>(data: Value): ActionSuccess<Value>;
export function success<Value>(data?: Value) {
  return { ok: true as const, data };
}

export function failure(error: string): ActionFailure {
  return { ok: false, error };
}
