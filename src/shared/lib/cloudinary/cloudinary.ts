import { createHash } from "node:crypto";

export const ALLOWED_UPLOAD_FORMATS = "jpg,png,webp";

export type SignedUploadParams = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  publicId: string;
  allowedFormats: string;
  uploadPreset: string;
  signature: string;
};

export interface CloudinaryClient {
  readonly cloudName: string;
  signUpload(publicId: string): SignedUploadParams;
  destroyImage(publicId: string): Promise<void>;
}

export type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
  uploadPreset: string;
};

export function signParameters(parameters: Record<string, string | number>, apiSecret: string): string {
  const payload = Object.keys(parameters)
    .sort()
    .map((key) => `${key}=${parameters[key]}`)
    .join("&");
  return createHash("sha1").update(payload + apiSecret).digest("hex");
}

export function createCloudinaryClient(credentials: CloudinaryCredentials): CloudinaryClient {
  const { cloudName, apiKey, apiSecret, uploadPreset } = credentials;

  return {
    cloudName,
    signUpload(publicId) {
      const timestamp = Math.floor(Date.now() / 1000);
      const allowedFormats = ALLOWED_UPLOAD_FORMATS;
      const signature = signParameters(
        { allowed_formats: allowedFormats, public_id: publicId, timestamp, upload_preset: uploadPreset },
        apiSecret,
      );
      return { cloudName, apiKey, timestamp, publicId, allowedFormats, uploadPreset, signature };
    },
    async destroyImage(publicId) {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = signParameters({ public_id: publicId, timestamp }, apiSecret);
      const body = new URLSearchParams({
        public_id: publicId,
        timestamp: String(timestamp),
        api_key: apiKey,
        signature,
      });
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
        { method: "POST", body },
      );
      if (!response.ok) throw new Error(`Cloudinary destroy failed: ${response.status}`);
    },
  };
}
