export class TimeoutError extends Error {
  constructor(timeoutMilliseconds: number) {
    super(`Operation timed out after ${timeoutMilliseconds}ms`);
    this.name = "TimeoutError";
  }
}

export function withTimeout<Result>(operation: Promise<Result>, timeoutMilliseconds: number): Promise<Result> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new TimeoutError(timeoutMilliseconds)), timeoutMilliseconds);
  });
  return Promise.race([operation, timeout]).finally(() => clearTimeout(timer));
}
