import { describe, expect, it } from "vitest";
import { DEFAULT_EVENT_SETTINGS } from "../default-event-settings";
import { toEventSnapshot } from "../event-snapshot";
import { maskEventSettingsForViewer } from "../privacy/mask-event-settings-for-viewer";

describe("maskEventSettingsForViewer", () => {
  const settings = {
    ...toEventSnapshot(DEFAULT_EVENT_SETTINGS),
    pixKey: "casal@pix.com",
    pixKeyType: "email" as const,
    pixReceiverName: "Agnes Souza",
  };

  it("masks the Pix key and receiver and keeps the public event data", () => {
    expect(maskEventSettingsForViewer(settings)).toEqual({
      ...settings,
      pixKey: "c••••@pix.com",
      pixReceiverName: "Agnes S.",
    });
  });

  it("keeps an unset Pix key unset", () => {
    expect(maskEventSettingsForViewer({ ...settings, pixKey: null, pixReceiverName: null })).toMatchObject({
      pixKey: null,
      pixReceiverName: null,
    });
  });
});
