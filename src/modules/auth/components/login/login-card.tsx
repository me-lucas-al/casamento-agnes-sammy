import type { EventSettingsSnapshot } from "@/modules/event/types";
import { AccessCodeForm } from "./access-code-form";
import { GoogleSignInButton } from "./google-sign-in-button";
import { HowItWorksStrip } from "./how-it-works-strip";
import { LoginHeader } from "./login-header";
import { LoginTabs, type LoginTab } from "./login-tabs";

type LoginCardProps = {
  settings: EventSettingsSnapshot;
  initialCode: string;
  initialTab: LoginTab;
  errorMessage: string | null;
};

export function LoginCard({ settings, initialCode, initialTab, errorMessage }: LoginCardProps) {
  return (
    <section
      aria-labelledby="login-title"
      className="login-rise flex w-full max-w-md flex-col gap-3 rounded-[1.75rem] border border-gold/40 bg-card/95 p-4 shadow-[0_18px_50px_-24px_rgb(91_26_46/0.45)] [@media(min-height:760px)]:gap-5 sm:p-8"
    >
      <LoginHeader settings={settings} />
      <LoginTabs
        initialTab={initialTab}
        guestPanel={<AccessCodeForm initialCode={initialCode} />}
        couplePanel={<GoogleSignInButton errorMessage={errorMessage} />}
      />
      <HowItWorksStrip />
    </section>
  );
}
