export type GtpHighlightSpeaker = {
  name: string;
  role: string;
  organisation: string;
  bio: string;
  session: string;
  sessionDate: string;
  photoSrc?: string;
  /** Optional extra programme slots (rendered in the modal when present). */
  sessions?: { title: string; date: string }[];
};

export const gtpHighlightSpeakers: GtpHighlightSpeaker[] = [
  {
    name: "Prof. Jeffrey Sachs",
    role: "Honorary Distinguished Jeffrey Cheah Professor",
    organisation: "Sunway University",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "H.E. Dato' Astanah Abdul Aziz",
    role: "Deputy Secretary-General (DSG) of ASEAN for Political-Security Community",
    organisation: "ASEAN",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Jaya Shreedhar",
    role: "Senior Health Media Advisor",
    organisation: "Internews",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Shweta Narayan",
    role: "Global Climate Health Alliance",
    organisation: "Global Climate Health and Alliance",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Cornelia C. Walther",
    role: "Senior Fellow",
    organisation: "Sunway Centre for Planetary Health",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
  {
    name: "Kirsten Dunlop",
    role: "Chief Executive Officer",
    organisation: "EIT Climate-KIC",
    bio: "Bio to be provided.",
    session: "Session to be announced",
    sessionDate: "Date & time to be announced",
  },
];
