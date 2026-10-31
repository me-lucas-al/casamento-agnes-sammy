export interface LoginAttemptRepository {
  countSince(ipHash: string, since: Date): Promise<number>;
  record(ipHash: string, at: Date): Promise<void>;
  clearForIp(ipHash: string): Promise<void>;
  deleteOlderThan(threshold: Date): Promise<number>;
}
