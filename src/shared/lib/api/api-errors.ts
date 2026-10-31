export type ApiErrorCode =
  | "invalid_input"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "conflict"
  | "rate_limited"
  | "unavailable"
  | "internal_error";

export type ApiErrorDescriptor = { status: number; code: ApiErrorCode; message: string };

export const API_ERRORS = {
  invalid_input: { status: 400, code: "invalid_input", message: "Dados inválidos." },
  unauthorized: { status: 401, code: "unauthorized", message: "Não autorizado." },
  forbidden: { status: 403, code: "forbidden", message: "Acesso negado." },
  not_found: { status: 404, code: "not_found", message: "Recurso não encontrado." },
  conflict: { status: 409, code: "conflict", message: "Conflito com o estado atual do recurso." },
  rate_limited: { status: 429, code: "rate_limited", message: "Muitas requisições. Tente novamente em instantes." },
  unavailable: { status: 503, code: "unavailable", message: "Serviço indisponível. Tente novamente em instantes." },
  internal_error: { status: 500, code: "internal_error", message: "Erro interno. Tente novamente em instantes." },
} as const satisfies Record<ApiErrorCode, ApiErrorDescriptor>;

export class ApiError extends Error {
  constructor(readonly code: ApiErrorCode) {
    super(API_ERRORS[code].message);
    this.name = "ApiError";
  }
}

export function apiErrorResponse(code: ApiErrorCode): Response {
  const { status, message } = API_ERRORS[code];
  return Response.json({ error: { code, message } }, { status });
}
