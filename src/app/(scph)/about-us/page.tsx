import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/shared/section-wrapper";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { getTeamMembers, type SanityTeamMember } from "@/sanity/queries";
import {
  getScphAboutPage,
  getScphMeetTheTeamPage,
  type ScphMeetTheTeamPageData,
} from "@/sanity/scph-pages";
import { RenderSectionBlocks } from "@/components/sections/render-section-block";
import { sectionBlocksMayRender } from "@/sanity/section-block-types";
import { cn } from "@/lib/utils";
import {
  IconCardGrid,
  type ScphWhiteLinkCardItem,
} from "@/components/sections/icon-card-grid";
import { ScphPageHero } from "@/components/sections/heroes";
import { TwoColumnTextImages } from "@/components/sections/two-column-text-images";
import {
  mergeScphAboutPageBands,
  splitParagraphs,
  type MergedAboutFoundation,
} from "@/sanity/scph-page-bands-merge";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Sunway Centre for Planetary Health—our mission, team, and how we advance planetary health through research and advocacy in Malaysia and the region.",
  alternates: { canonical: "/about-us" },
  openGraph: {
    title: "About Us | Sunway Centre for Planetary Health",
    description:
      "Mission, leadership, and planetary health impact at Sunway Centre for Planetary Health.",
    url: "/about-us",
  },
};

/** Refetch team (and page) from Sanity on every request — avoids stale Meet the Team data. */
export const revalidate = 300;

// ─── Our Foundation ───────────────────────────────────────────────────────────

function FoundationDiagramSlot({
  imageUrl,
  alt,
  caption,
}: {
  imageUrl: string | null;
  alt: string;
  caption: string;
}) {
  return (
    <div className="relative flex aspect-square flex-1 items-center justify-center overflow-hidden rounded-2xl bg-scph-blue/5 ring-1 ring-scph-blue/10">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 40vw"
        />
      ) : (
        <div
          className="absolute inset-4 rounded-xl bg-scph-blue/[0.06] ring-1 ring-dashed ring-scph-blue/15"
          aria-hidden
        />
      )}
      {caption ? (
        <span className="absolute bottom-2 text-xs font-medium text-gray-400">
          {caption}
        </span>
      ) : null}
    </div>
  );
}

function OurFoundationSection({ data }: { data: MergedAboutFoundation }) {
  const paragraphs = splitParagraphs(data.body);
  return (
    <SectionWrapper theme="scph" background="default">
      {/* Anchor for navbar dropdown */}
      <div id="foundation" className="-mt-24 pt-24" />
      <TwoColumnTextImages
        align="center"
        text={
          <>
            <div className="mb-4 flex items-center gap-3 text-scph-dark-green">
              <span className="h-px w-8 shrink-0 bg-current opacity-60" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em]">
                {data.eyebrow}
              </span>
            </div>
            <h2 className="font-heading text-4xl font-bold leading-tight text-scph-blue md:text-5xl">
              {data.heading}
            </h2>
            <div className="mt-4 h-1 w-20 rounded-full bg-scph-green" />
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className={cn(
                  i === 0
                    ? "mt-6 text-lg leading-relaxed text-gray-600"
                    : "mt-4 text-base leading-relaxed text-gray-500",
                )}
              >
                {p}
              </p>
            ))}
          </>
        }
        media={
          <div className="flex flex-col gap-4 lg:flex-row">
            <FoundationDiagramSlot
              imageUrl={data.image1Url}
              alt={data.image1Alt}
              caption={data.image1Caption}
            />
            <FoundationDiagramSlot
              imageUrl={data.image2Url}
              alt={data.image2Alt}
              caption={data.image2Caption}
            />
          </div>
        }
      />
    </SectionWrapper>
  );
}

// ─── Our Strategy ─────────────────────────────────────────────────────────────

