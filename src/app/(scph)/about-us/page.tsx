import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Building2, Leaf, GraduationCap, BookOpen, Target, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";

// ─── Hero Banner ─────────────────────────────────────────────────────────────

function AboutHero() {
  return (
    <div className="relative px-4 pb-24 pt-40 text-center overflow-hidden">
      {/* Forest background — place forest-bg.jpg in public/images/scph/ */}
      <Image
        src="/images/scph/forest-bg.jpg"
        alt="Forest background"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-scph-blue/80" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <span className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-white/80 backdrop-blur-sm">
          About Us
        </span>
        <h1 className="mt-6 font-heading text-3xl font-bold leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
          About Sunway Centre for Planetary Health
        </h1>
        <div className="mx-auto mt-6 h-1 w-20 rounded-full bg-scph-green" />
      </div>
    </div>
  );
}

// ─── Our Foundation ───────────────────────────────────────────────────────────

function OurFoundationSection() {
  return (
    <SectionWrapper theme="scph" background="default">
      {/* Anchor for navbar dropdown */}
      <div id="foundation" className="-mt-24 pt-24" />
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
            these development gains are now being offset by increasingly
            obvious disruption to the health of the planet.
          </p>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            We can see this in depleted biodiversity, changing land use and
            cover, a massive increase in air pollution, shortages of natural
            resources, and the resulting damage to our lived environment —
            most clearly demonstrated through recent pandemic and disease
            outbreaks and the climate emergency.
          </p>
        </div>

        {/* Right — diagram placeholders */}
        {/* Place ph-diagram.png and wedding-cake.png in public/images/scph/ */}
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="relative flex-1 overflow-hidden rounded-2xl bg-scph-blue/5 ring-1 ring-scph-blue/10 aspect-square flex items-center justify-center">
            <Image
              src="/images/scph/ph-diagram.png"
              alt="Planetary Health Diagram"
              fill
              className="object-contain p-4"
            />
            <span className="absolute bottom-2 text-xs text-gray-400 font-medium">
              PH Diagram
            </span>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-2xl bg-scph-blue/5 ring-1 ring-scph-blue/10 aspect-square flex items-center justify-center">
            <Image
              src="/images/scph/wedding-cake.png"
              alt="Wedding Cake Diagram"
              fill
              className="object-contain p-4"
            />
            <span className="absolute bottom-2 text-xs text-gray-400 font-medium">
              Wedding Cake
            </span>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Our Strategy ─────────────────────────────────────────────────────────────

const strategyCards = [
  {
    icon: Target,
    title: "Vision & Mission",
    description:
      "Our vision and mission set the direction for all our work, guiding how we advance planetary health across disciplines and borders.",
    href: "#",
  },
  {
    icon: ArrowRight,
    title: "2025–27 Strategy",
    description:
      "Our three-year strategy outlines the concrete steps we are taking to translate evidence into meaningful action for people and the planet.",
    href: "#",
  },
  {
    icon: BookOpen,
    title: "Core Values",
    description:
      "We are guided by a set of core values that shape our culture, partnerships, and the way we engage with communities and institutions.",
    href: "#",
  },
  {
    icon: Users,
    title: "Strategic Pillars",
    description:
      "Our strategic pillars organise our work into focused areas: healthy cities, health-centred decarbonisation, and an education revolution.",
    href: "#",
  },
];

function OurStrategySection() {
  return (
    <SectionWrapper
      title="Sunway Centre for Planetary Health"
      subtitle="Our Vision & Mission"
      theme="scph"
      background="muted"
    >
      {/* Anchor for navbar dropdown */}
      <div id="strategy" className="-mt-24 pt-24" />
      <div className="mb-10 max-w-3xl">
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {strategyCards.map(({ icon: Icon, title, description, href }) => (
          <div
            key={title}
            className="group flex flex-col rounded-2xl bg-white p-7 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-scph-blue/10">
              <Icon className="h-6 w-6 text-scph-blue" />
            </div>
            <h3 className="font-heading text-lg font-bold text-scph-blue">{title}</h3>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">{description}</p>
            <Link
              href={href}
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-scph-blue transition-colors hover:text-scph-dark-green"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}

// ─── Our Journey ──────────────────────────────────────────────────────────────

function OurJourneySection() {
  return (
    <SectionWrapper
      title="Milestone Reached and Future Aspiration"
      subtitle="Our Journey"
      theme="scph"
      background="default"
    >
      {/* Anchor for potential future use */}
      <div id="journey" className="-mt-24 pt-24" />
      {/* Timeline content — pending slides 7 & 8 from the SCPH team */}
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border-2 border-dashed border-scph-blue/15 bg-scph-blue/3 p-10 text-center">
        <div>
          <p className="text-base font-medium text-scph-blue/60">
            Journey timeline coming soon
          </p>
          <p className="mt-2 text-sm text-gray-400">
            This section will display SCPH&apos;s milestones and future aspirations
            once the timeline assets are provided.
          </p>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Meet the Team ────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  bio: string[];
}

interface TeamGroup {
  groupLabel?: string;
  members: TeamMember[];
}

const teamGroups: TeamGroup[] = [
  {
    members: [
      {
        name: "Tan Sri Prof. Dr. Jemilah Mahmood",
        initials: "TJ",
        role: "Executive Director",
        bio: [
          "Dr. Mahmood is a Professor of Planetary Health at Sunway University. A medical professional with more than two decades of experience managing health crises in disasters and conflict settings, her previous appointments include: Under Secretary General for Partnerships at the International Federation of Red Cross and Red Crescent Societies (IFRC); Chief of the World Humanitarian Summit secretariat at the United Nations; and Chief of the Humanitarian Response Branch at the United Nations Population Fund (UNFPA).",
          "In 2020, she was appointed a Senior Fellow of the Adrienne Arsht-Rockefeller Foundation Resilience Centre to help reach the goal of making one billion people more resilient to climate change, migration, and human security challenges by 2030. She was also the Special Advisor to the Prime Minister of Malaysia on Public Health, a member of the Government of Malaysia's Economic Action Council and Climate Action Council, and most notably the founder of MERCY Malaysia, a Southern-based international humanitarian organisation.",
          "Dr. Mahmood has received numerous international and national awards including the ASEAN Award in 2019 and the Merdeka Award in 2015 for excellent contribution to community development in Malaysia and the region. Her international awards include the prestigious Isa Award for Services to Humanity in 2013 from the Kingdom of Bahrain, often referred to as the \"Nobel peace prize equivalent in the Gulf\".",
        ],
      },
      {
        name: "Oliver Lacey-Hall",
        initials: "OL",
        role: "Senior Adviser – Communications and Partnerships",
        bio: [
          "Oliver Lacey-Hall is the Senior Adviser on Partnerships and Communications for the Sunway Centre for Planetary Health at Sunway University. Previously he was Director of the UK's Humanitarian and Stabilisation Operations Team (HSOT), leading provision of humanitarian and stabilisation services to the UK Government by the Palladium Group.",
          "Prior roles include service with the United Nations Office for the Coordination of Humanitarian Affairs (OCHA) heading its regional office for Asia and the Pacific. He has 30 years' experience in humanitarian work, with an initial focus on refugee issues followed by coordination and communications work.",
        ],
      },
    ],
  },
  {
    groupLabel: "Communications",
    members: [
      {
        name: "Laila Wahidah Iskandar",
        initials: "LI",
        role: "Head of Communications",
        bio: [
          "Laila Iskandar is the Head of Communications at the Sunway Centre for Planetary Health, where she applies her expertise in public relations, digital marketing, and corporate communications to develop and execute the centre's communication strategy.",
          "She holds a Master's in Mass Communication from Universiti Teknologi MARA (2020) and a Bachelor's in Islamic Banking from the International Islamic University Malaysia (2014).",
        ],
      },
      {
        name: "Hamizah Norrizam",
        initials: "HN",
        role: "Communications Executive",
        bio: [
          "Hamizah is a skilled Social Media Manager renowned for her expertise in social media, holding a degree in Public Communications from the University of Technology, Sydney, Australia.",
          "She serves at the Sunway Centre for Planetary Health, overseeing prominent campaigns including Planet Saving Meals, Planetary Future Fridays, and Generation Green.",
        ],
      },
    ],
  },
  {
    groupLabel: "Policy & Strategic Advocacy",
    members: [
      {
        name: "Maisarah Faiesall",
        initials: "MF",
        role: "Head of Policy and Strategic Advocacy",
        bio: [
          "Maisarah Faiesall is a First-Class graduate of International Relations with Mandarin from the University of Nottingham, Malaysia, with experience in research and analysis, new media communications, and youth engagement in both the public and private sector.",
          "Previously, Maisarah served as a researcher to the Prime Minister of Malaysia's Public Health Advisor, working on public health and disaster risk reduction.",
        ],
      },
    ],
  },
  {
    groupLabel: "Programmes",
    members: [
      {
        name: "Nazia Ahmad",
        initials: "NA",
        role: "Programme Senior Manager",
        bio: [
          "Nazia is a qualified professional with a strong background in social work and human rights, completing her postgraduate studies in Social Work from Jamia Millia Islamia University in India.",
          "She has extensive experience working with the National Commission for Women (Government of India), and collaborations with German and Dutch organisations focused on capacity building and facilitation.",
        ],
      },
    ],
  },
  {
    groupLabel: "Knowledge & Learning",
    members: [
      {
        name: "Dr. Fatimah Ahmad",
        initials: "FA",
        role: "Chief Scientist",
        bio: [
          "Dr Fatimah Ahmad holds the position of Chief Scientist at the Sunway Centre for Planetary Health and is co-chairing the Programme Committee for the Planetary Health Summit. She obtained her PhD in Environmental Science from Universiti Kebangsaan Malaysia with a primary research interest in air quality.",
          "Her experience includes projects commissioned by the Department of Environment Malaysia and serving as Subject Matter Expert for the national Environmental Monitoring Program.",
        ],
      },
    ],
  },
  {
    groupLabel: "Other Team Members",
    members: [
      {
        name: "Zebo Khamraeva",
        initials: "ZK",
        role: "Special Assistant to Executive Director",
        bio: [
          "Zebo Khamraeva is the Special Assistant to the Executive Director at SCPH, skilled in managing complex schedules, coordinating high-stakes meetings, and stakeholder relationship management.",
          "She holds a First-Class Honours degree in International Business Management and a Master's in Management Psychology with Distinction from the University of Nottingham Malaysia.",
        ],
      },
      {
        name: "Dr. Noorul Ezyan Nor Hashim",
        initials: "NE",
        role: "Program Officer",
        bio: [
          "Dr Noorul Ezyan Nor Hashim is an ornithologist specialising in ecological and behavioural studies of birds, graduated from University of Malaya in 2021.",
          "She is a Research Analyst for Programme, Policy, and Advocacy at SCPH, managing youth engagement programmes aimed at empowering youth in planetary health movements.",
        ],
      },
      {
        name: "Siti Hannah",
        initials: "SH",
        role: "Education Officer",
        bio: [
          "Hannah is a Research Analyst at SCPH specialising in education, knowledge, and learning, developing educational programmes and resources for wide audience accessibility.",
          "Holding an MBBS degree from the University of Malaya, she has a versatile skill set spanning biological sciences, data science, advocacy, and interdisciplinary studies.",
        ],
      },
      {
        name: "Dr. Menaka Ganeson",
        initials: "MG",
        role: "Research Analyst",
        bio: [
          "Dr. Menaka is a Research & Innovation Officer at SCPH, identifying and exploring innovative ideas and research opportunities to create dynamic transformation in planetary health agendas.",
          "She received her Ph.D. in Plant Pathology from the University of Nottingham Malaysia Campus (2016) and was a Postdoctoral Researcher at Universiti Teknologi PETRONAS from 2017–2022.",
        ],
      },
      {
        name: "Dr. Nadia Nantheni Rajaram",
        initials: "NR",
        role: "Research Analyst",
        bio: [
          "Dr Nadia Rajaram is an epidemiologist with over 10 years of research experience, most notably designing the first clinical trial in Asia studying the relationship between soy consumption and breast cancer risk.",
          "She is currently a Post-Doctoral Research Fellow at SCPH, with research focused on nutrition, food insecurity, and its intersection with planetary health.",
        ],
      },
      {
        name: "Dr. Loo Yen Yi",
        initials: "LY",
        role: "Post Doctoral Research Fellow",
        bio: [
          "Dr. Loo Yen Yi is an ornithologist with research interests in animal behaviour and biodiversity conservation, holding a Doctoral degree in Biological Sciences from the University of Auckland.",
          "Her current appointment at SCPH explores the role of biodiversity conservation in planetary health, with research funded by The Habitat Foundation and Cornell University's Lab of Ornithology.",
        ],
      },
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
      {/* Anchor for navbar dropdown */}
      <div id="team" className="-mt-24 pt-24" />

      <div className="space-y-16">
        {teamGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {group.groupLabel && (
              <div className="mb-8 flex items-center gap-4">
                <h3 className="font-heading text-lg font-bold text-scph-dark-green">
                  {group.groupLabel}
                </h3>
                <div className="h-px flex-1 bg-scph-green/20" />
              </div>
            )}

            <div className="space-y-0">
              {group.members.map((member, memberIdx) => (
                <div
                  key={member.name}
                  className={`flex flex-col gap-8 md:flex-row md:gap-10 md:items-start ${
                    memberIdx < group.members.length - 1
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
                    <h4 className="font-heading text-xl font-bold text-scph-blue">
                      {member.name}
                    </h4>
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
      <OurFoundationSection />
      <OurStrategySection />
      <OurJourneySection />
      <MeetTheTeamSection />
    </>
  );
}
