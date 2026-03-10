import { ScphNavbar } from "@/components/scph/navbar";
import { ScphFooter } from "@/components/scph/footer";
import { AtmosphericReveal } from "@/components/motion/AtmosphericReveal";

export default function ScphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScphNavbar />
      <main>
        <AtmosphericReveal>{children}</AtmosphericReveal>
      </main>
      <ScphFooter />
    </>
  );
}