function OurStrategySection({
  sectionTitle,
  sectionSubtitle,
  introBody,
  cards,
}: {
  sectionTitle: string;
  sectionSubtitle: string;
  introBody: string;
  cards: ScphWhiteLinkCardItem[];
}) {
  const introParas = splitParagraphs(introBody);
  return (
    <SectionWrapper
      title={sectionTitle}
      subtitle={sectionSubtitle}
      theme="scph"
      background="muted"
    >
      {/* Anchor for navbar dropdown */}
      <div id="strategy" className="-mt-24 pt-24" />
      <div className="mb-10 max-w-3xl">
        {introParas.map((p, i) => (
          <p
            key={i}
            className={cn(
              i === 0
                ? "text-lg leading-relaxed text-gray-600"
                : "mt-4 text-base leading-relaxed text-gray-500",
            )}
          >
            {p}
          </p>
        ))}
      </div>

      <IconCardGrid
        variant="scph-white-link"
        gridClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        items={cards}
      />
    </SectionWrapper>
  );
}

// ─── Our Journey ──────────────────────────────────────────────────────────────

function OurJourneySection({
  sectionTitle,
  sectionSubtitle,
  placeholderTitle,
  placeholderBody,
}: {
  sectionTitle: string;
  sectionSubtitle: string;
  placeholderTitle: string;
  placeholderBody: string;
}) {
  return (
    <SectionWrapper
      title={sectionTitle}
      subtitle={sectionSubtitle}
      theme="scph"
      background="default"
    >
      {/* Anchor for potential future use */}
      <div id="journey" className="-mt-24 pt-24" />
      {/* Timeline content — pending slides 7 & 8 from the SCPH team */}
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border-2 border-dashed border-scph-blue/15 bg-scph-blue/3 p-10 text-center">
        <div>
          <p className="text-base font-medium text-scph-blue/60">
            {placeholderTitle}
          </p>
          <p className="mt-2 text-sm text-gray-400">{placeholderBody}</p>
        </div>
      </div>
    </SectionWrapper>
  );
}

// ─── Meet the Team ────────────────────────────────────────────────────────────

interface TeamMember {
  name: string;
  initials?: string;
  role: string;
  bio: string[];
  image?: string;
  /** Optional `object-*` / scale classes for portrait crops (default `object-top`). */
  imageClassName?: string;
  email?: string;
}

interface TeamGroup {
  groupLabel?: string;
  members: TeamMember[];
}

