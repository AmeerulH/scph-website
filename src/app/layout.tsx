import type { Metadata } from "next";
import { poppins, inter } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sunway Centre for Planetary Health",
  description:
    "A Think-and-Do tank committed to research and advocacy that advances planetary health.",
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
      </body>
    </html>
  );
}
