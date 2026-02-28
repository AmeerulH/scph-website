import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Leaf, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";

// ─── Hero Band ───────────────────────────────────────────────────────────────

function AboutHero() {
  return (
    <div className="bg-scph-blue px-4 pb-24 pt-40 text-center">
      <div className="mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          About Us
        </span>
        <h1 className="mt-6 font-heading text-5xl font-bold leading-tight text-white md:text-6xl">
          About Sunway Centre for Planetary Health
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-scph-green" />
      </div>
    </div>
  );
}

// ─── What is Planetary Health ─────────────────────────────────────────────────

function WhatIsPlanetaryHealthSection() {
  return (
    <SectionWrapper theme="scph" background="default">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex items-center gap-3 text-scph-dark-green">
            <span className="h-px w-8 bg-current opacity-60 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              Our Foundation
            </span>
          </div>
          <h2 className="font-heading text-4xl font-bold leading-tight text-scph-blue md:text-5xl">
            What is Planetary Health?
          </h2>
          <div className="mt-4 h-1 w-20 rounded-full bg-scph-green" />
          <p className="mt-6 text-lg leading-relaxed text-gray-600">
            A planetary health approach to human development recognises that
            humankind has made significant progress in many ways with the
            industrial, green and technological revolutions as examples. But
            these development gains are now being offset by increasingly obvious
            disruption to the health of the planet.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            We can see this in depleted biodiversity, changing land use and
            cover, a massive increase in air pollution, shortages of natural
            resources, and the resulting damage to our lived environment — most
            clearly demonstrated through recent pandemic and disease outbreaks
            and the climate emergency.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <div className="flex h-80 w-80 items-center justify-center rounded-3xl bg-scph-blue/8 p-10 ring-1 ring-scph-blue/10">
            <Image
              src="/images/scph/logo-round.png"
              alt="SCPH Round Logo"
              width={220}
              height={220}
              className="h-auto w-full object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Our Mission ──────────────────────────────────────────────────────────────

const pillars = [
  { icon: Building2, label: "Healthy Cities" },
  { icon: Leaf, label: "Health-Centred Decarbonisation" },
  { icon: GraduationCap, label: "Education Revolution" },
];

function MissionSection() {
  return (
    <SectionWrapper
      title="A Think-and-Do Tank for Planetary Health"
      subtitle="Our Mission"
      theme="scph"
      background="muted"
    >
      <div className="max-w-3xl">
        <p className="text-lg leading-relaxed text-gray-600">
          Sunway Centre for Planetary Health is committed to research and
          advocacy that advances planetary health through three priority areas:
          healthy cities, health-centred decarbonisation, and driving an
          education revolution.
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-500">
          Anchored at Sunway University in Kuala Lumpur, we work across
          disciplines and borders to translate evidence into meaningful action
          for people and the planet.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        {pillars.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-full border border-scph-blue/20 bg-white px-5 py-3 shadow-sm"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-scph-blue/10">
              <Icon className="h-4 w-4 text-scph-blue" />
            </div>
            <span className="text-sm font-medium text-scph-blue">{label}</span>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── Meet the Team ────────────────────────────────────────────────────────────

// TODO: replace initials avatars with real photos from /images/scph/team/ once available

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  bio: string[];
}

const teamMembers: TeamMember[] = [
  {
    name: "Tan Sri Dr Jemilah Mahmood",
    initials: "TJ",
    role: "Executive Director",
    bio: [
      "Dr. Mahmood is a Professor of Planetary Health at Sunway University. A medical professional with more than two decades of experience managing health crises in disasters and conflict settings, her previous appointments include: Under Secretary General for Partnerships at the International Federation of Red Cross and Red Crescent Societies (IFRC); Chief of the World Humanitarian Summit secretariat at the United Nations; and Chief of the Humanitarian Response Branch at the United Nations Population Fund (UNFPA).",
      "In 2020, she was appointed a Senior Fellow of the Adrienne Arsht-Rockefeller Foundation Resilience Centre to help reach the goal of making one billion people more resilient to climate change, migration, and human security challenges by 2030. She was also the Special Advisor to the Prime Minister of Malaysia on Public Health, a member of the Government of Malaysia's Economic Action Council and Climate Action Council, and most notably the founder of MERCY Malaysia, a Southern-based international humanitarian organisation.",
      "Dr. Mahmood has received numerous international and national awards including the ASEAN Award in 2019 and the Merdeka Award in 2015 for excellent contribution to community development in Malaysia and the region. Her international awards include the prestigious Isa Award for Services to Humanity in 2013 from the Kingdom of Bahrain, often referred to as the \"Nobel peace prize equivalent in the Gulf\".",
    ],
  },
  {
    name: "Dr. Fatimah Ahmad",
    initials: "FA",
    role: "Chief Scientist",
    bio: [
      "Dr Fatimah Ahamad currently holds the position of Chief Scientist at the Sunway Centre for Planetary Health, Sunway University, Malaysia. She is also co-chairing the Programme Committee for the Planetary Health Summit. She obtained her PhD in Environmental Science from Universiti Kebangsaan Malaysia and her primary research interest is in air quality. Her experience includes working on projects commissioned by the Department of Environment Malaysia and served as Subject Matter Expert for the concession company, Pakar Scieno Transwater Sdn. Bhd., which currently runs the national Environmental Monitoring Program for the Department of Environment Malaysia. She also runs AQ Expert Solutions, an enterprise committed to facilitating the understanding of environmental data.",
    ],
  },
  {
    name: "Maisarah Faiesall",
    initials: "MF",
    role: "Special Assistant to the Executive Director",
    bio: [
      "Maisarah Faiesall is a First-Class graduate of International Relations with Mandarin from the University of Nottingham, Malaysia with experience in research and analysis, new media communications, and youth engagement, in both the public and private sector. Her career has largely been motivated to bridging the gap between academia and communities through close engagement of local actors and translation of evidence-based research into digestible materials. Previously, Maisarah had served as a researcher to the Prime Minister of Malaysia's Public Health Advisor working on public health and disaster risk reduction.",
    ],
  },
  {
    name: "Nazia Ahmad",
    initials: "NA",
    role: "Programme Manager",
    bio: [
      "Nazia is a qualified professional with a strong background in social work and human rights. She completed her postgraduate studies in Social Work from Jamia Millia Islamia University in India and holds a Postgraduate Diploma in Human Rights and International Humanitarian and Refugee Laws. Previously, she has worked with National Commission for Women, Government of India with special focus on supporting female prisoners, female patients in psychiatric homes, and women in distress. She has extensive experience working with children affected by substance abuse and her professional background also includes collaborations with German and Dutch organisations, where she focused on capacity building and facilitation.",
    ],
  },
  {
    name: "Hamizah Norrizam",
    initials: "HN",
    role: "Communications Officer",
    bio: [
      "Hamizah is a skilled Social Media Manager renowned for her expertise in social media. She holds a degree in Public Communications from the University of Technology, Sydney, Australia. With a deep passion for social media and a keen interest in youth and planetary health issues, Hamizah remains dedicated to her work. Currently, she serves as a valuable member of the Sunway Centre for Planetary Health, where she contributes her talents by overseeing prominent campaigns including Planet Saving Meals, Planetary Future Fridays, and Generation Green.",
    ],
  },
  {
    name: "Laila Iskandar",
    initials: "LI",
    role: "Head of Communications",
    bio: [
      "Laila Iskandar is the Communications Manager at the Sunway Centre for Planetary Health, where she applies her expertise in public relations, digital marketing, and corporate communications to develop and execute the centre's communication strategy, engaging stakeholders through various media platforms.",
      "Previously, Laila was the Senior Executive of Public Relations & Sustainability at 1 Utama Shopping Centre, where she played a pivotal role in media relations, press release communications, social media content management, and event launches. She holds a Master's in Mass Communication from the Universiti Teknologi MARA (2020) and a Bachelor's in Islamic Banking from the International Islamic University Malaysia (2014).",
    ],
  },
  {
    name: "Zebo Khamraeva",
    initials: "ZK",
    role: "Special Assistant to Executive Director",
    bio: [
      "Zebo Khamraeva is the Special Assistant to the Executive Director at Sunway Centre for Planetary Health (SCPH). She is skilled in efficiently managing complex schedules, coordinating high-stakes meetings, preparing speaking notes, and ensuring seamless relationship management with stakeholders. She is particularly interested in the interplay of mental health and climate change and how this can be translated to youth engagement. She holds a First-Class Honours degree in International Business Management and a Master's degree in Management Psychology with Distinction from the University of Nottingham Malaysia.",
    ],
  },
  {
    name: "Dr. Noorul Ezyan Nor Hashim",
    initials: "NE",
    role: "Program Officer",
    bio: [
      "Dr Noorul Ezyan Nor Hashim is an ornithologist, graduated from University of Malaya, Kuala Lumpur, Malaysia in 2021. Her research specializes in ecological and behavioural studies of birds, including studies on biodiversity and conservation of tropical and urban birds. In future research, she would like to explore zoonotic disease and relationship with human health especially in urban settings. She is now working as a Research Analyst for Programme, Policy, and Advocacy in Sunway Centre for Planetary Health, responsible for managing youth engagement programmes of the centre aimed at empowering youth in the movements towards planetary health.",
    ],
  },
  {
    name: "Siti Hannah",
    initials: "SH",
    role: "Education Officer",
    bio: [
      "Hannah is a Research Analyst at the Sunway Centre for Planetary Health, specializing in education, knowledge, and learning. Her current work involves developing educational programs and resources with a focus on ensuring knowledge accessibility for a wide audience. Holding an MBBS degree from the University of Malaya, Hannah has previously contributed to the design and implementation of the University of Malaya Medical Programme. She has a versatile skill set spanning diverse fields, including biological sciences, data science, advocacy, and interdisciplinary studies.",
    ],
  },
  {
    name: "Dr. Menaka Ganeson",
    initials: "MG",
    role: "Research Analyst",
    bio: [
      "Dr. Menaka is a Research & Innovation Officer at Sunway Centre for Planetary Health (SCPH). Her main role is to identify and explore innovative ideas, approaches, and research opportunities aiming to create dynamic transformation in planetary health agendas. She manages research-related activities including proposal development and grant management. She was a Postdoctoral Researcher at Universiti Teknologi PETRONAS (UTP) from 2017–2022. She received her Ph.D. training in Plant Pathology from the University of Nottingham Malaysia Campus (2016).",
    ],
  },
  {
    name: "Dr. Nadia Nantheni Rajaram",
    initials: "NR",
    role: "Research Analyst",
    bio: [
      "Dr Nadia Rajaram is an epidemiologist with over 10 years of research experience. She began her career as a researcher for the Asian Pacific Resource and Research Centre for Women, a non-profit organisation championing the sexual and reproductive rights of women in the region. She later worked with Cancer Research Malaysia to conduct research on breast cancer prevention and outcomes for Malaysian women. Most notably, she designed and conducted the first clinical trial in Asia studying the relationship between consuming soy and the risk of breast cancer. Currently, Dr Nadia Rajaram is a Post-Doctoral Research Fellow at the Sunway Centre for Planetary Health, with research primarily focused on nutrition, food insecurity and its intersection with the health of the planet and its people.",
    ],
  },
  {
    name: "Dr. Loo Yen Yi",
    initials: "LY",
    role: "Post Doctoral Research Fellow",
    bio: [
      "Dr. Loo Yen Yi is an ornithologist with research interests in animal behaviour and biodiversity conservation. Dr. Loo holds a Bachelor's degree in Environmental Science from University of Nottingham (Malaysia), a Master's degree in Bird Conservation from Manchester Metropolitan University (UK), and a Doctoral degree in Biological Sciences from University of Auckland (New Zealand). Her current appointment as a Post-doctoral Research Fellow in the Sunway Centre for Planetary Health explores the role of biodiversity conservation in planetary health. Her research is currently funded by The Habitat Foundation and The K. Lisa Yang Centre for Conservation Bioacoustics, Lab of Ornithology at Cornell University.",
    ],
  },
  {
    name: "Mr. Oliver Lacey-Hall",
    initials: "OL",
    role: "Senior Adviser – Communications and Partnerships",
    bio: [
      "Oliver Lacey-Hall is the Senior Adviser on Partnerships and Communications for the Sunway Centre for Planetary Health at Sunway University. Previously he was Director of the UK's Humanitarian and Stabilisation Operations Team (HSOT), leading provision of humanitarian and stabilisation services to the UK Government by the Palladium Group. Prior roles include service with the United Nations Office for the Coordination of Humanitarian Affairs (OCHA) heading its regional office for Asia and the Pacific. He has 30 years' experience in humanitarian work, with an initial focus on refugee issues followed by coordination and communications work. Oliver holds a master's degree in Gender Analysis and Development from the University of East Anglia in the United Kingdom.",
    ],
  },
];

function MeetTheTeamSection() {
  return (
    <SectionWrapper
      title="Meet the Team"
      subtitle="Our Team"
      theme="scph"
      background="default"
    >
      <div className="space-y-0">
        {teamMembers.map((member, index) => (
          <div
            key={member.name}
            className={`flex flex-col gap-8 md:flex-row md:gap-10 md:items-start ${
              index < teamMembers.length - 1
                ? "border-b border-gray-100 pb-10 mb-10"
                : ""
            }`}
          >
            {/* Avatar */}
            <div className="flex shrink-0 justify-center md:justify-start">
              <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-scph-blue/8 ring-1 ring-scph-blue/15 md:h-44 md:w-44">
                <span className="font-heading text-2xl font-bold text-scph-blue">
                  {member.initials}
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="flex-1">
              <h3 className="font-heading text-xl font-bold text-scph-blue">
                {member.name}
              </h3>
              <p className="mt-1 text-sm font-semibold text-scph-dark-green">
                {member.role}
              </p>
              <div className="mt-3 space-y-3">
                {member.bio.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <Button variant="scphSecondary" size="lg" asChild>
          <Link href="/network">
            Get Involved <ArrowRight />
          </Link>
        </Button>
      </div>
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutUsPage() {
  return (
    <>
      <AboutHero />
      <WhatIsPlanetaryHealthSection />
      <MissionSection />
      <MeetTheTeamSection />
    </>
  );
}
