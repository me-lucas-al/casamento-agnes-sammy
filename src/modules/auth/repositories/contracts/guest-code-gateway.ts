export type GuestIdentity = {
  id: string;
  name: string;
};

export interface GuestCodeGateway {
  findByCode(code: string): Promise<GuestIdentity | null>;
  markAccess(guestId: string, accessedAt: Date): Promise<void>;
}
