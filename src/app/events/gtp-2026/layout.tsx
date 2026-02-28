import { GtpNavbar } from "@/components/gtp/navbar";
import { GtpFooter } from "@/components/gtp/footer";

export default function GtpLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GtpNavbar />
      <main>{children}</main>
      <GtpFooter />
    </>
  );
}