const teamGroups: TeamGroup[] = [
  // ── Leadership ────────────────────────────────────────────────────────────
  {
    members: [
      {
        name: "Tan Sri Prof. Dr. Jemilah Mahmood",
        initials: "TJ",
        role: "Executive Director",
        image: "/images/scph/team/professor-tan-sri-dr-jemilah-mahmood.png",
        imageClassName:
          "object-[50%_22%] scale-[1.48] origin-[50%_6%]",
        email: "jemilah@sunway.edu.my",
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

  // ── Policy & Strategic Advocacy ───────────────────────────────────────────
  {
    groupLabel: "Policy & Strategic Advocacy",
    members: [
      {
        name: "Maisarah Faiesall",
        initials: "MF",
        role: "Head of Policy and Strategic Advocacy",
        image: "/images/scph/team/saidatul-maisarah-faiesall-binti-ahmad-faiesall.jpg",
        email: "maisarahf@sunway.edu.my",
        bio: [
          "Maisarah Faiesall is a First-Class graduate of International Relations with Mandarin from the University of Nottingham, Malaysia, with experience in research and analysis, new media communications, and youth engagement in both the public and private sector.",
          "Previously, Maisarah served as a researcher to the Prime Minister of Malaysia's Public Health Advisor, working on public health and disaster risk reduction.",
        ],
      },
      {
        name: "Maneesha Kaur Khalae",
        initials: "MK",
        role: "Senior Executive – Policy, Strategy & Advocacy",
        image: "/images/scph/team/maneesha-kaur-khalae.jpg",
        email: "maneeshak@sunway.edu.my",
        bio: [
          "Maneesha is a recent master's graduate from Johns Hopkins University SAIS, with a concentration in Development, Climate and Sustainability and a bachelor's degree in economics and International Relations from Boston University. She has a range of experience in international development, non-profit and academia roles and is deeply passionate about climate policy and history.",
        ],
      },
      {
        name: "Aina Aaliyah",
        initials: "AA",
        role: "Executive – Policy, Strategy & Advocacy",
        image: "/images/scph/team/aina-aaliyah.jpg",
        email: "ainaaaliyahk@sunway.edu.my",
        bio: [
          "Aina Aaliyah is the Policy, Strategy and Advocacy Executive at the Sunway Centre for Planetary Health, where she leads the Global Health Governance as a Public Service (GHGAPS) program. She actively seeks to bridge youth voices to diplomacy, translating grassroots' insights into policy with a focus on climate resilience and planetary health.",
          "Aina holds a Bachelor's degree in International and Strategic Studies from Universiti Malaya, minoring in Southeast Asian Studies. She is an alumna of the YSEALI fellowship and small grants program, currently leading Little Green Dots, a rewilding pilot project in Hat Yai, Thailand.",
          "Her advocacy is rooted in art-ivism, fossil-free living, and urban rejuvenation — championing green infrastructure, placemaking, and public transportation. She strives to make planetary health accessible and a lived reality to all beyond the Klang Valley.",
        ],
      },
      {
        name: "Matthew Carvalho",
        initials: "MC",
        role: "Adjunct Research Fellow – Global Governance and Diplomacy",
        image: "/images/scph/team/matthew-carvalho.jpg",
        email: "matthewpc@sunway.edu.my",
        bio: [
          "Matthew Carvalho is the Adjunct Research Fellow in Global Governance and Diplomacy at the Sunway Centre for Planetary Health, a joint position he holds with the O'Neill Institute for National and Global Health Law at Georgetown University Law Center in Washington, DC. Matthew is a researcher of public international law and the first youth delegate of the United States of America to the World Health Assembly.",
          "Specializing in law, governance, and diplomacy for planetary health, Matthew has worked in the global health governance field, including for the United States Congress and the Department of Health and Human Services. He served as the inaugural policy fellow for the Planetary Health Alliance, and maintains an associate fellowship with the Centre for International Sustainable Development Law.",
          "He is also the co-chair of the newly established Global Health Law Committee of the American Branch of the International Law Association, and co-founder of the Global Health Governance as Public Service (GHGAPS) program. He is currently pursuing his law degree as part of Georgetown Law's evening program.",
        ],
      },
    ],
  },

  // ── Knowledge & Learning ──────────────────────────────────────────────────
  {
    groupLabel: "Knowledge & Learning",
    members: [
      {
        name: "Dr. Fatimah Ahmad",
        initials: "FA",
        role: "Chief Scientist",
        image: "/images/scph/team/dr-fatimah-ahamad.jpg",
        email: "fatimaha@sunway.edu.my",
        bio: [
          "Dr Fatimah Ahmad holds the position of Chief Scientist at the Sunway Centre for Planetary Health and is co-chairing the Programme Committee for the Planetary Health Summit. She obtained her PhD in Environmental Science from Universiti Kebangsaan Malaysia with a primary research interest in air quality.",
          "Her experience includes projects commissioned by the Department of Environment Malaysia and serving as Subject Matter Expert for the national Environmental Monitoring Program.",
        ],
      },
      {
        name: "Dr. Loo Yen Yi",
        initials: "LY",
        role: "Post Doctoral Research Fellow",
        image: "/images/scph/team/dr-loo-yen-yi.jpg",
        email: "yenyil@sunway.edu.my",
        bio: [
          "Dr. Loo Yen Yi is an ornithologist with research interests in animal behaviour and biodiversity conservation, holding a Doctoral degree in Biological Sciences from the University of Auckland.",
          "Her current appointment at SCPH explores the role of biodiversity conservation in planetary health, with research funded by The Habitat Foundation and Cornell University's Lab of Ornithology.",
        ],
      },
      {
        name: "Dr. Noorul Ezyan Nor Hashim",
        initials: "NE",
        role: "Program Officer",
        image: "/images/scph/team/dr-noorul-ezyan-binti-nor-hashim.jpg",
        email: "ezyanh@sunway.edu.my",
        bio: [
          "Dr Noorul Ezyan Nor Hashim is an ornithologist specialising in ecological and behavioural studies of birds, graduated from University of Malaya in 2021.",
          "She is a Research Analyst for Programme, Policy, and Advocacy at SCPH, managing youth engagement programmes aimed at empowering youth in planetary health movements.",
        ],
      },
      {
        name: "Aiza Nadira Shahrizal",
        initials: "AN",
        role: "Research Analyst – Climate and Health",
        image: "/images/scph/team/aiza-nadira-shahrizal.jpg",
        email: "aizanadiras@sunway.edu.my",
        bio: [
          "Aiza Nadira is a research analyst at the Sunway Centre for Planetary Health, where she supports projects at the intersection of sustainability, climate and health. With a background in clinical research and a master's degree in infectious disease from the University of Glasgow, she brings a strong foundation in scientific inquiry and project design.",
          "Aiza's work spans data-driven research, stakeholder engagement, and knowledge translation. Passionate about bridging science and policy, she contributes to evidence-based initiatives that promote planetary well-being and sustainable futures.",
        ],
      },
      {
        name: "Siti Hannah",
        initials: "SH",
        role: "Education Officer",
        image: "/images/scph/team/siti-hannah-zuhairah-binti-mohamad-ariff.jpg",
        email: "sitihannah@sunway.edu.my",
        bio: [
          "Hannah is a Research Analyst at SCPH specialising in education, knowledge, and learning, developing educational programmes and resources for wide audience accessibility.",
          "Holding an MBBS degree from the University of Malaya, she has a versatile skill set spanning biological sciences, data science, advocacy, and interdisciplinary studies.",
        ],
      },
      {
        name: "Sharifah Husna binti Syed Zainal Yussof",
        initials: "SHu",
        role: "Executive – Science Communications and Advocacy",
        image: "/images/scph/team/sharifah-husna-binti-syed-zainal-yussof.jpg",
        email: "sharifahzy@sunway.edu.my",
        bio: [
          "Husna is an Executive in Science Communications and Advocacy at the Sunway Centre for Planetary Health, where she skillfully translates complex science into compelling narratives. She also serves as the dedicated project lead for Ipoh Doughnut Economics, helping the city aim for that sweet spot of social and ecological well-being.",
          "Her foundation is solid, with a Bachelor's degree in Urban and Regional Planning and a Master of Science in Built Environment, focused on indicators for environmental resilience. Her current passions revolve around studies on healthy and sustainable cities.",
        ],
      },
      {
        name: "Alaa' Binti Zain Al-Aabideen",
        initials: "AB",
        role: "Research Analyst",
        image: "/images/scph/team/alaa-binti-zain-al-aabideen.jpg",
        email: "alaaz@sunway.edu.my",
        bio: [
          "As a public health enthusiast and healthcare professional, Alaa' is on a mission to create a healthier future for both people and the planet. With years of experience in clinical practice, working with Malaysia's Ministry of Health and private general practices, Alaa' has dedicated her career to delivering compassionate, quality care to diverse communities.",
          "Beyond the clinic, Alaa' channels her passion into health promotion initiatives and writing, advocating for sustainable practices and holistic well-being. Whether through patient care or storytelling, Alaa's goal is to inspire positive change for a healthier, more equitable world.",
        ],
      },
    ],
  },

  // ── Programmes ────────────────────────────────────────────────────────────
  {
    groupLabel: "Programmes",
    members: [
      {
        name: "Nazia Ahmad",
        initials: "NA",
        role: "Programme Senior Manager",
        image: "/images/scph/team/nazia-ahmad.jpg",
        email: "naziaa@sunway.edu.my",
        bio: [
          "Nazia is a qualified professional with a strong background in social work and human rights, completing her postgraduate studies in Social Work from Jamia Millia Islamia University in India.",
          "She has extensive experience working with the National Commission for Women (Government of India), and collaborations with German and Dutch organisations focused on capacity building and facilitation.",
        ],
      },
      {
        name: "Hanis Azemi",
        initials: "HA",
        role: "Programme Executive",
        bio: ["Bio coming soon."],
      },
      {
        name: "Damia Munira",
        initials: "DM",
        role: "Programme Executive",
        bio: ["Bio coming soon."],
      },
      {
        name: "Nurul Hamizah binti Nor Ahmad Kefli",
        initials: "NH",
        role: "Executive – Project Coordinator",
        image: "/images/scph/team/nurul-hamizah-binti-nor-ahmad-kefli.jpg",
        email: "hamizahk@sunway.edu.my",
        bio: [
          "Nurul Hamizah Kefli is a dedicated Project Coordinator Officer at the Sunway Centre for Planetary Health, where she plays a central role in advancing the Ipoh Doughnut Economics initiative, an internationally recognised project that earned Majlis Bandaraya Ipoh the 2024 UN-Habitat Scroll of Honour.",
          "Her leadership spans event execution, stakeholder alignment, and project management, ensuring meaningful outcomes across multidisciplinary teams. Her work reflects a deep commitment to driving sustainable transformation and positioning Ipoh as a model city for inclusive, climate-resilient growth.",
        ],
      },
      {
        name: "Misfahulhairah Binti Shariff",
        initials: "MS",
        role: "Research Assistant",
        image: "/images/scph/team/misfahulhairah-binti-shariff.jpg",
        email: "hairahs@sunway.edu.my",
        bio: [
          "Misfahulhairah Shariff is a Research Assistant at the Sunway Centre for Planetary Health, where she supports the Centre's mission to advance research, education, and action at the intersection of human and planetary well-being. She also serves as a Project Assistant for the Regional Hub for Asia Climate Change and Health (REACH) project.",
          "She holds a Master of Science in Molecular Biology and Genetic Engineering from Universiti Putra Malaysia and brings experience in laboratory research, scientific documentation, and programme coordination. Passionate about health and sustainability, she is dedicated to advancing research that promotes healthier people and a more resilient planet.",
        ],
      },
      {
        name: "Nor Wahyuni Binti Abdull Rahim",
        initials: "NW",
        role: "Executive – Administration",
        image: "/images/scph/team/nor-wahyuni-binti-abdull-rahim.jpg",
        email: "wahyuniar@sunway.edu.my",
        bio: [
          "Nor Wahyuni Binti Abdull Rahim is a graduate of Universiti Teknologi MARA (UiTM), Shah Alam, holding a Bachelor's degree in Mass Communication with a major in Publishing. She brings over 11 years of experience in administrative roles across academic and non-academic settings.",
          "Her interest in planetary health was sparked by her involvement in Go Green initiatives and community engagement. She has actively contributed to several planetary health-related events, including PHAM2025, MOHE workshops, and Journalist Training programs.",
        ],
      },
      {
        name: "Mohd Shahrul Aziezan bin Abdul Aziz",
        initials: "SA",
        role: "Executive – Administration",
        image: "/images/scph/team/mohd-shahrul-aziezan-bin-abdul-aziz.jpg",
        email: "aziezanaa@sunway.edu.my",
        bio: [
          "Mohd Shahrul Aziezan is an Executive in Administration with a diverse professional background spanning Hotel, Telecommunications, Media and Broadcast, Operations, Customer Service, and Public Service in Psychology and Law.",
          "A graduate of Universiti Teknologi MARA (UiTM) with a Diploma in Hotel and Tourism Management, Shahrul Aziezan brings a unique blend of organisational, interpersonal, and analytical skills to his role. Driven by a strong commitment to excellence and continuous learning, he is dedicated to contributing meaningfully to the efficiency and growth of his organisation.",
        ],
      },
    ],
  },

  // ── Communications ────────────────────────────────────────────────────────
  {
    groupLabel: "Communications",
    members: [
      {
        name: "Laila Wahidah Iskandar",
        initials: "LI",
        role: "Head of Communications",
        image: "/images/scph/team/laila-iskandar.jpg",
        email: "lailai@sunway.edu.my",
        bio: [
          "Laila Iskandar is the Head of Communications at the Sunway Centre for Planetary Health, where she applies her expertise in public relations, digital marketing, and corporate communications to develop and execute the centre's communication strategy.",
          "She holds a Master's in Mass Communication from Universiti Teknologi MARA (2020) and a Bachelor's in Islamic Banking from the International Islamic University Malaysia (2014).",
        ],
      },
      {
        name: "Hamizah Norrizam",
        initials: "HN",
        role: "Communications Executive",
        image: "/images/scph/team/hamizah-norrizam.jpg",
        email: "hamizahn@sunway.edu.my",
        bio: [
          "Hamizah is a skilled Social Media Manager renowned for her expertise in social media, holding a degree in Public Communications from the University of Technology, Sydney, Australia.",
          "She serves at the Sunway Centre for Planetary Health, overseeing prominent campaigns including Planet Saving Meals, Planetary Future Fridays, and Generation Green.",
        ],
      },
      {
        name: "Aina Masturina",
        initials: "AM",
        role: "Executive – Communications",
        image: "/images/scph/team/aina-masturina.jpg",
        email: "ainamasturina@sunway.edu.my",
        bio: [
          "Aina Masturina holds a Bachelor (Hons) in Corporate Communications and a Diploma in Computer Systems and Networking, blending her expertise in digital communication and technology with a strong foundation in strategic messaging. She began her career at 1 Utama Shopping Centre, where she spent three years as a Public Relations and Sustainability Executive.",
          "Currently serving as a Communications Executive at the Sunway Centre for Planetary Health, Aina is driven by a deep commitment to raising awareness on environmental and social issues, and aspires to leverage digital storytelling to inspire collective action towards a healthier, more sustainable planet.",
        ],
      },
      {
        name: "Nurul Nadia Radzif",
        initials: "NN",
        role: "Executive – Communications",
        image: "/images/scph/team/nurul-nadia-radzif.jpg",
        email: "nadiarad@sunway.edu.my",
        bio: [
          "Nadia is a Communications Executive and Graphic Designer at the Sunway Centre for Planetary Health, where she leads the creative direction for the organisation's visual communications and branding initiatives.",
          "A graduate of Management & Science University, Nadia was awarded the Best Student Award in her major, Graphic Design. With a deep passion for visual storytelling, she transforms complex ideas into impactful visuals that resonate with diverse audiences.",
        ],
      },
      {
        name: "Radin Nasuha Radin Shamsulkamar",
        initials: "RN",
        role: "Executive – Communications",
        bio: ["Bio coming soon."],
      },
    ],
  },

  // ── Other Team Members ────────────────────────────────────────────────────
  {
    groupLabel: "Other Team Members",
    members: [
      {
        name: "Zebo Khamraeva",
        initials: "ZK",
        role: "Special Assistant to Executive Director",
        image: "/images/scph/team/zebo-khamraeva.jpg",
        email: "zebok@sunway.edu.my",
        bio: [
          "Zebo Khamraeva is the Special Assistant to the Executive Director at SCPH, skilled in managing complex schedules, coordinating high-stakes meetings, and stakeholder relationship management.",
          "She holds a First-Class Honours degree in International Business Management and a Master's in Management Psychology with Distinction from the University of Nottingham Malaysia.",
        ],
      },
    ],
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

const SANITY_GROUP_CONFIG = [
  {value: "leadership",                   label: undefined},
  {value: "policy-and-strategic-advocacy", label: "Policy & Strategic Advocacy"},
  {value: "knowledge-and-learning",        label: "Knowledge & Learning"},
  {value: "programmes",                   label: "Programmes"},
  {value: "communications",               label: "Communications"},
  {value: "other",                        label: "Other Team Members"},
];

function SanityMemberRow({ member, isLast }: { member: SanityTeamMember; isLast: boolean }) {
  const bioParagraphs = member.bio ? member.bio.split(/\n\n+/) : [];
  return (
    <div
      className={`flex flex-col gap-8 md:flex-row md:gap-10 md:items-start ${
        !isLast ? "border-b border-gray-100 pb-10 mb-10" : ""
      }`}
    >
      <div className="flex shrink-0 justify-center md:justify-start">
        <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl bg-scph-blue/8 ring-1 ring-scph-blue/15 md:h-44 md:w-44">
          {member.imageUrl ? (
            <Image
              src={member.imageUrl}
              alt={member.name}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 144px, 176px"
            />
          ) : (
            <span className="font-heading text-2xl font-bold text-scph-blue">
              {getInitials(member.name)}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1">
        <h4 className="font-heading text-xl font-bold text-scph-blue">{member.name}</h4>
        <p className="mt-1 text-sm font-semibold text-scph-dark-green">{member.title}</p>
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="mt-0.5 block text-xs text-gray-400 transition-colors hover:text-scph-blue"
          >
            {member.email}
          </a>
        )}
        {bioParagraphs.length > 0 && (
          <div className="mt-3 space-y-3">
            {bioParagraphs.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-gray-600">{para}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MeetTheTeamSection({
  sanityMembers,
  meetChrome,
}: {
  sanityMembers: SanityTeamMember[];
  meetChrome: ScphMeetTheTeamPageData | null;
}) {
  const hasSanityData = sanityMembers.length > 0;

  const sanityGroups = SANITY_GROUP_CONFIG.map(({value, label}) => ({
    label,
    members: sanityMembers.filter((m) => m.group === value),
  })).filter((g) => g.members.length > 0);

  const sectionTitle =
    meetChrome?.sectionTitle?.trim() || "Meet the Team";
  const sectionSubtitle =
    meetChrome?.sectionSubtitle?.trim() || "Our Team";
  const introBlurb = meetChrome?.introBlurb?.trim();
  const showGetInvolved = meetChrome?.showGetInvolvedCta !== false;

  return (
    <SectionWrapper
      title={sectionTitle}
      subtitle={sectionSubtitle}
      theme="scph"
      background="default"
    >
      {/* Anchor for navbar dropdown */}
      <div id="team" className="-mt-24 pt-24" />

      {introBlurb ? (
        <p className="mx-auto mb-10 max-w-3xl text-center text-base leading-relaxed text-gray-600">
          {introBlurb}
        </p>
      ) : null}

      {hasSanityData ? (
        <div className="space-y-16">
          {sanityGroups.map(({label, members}) => (
            <div key={label ?? "leadership"}>
              {label && (
                <div className="mb-8 flex items-center gap-4">
                  <h3 className="font-heading text-lg font-bold text-scph-dark-green">{label}</h3>
                  <div className="h-px flex-1 bg-scph-green/20" />
                </div>
              )}
              <div>
                {members.map((member, i) => (
                  <SanityMemberRow key={member._id} member={member} isLast={i === members.length - 1} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                    <div className="flex shrink-0 justify-center md:justify-start">
                      <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-2xl bg-scph-blue/8 ring-1 ring-scph-blue/15 md:h-44 md:w-44">
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className={cn(
                              "object-cover",
                              member.imageClassName ?? "object-top",
                            )}
                          />
                        ) : (
                          <span className="font-heading text-2xl font-bold text-scph-blue">
                            {member.initials}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-heading text-xl font-bold text-scph-blue">
                        {member.name}
                      </h4>
                      <p className="mt-1 text-sm font-semibold text-scph-dark-green">
                        {member.role}
                      </p>
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="mt-0.5 block text-xs text-gray-400 transition-colors hover:text-scph-blue"
                        >
                          {member.email}
                        </a>
                      )}
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
      )}

      {showGetInvolved ? (
        <div className="mt-14 text-center">
          <MagneticButton>
            <Button variant="scphSecondary" size="lg" asChild>
              <Link href="/network">
                Get Involved <ArrowRight />
              </Link>
            </Button>
          </MagneticButton>
        </div>
      ) : null}
    </SectionWrapper>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutUsPage() {
  const [sanityMembers, aboutCms, meetCms] = await Promise.all([
    getTeamMembers().catch(() => []),
    getScphAboutPage().catch(() => null),
    getScphMeetTheTeamPage().catch(() => null),
  ]);

  const aboutBands = mergeScphAboutPageBands(aboutCms);
  const aboutSections = aboutBands.sections;
  const showOptionalAboutCms = sectionBlocksMayRender(aboutSections);

  return (
    <>
      <ScphPageHero
        variant="forest-overlay"
        eyebrow="About Us"
        title="About Sunway Centre for Planetary Health"
      />
      <OurFoundationSection data={aboutBands.foundation} />
      <OurStrategySection
        sectionTitle={aboutBands.strategy.sectionTitle}
        sectionSubtitle={aboutBands.strategy.sectionSubtitle}
        introBody={aboutBands.strategy.introBody}
        cards={aboutBands.strategy.cards}
      />
      <OurJourneySection
        sectionTitle={aboutBands.journey.sectionTitle}
        sectionSubtitle={aboutBands.journey.sectionSubtitle}
        placeholderTitle={aboutBands.journey.placeholderTitle}
        placeholderBody={aboutBands.journey.placeholderBody}
      />
      {showOptionalAboutCms ? (
        <RenderSectionBlocks blocks={aboutSections} />
      ) : null}
      <MeetTheTeamSection
        sanityMembers={sanityMembers}
        meetChrome={meetCms}
      />
    </>
  );
}
