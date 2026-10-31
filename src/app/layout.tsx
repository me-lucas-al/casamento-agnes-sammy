import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { buildSiteMetadata } from "@/shared/seo/metadata/site-metadata";
import { fontVariableClassNames } from "@/shared/theme/fonts";
import "./globals.css";

export const metadata: Metadata = buildSiteMetadata(process.env.APP_URL);

export const viewport: Viewport = { themeColor: "#b83a6b" };

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR" className={`${fontVariableClassNames} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-paper text-wine">{children}</body>
    </html>
  );
}
