export interface LoginAttemptRepository {
  countSince(ipHash: string, since: Date): Promise<number>;
  record(ipHash: string, at: Date): Promise<void>;
}
