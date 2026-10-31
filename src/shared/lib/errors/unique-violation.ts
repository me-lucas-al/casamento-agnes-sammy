const UNIQUE_VIOLATION_SQLSTATE = "23505";
const MAXIMUM_CAUSE_DEPTH = 3;

function readStringProperty(error: unknown, property: string): string | null {
  if (typeof error !== "object" || error === null) return null;
  const value = (error as Record<string, unknown>)[property];
  return typeof value === "string" ? value : null;
}

function matchesUniqueViolation(error: unknown, constraintName: string | undefined): boolean {
  if (readStringProperty(error, "code") !== UNIQUE_VIOLATION_SQLSTATE) return false;
  if (constraintName === undefined) return true;
  const violatedConstraint = readStringProperty(error, "constraint");
  return violatedConstraint === null || violatedConstraint === constraintName;
}

export function isUniqueViolation(error: unknown, constraintName?: string): boolean {
  let current: unknown = error;
  for (let depth = 0; depth <= MAXIMUM_CAUSE_DEPTH; depth += 1) {
    if (matchesUniqueViolation(current, constraintName)) return true;
    if (!(current instanceof Error) || current.cause === undefined) return false;
    current = current.cause;
  }
  return false;
}
