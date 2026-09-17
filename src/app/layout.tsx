import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

// Fraunces carries real optical sizing, so the display face stays refined at
// hero scale instead of looking like body copy blown up.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["SOFT", "WONK", "opsz"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work and case studies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <head>
        {/* Reveals start hidden and are switched on by JS — CSS ones via
            .reveal, Motion ones via inline styles it server-renders. Either
            way a failed script would leave the page invisible, so both are
            hard-reset when scripting is unavailable. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                ".reveal,.anim{opacity:1 !important;transform:none !important;filter:none !important}",
            }}
          />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
