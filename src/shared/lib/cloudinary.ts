import { createHash } from "node:crypto";

export type SignedUploadParams = {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
};

export interface CloudinaryClient {
  signUpload(folder: string): SignedUploadParams;
  destroyImage(publicId: string): Promise<void>;
}

export type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function signParameters(parameters: Record<string, string | number>, apiSecret: string): string {
  const payload = Object.keys(parameters)
    .sort()
    .map((key) => `${key}=${parameters[key]}`)
    .join("&");
  return createHash("sha1").update(payload + apiSecret).digest("hex");
}

export function createCloudinaryClient(credentials: CloudinaryCredentials): CloudinaryClient {
  const { cloudName, apiKey, apiSecret } = credentials;

  return {
    signUpload(folder) {
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = signParameters({ folder, timestamp }, apiSecret);
      return { cloudName, apiKey, timestamp, folder, signature };
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
