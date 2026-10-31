import type { EventSettingsSnapshot } from "@/modules/event/types";
import { BrandFooter } from "@/shared/ui/components/brand-footer";
import { FloralCorners } from "@/shared/ui/components/floral-corners";
import { LoginCard } from "./login-card";
import { LoginPetals } from "./login-petals";
import type { LoginTab } from "./login-tabs";

type LoginScreenProps = {
  settings: EventSettingsSnapshot;
  initialCode: string;
  initialTab: LoginTab;
  errorMessage: string | null;
};

export function LoginScreen({ settings, initialCode, initialTab, errorMessage }: LoginScreenProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-3 sm:py-6">
        <FloralCorners className="w-24 sm:w-40 lg:w-56" />
        <LoginPetals />
        <main className="relative z-10 flex w-full justify-center">
          <LoginCard settings={settings} initialCode={initialCode} initialTab={initialTab} errorMessage={errorMessage} />
        </main>
      </div>
      <BrandFooter />
    </div>
  );
}
