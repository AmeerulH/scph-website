import { GtpNavbar } from "@/components/gtp/navbar";
import { GtpFooter } from "@/components/gtp/footer";
import { AtmosphericReveal } from "@/components/motion/AtmosphericReveal";

export default function GtpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GtpNavbar />
      <main>
        <AtmosphericReveal>{children}</AtmosphericReveal>
      </main>
      <GtpFooter />
    </>
  );
}
