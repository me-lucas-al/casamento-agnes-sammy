import type { CloudinaryClient, SignedUploadParams } from "@/shared/lib/cloudinary";

export class FakeCloudinaryClient implements CloudinaryClient {
  destroyedPublicIds: string[] = [];

  signUpload(folder: string): SignedUploadParams {
    return { cloudName: "fake-cloud", apiKey: "fake-key", timestamp: 1, folder, signature: "fake-signature" };
  }

  async destroyImage(publicId: string): Promise<void> {
    this.destroyedPublicIds.push(publicId);
  }
}
