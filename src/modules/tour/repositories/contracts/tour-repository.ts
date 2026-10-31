export interface TourRepository {
  findCompletedAt(userId: string): Promise<{ completedAt: Date | null } | null>;
  saveCompletedAt(userId: string, completedAt: Date | null): Promise<boolean>;
}
