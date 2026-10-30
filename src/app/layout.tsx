import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontVariableClassNames } from "@/shared/theme/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agnes & Sammy",
  description: "Casamento Agnes & Sammy",
  robots: { index: false, follow: false },
};

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={`${fontVariableClassNames} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-paper text-wine">{children}</body>
    </html>
  );
}
