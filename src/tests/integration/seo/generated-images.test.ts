import { describe, expect, it, vi } from "vitest";
import AppleIcon from "@/app/apple-icon";
import Icon from "@/app/icon";
import OpenGraphImage, { size as openGraphSize } from "@/app/opengraph-image";
import robots from "@/app/robots";

vi.mock("@/modules/event/controllers/queries/event.queries", async () => {
  const { DEFAULT_EVENT_SETTINGS } = await import("@/modules/event/lib/default-event-settings");
  const { toEventSnapshot } = await import("@/modules/event/lib/event-snapshot");
  return { getEventSettingsQuery: async () => toEventSnapshot(DEFAULT_EVENT_SETTINGS) };
});

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47];
const PNG_WIDTH_OFFSET = 16;

async function readPng(response: Response) {
  const bytes = new Uint8Array(await response.arrayBuffer());
  const view = new DataView(bytes.buffer);
  return {
    signature: [...bytes.slice(0, 4)],
    width: view.getUint32(PNG_WIDTH_OFFSET),
    height: view.getUint32(PNG_WIDTH_OFFSET + 4),
  };
}

describe("generated seo images", () => {
  it("renders a 1200x630 open graph png", async () => {
    const png = await readPng(await OpenGraphImage());
    expect(png.signature).toEqual(PNG_SIGNATURE);
    expect([png.width, png.height]).toEqual([openGraphSize.width, openGraphSize.height]);
  });

  it("renders the favicon and apple touch icon from the monogram", async () => {
    const icon = await readPng(await Icon());
    const appleIcon = await readPng(await AppleIcon());
    expect([icon.width, icon.height]).toEqual([512, 512]);
    expect([appleIcon.width, appleIcon.height]).toEqual([180, 180]);
  });

  it("serves a robots file that disallows everything", () => {
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });
});
