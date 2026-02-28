import Image from "next/image";

const scphColors = [
  { name: "SCPH Blue", hex: "#1B4384", class: "bg-scph-blue" },
  { name: "SCPH Blue Light", hex: "#2a5ba8", class: "bg-scph-blue-light" },
  { name: "SCPH Blue Dark", hex: "#132f5e", class: "bg-scph-blue-dark" },
  { name: "SCPH Green", hex: "#50B58B", class: "bg-scph-green" },
  { name: "SCPH Green Light", hex: "#6ec4a0", class: "bg-scph-green-light" },
  { name: "SCPH Green Dark", hex: "#3e9370", class: "bg-scph-green-dark" },
  { name: "SCPH Dark Green", hex: "#03745B", class: "bg-scph-dark-green" },
  {
    name: "SCPH Dark Green Light",
    hex: "#058f70",
    class: "bg-scph-dark-green-light",
  },
  {
    name: "SCPH Dark Green Dark",
    hex: "#025a46",
    class: "bg-scph-dark-green-dark",
  },
];

const gtpColors = [
  { name: "GTP Dark Teal", hex: "#0D4D5E", class: "bg-gtp-dark-teal" },
  {
    name: "GTP Dark Teal Light",
    hex: "#116578",
    class: "bg-gtp-dark-teal-light",
  },
  {
    name: "GTP Dark Teal Dark",
    hex: "#093a48",
    class: "bg-gtp-dark-teal-dark",
  },
  { name: "GTP Teal", hex: "#009CB4", class: "bg-gtp-teal" },
  { name: "GTP Teal Light", hex: "#00b5d1", class: "bg-gtp-teal-light" },
  { name: "GTP Teal Dark", hex: "#007d90", class: "bg-gtp-teal-dark" },
  { name: "GTP Green", hex: "#86BC25", class: "bg-gtp-green" },
  { name: "GTP Green Light", hex: "#9acb47", class: "bg-gtp-green-light" },
  { name: "GTP Green Dark", hex: "#6b971e", class: "bg-gtp-green-dark" },
  { name: "GTP Dark Green", hex: "#5C8119", class: "bg-gtp-dark-green" },
  { name: "GTP Orange", hex: "#DB5D00", class: "bg-gtp-orange" },
  { name: "GTP Orange Light", hex: "#f06a00", class: "bg-gtp-orange-light" },
  { name: "GTP Orange Dark", hex: "#b34c00", class: "bg-gtp-orange-dark" },
];

function ColorSwatch({
  color,
}: {
  color: { name: string; hex: string; class: string };
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${color.class} h-20 w-20 rounded-lg shadow-md`} />
      <p className="text-xs font-medium">{color.name}</p>
      <p className="font-mono text-xs text-muted-foreground">{color.hex}</p>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-heading text-4xl font-bold tracking-tight">
        SCPH Website — Setup Verification
      </h1>
      <p className="mt-2 text-lg text-muted-foreground">
        This temporary page verifies that fonts, colours, and assets are set up
        correctly.
      </p>

      <hr className="my-8" />

      {/* Fonts */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold">Fonts</h2>
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Heading Font (Poppins):
            </p>
            <p className="font-heading text-3xl font-bold">
              Sunway Centre for Planetary Health
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Body Font (Inter):
            </p>
            <p className="font-sans text-lg">
              A Think-and-Do tank committed to research and advocacy that
              advances planetary health through three priority areas: healthy
              cities, health-centred decarbonisation, and driving an education
              revolution.
            </p>
          </div>
        </div>
      </section>

      {/* SCPH Colours */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold">
          SCPH Brand Colours
        </h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {scphColors.map((color) => (
            <ColorSwatch key={color.hex} color={color} />
          ))}
        </div>
      </section>

      {/* GTP Colours */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold">
          GTP 2026 Brand Colours
        </h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {gtpColors.map((color) => (
            <ColorSwatch key={color.hex} color={color} />
          ))}
        </div>
      </section>

      {/* Logos */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold">Logos</h2>
        <div className="mt-4 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
            <Image
              src="/images/scph/logo.png"
              alt="SCPH Logo"
              width={200}
              height={80}
              className="h-auto w-auto"
            />
            <p className="text-sm text-muted-foreground">SCPH Main Logo</p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
            <Image
              src="/images/scph/logo-round.png"
              alt="SCPH Round Logo"
              width={100}
              height={100}
              className="h-auto w-auto"
            />
            <p className="text-sm text-muted-foreground">SCPH Round Logo</p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
            <Image
              src="/images/gtp/logo.png"
              alt="GTP Logo"
              width={200}
              height={80}
              className="h-auto w-auto"
            />
            <p className="text-sm text-muted-foreground">GTP 2026 Logo</p>
          </div>
          <div className="flex flex-col items-center gap-3 rounded-lg border p-6">
            <Image
              src="/images/gtp/footer.png"
              alt="GTP Footer"
              width={200}
              height={40}
              className="h-auto w-auto"
            />
            <p className="text-sm text-muted-foreground">GTP Footer</p>
          </div>
        </div>
      </section>

      {/* GTP Visuals */}
      <section className="mb-12">
        <h2 className="font-heading text-2xl font-semibold">
          GTP Website Visuals
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            { src: "/images/gtp/visuals/Home.png", label: "Home" },
            { src: "/images/gtp/visuals/About us.png", label: "About Us" },
            {
              src: "/images/gtp/visuals/Positive Tipping Points.png",
              label: "Positive Tipping Points",
            },
            {
              src: "/images/gtp/visuals/Tipping Points & Risks.png",
              label: "Tipping Points & Risks",
            },
            {
              src: "/images/gtp/visuals/conferences.png",
              label: "Conferences",
            },
            { src: "/images/gtp/visuals/Governance.png", label: "Governance" },
          ].map((visual) => (
            <div
              key={visual.label}
              className="overflow-hidden rounded-lg border"
            >
              <Image
                src={visual.src}
                alt={visual.label}
                width={800}
                height={450}
                className="h-auto w-full"
              />
              <p className="p-2 text-center text-sm text-muted-foreground">
                {visual.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
