const CLOUDINARY_DELIVERY_HOST = "res.cloudinary.com";
const MANAGED_ID_SUFFIX = "[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}";
const VERSION_SEGMENT = "(?:v\\d+/)?";
const FILE_EXTENSION = /\.[A-Za-z0-9]+$/;

export function buildManagedPublicId(folder: string): string {
  return `${folder}/${crypto.randomUUID()}`;
}

export function isManagedPublicId(folder: string, publicId: string): boolean {
  return new RegExp(`^${folder}/${MANAGED_ID_SUFFIX}$`).test(publicId);
}

function escapeForRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export type CloudinaryAssetReference = {
  url: string;
  publicId: string;
  cloudName: string;
};

export function urlReferencesCloudinaryAsset({ url, publicId, cloudName }: CloudinaryAssetReference): boolean {
  const parsed = URL.parse(url);
  if (!parsed) return false;
  if (parsed.protocol !== "https:" || parsed.hostname !== CLOUDINARY_DELIVERY_HOST) return false;
  if (parsed.port || parsed.username || parsed.password) return false;
  const deliveryPrefix = `/${cloudName}/image/upload/`;
  if (!parsed.pathname.startsWith(deliveryPrefix)) return false;
  const assetPath = parsed.pathname.slice(deliveryPrefix.length).replace(FILE_EXTENSION, "");
  return new RegExp(`^${VERSION_SEGMENT}${escapeForRegExp(publicId)}$`).test(assetPath);
}
