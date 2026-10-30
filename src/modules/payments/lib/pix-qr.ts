import { toString } from "qrcode";

export async function renderPixQrSvgDataUrl(brCode: string): Promise<string> {
  const svg = await toString(brCode, { type: "svg", errorCorrectionLevel: "M", margin: 1 });
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
