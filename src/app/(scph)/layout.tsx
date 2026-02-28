import { ScphNavbar } from "@/components/scph/navbar";
import { ScphFooter } from "@/components/scph/footer";

export default function ScphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ScphNavbar />
      <main>{children}</main>
      <ScphFooter />
    </>
  );
}
