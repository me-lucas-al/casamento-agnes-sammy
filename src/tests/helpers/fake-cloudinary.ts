import { ALLOWED_UPLOAD_FORMATS, type CloudinaryClient, type SignedUploadParams } from "@/shared/lib/cloudinary";

export const FAKE_CLOUD_NAME = "fake-cloud";

export class FakeCloudinaryClient implements CloudinaryClient {
  readonly cloudName = FAKE_CLOUD_NAME;
  destroyedPublicIds: string[] = [];
  failOnDestroy = false;

  signUpload(publicId: string): SignedUploadParams {
    return {
      cloudName: FAKE_CLOUD_NAME,
      apiKey: "fake-key",
      timestamp: 1,
      publicId,
      allowedFormats: ALLOWED_UPLOAD_FORMATS,
      signature: "fake-signature",
    };
  }

  async destroyImage(publicId: string): Promise<void> {
    if (this.failOnDestroy) throw new Error("destroy failed");
    this.destroyedPublicIds.push(publicId);
  }
}
