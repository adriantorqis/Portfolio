import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

// Headings use Plus Jakarta Sans. Body copy uses SF Pro, which Apple only
// licenses for Apple platforms and so can't be self-hosted or loaded from
// Google Fonts — it's reached through the system font stack in globals.css
// (-apple-system resolves to SF Pro on macOS/iOS), falling back to the
// closest neutral sans elsewhere.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work and case studies.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
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
