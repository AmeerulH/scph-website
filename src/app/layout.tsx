import type { Metadata } from "next";
import { poppins, inter } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getSiteUrlString } from "@/lib/site-url";
import "./globals.css";

const siteUrl = getSiteUrlString();
const defaultDescription =
  "A Think-and-Do tank committed to research and advocacy that advances planetary health.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Sunway Centre for Planetary Health",
  description: defaultDescription,
  openGraph: {
    type: "website",
    locale: "en_MY",
    url: siteUrl,
    siteName: "Sunway Centre for Planetary Health",
    title: "Sunway Centre for Planetary Health",
    description: defaultDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunway Centre for Planetary Health",
    description: defaultDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
