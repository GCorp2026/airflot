export type Tag = "Markets" | "DeFi" | "Fintech" | "Infrastructure";

export type Company = {
  id: string;
  index: string;
  name: string;
  tag: Tag;
  blurb: string;
};

export const companies: Company[] = [
  {
    id: "sentora",
    index: "01",
    name: "Sentora",
    tag: "DeFi",
    blurb: "Institutional yield, liquidity, and risk tooling for onchain markets.",
  },
  {
    id: "polymarket",
    index: "02",
    name: "Polymarket",
    tag: "Markets",
    blurb: "Prediction markets where people trade the outcome of real events.",
  },
  {
    id: "bitvault",
    index: "03",
    name: "BitVault",
    tag: "Infrastructure",
    blurb: "Bitcoin-backed stability infrastructure for onchain finance.",
  },
  {
    id: "infinifi",
    index: "04",
    name: "InfiniFi",
    tag: "DeFi",
    blurb: "Lending and yield primitives built on blockchain rails.",
  },
  {
    id: "niural",
    index: "05",
    name: "Niural",
    tag: "Fintech",
    blurb: "Global payroll and contractor payments for modern companies.",
  },
  {
    id: "circuit",
    index: "06",
    name: "Circuit",
    tag: "Infrastructure",
    blurb: "Security services for teams operating in digital finance.",
  },
  {
    id: "truvius",
    index: "07",
    name: "Truvius",
    tag: "Markets",
    blurb: "Portfolio management built for digital-asset allocators.",
  },
  {
    id: "caliza",
    index: "08",
    name: "Caliza",
    tag: "Fintech",
    blurb: "Cross-border payment rails for businesses moving real value.",
  },
  {
    id: "enhanced",
    index: "09",
    name: "Enhanced Digital Group",
    tag: "Markets",
    blurb: "Derivatives and structured products for digital markets.",
  },
  {
    id: "tread",
    index: "10",
    name: "Tread.fi",
    tag: "Markets",
    blurb: "Execution tools for serious digital-asset traders.",
  },
  {
    id: "altitude",
    index: "11",
    name: "Altitude",
    tag: "DeFi",
    blurb: "Onchain credit markets engineered to stay transparent.",
  },
  {
    id: "figure",
    index: "12",
    name: "Figure",
    tag: "Fintech",
    blurb: "Blockchain-native lending, including fully digital home equity.",
  },
];

export const tags: Array<"All" | Tag> = [
  "All",
  "Markets",
  "DeFi",
  "Fintech",
  "Infrastructure",
];

export const stats = [
  { n: "100 M+", l: "Assets Under Management" },
  { n: "2019", l: "Founded in 2019" },
  { n: "90%+", l: "First checks written in pre-seed/seed rounds" },
  { n: "100%", l: "Allocation to blockchain-focused companies & protocols" },
  { n: "30+", l: "Venture Investments" },
];

export type Person = {
  name: string;
  role: string;
  initials: string;
  bio: string;
};

export const team: Person[] = [
  {
    name: "Alex Marinier",
    role: "Founder & General Partner",
    initials: "AM",
    bio: "Alex founded New Form after leading blockchain investing at DCM Ventures and underwriting secondaries at Blackstone in New York. He has backed Polymarket, Figure, Sentora, and Niural, among others. A native New Yorker, he holds a BSc from Cornell’s SC Johnson College of Business.",
  },
  {
    name: "Jake Schwartz",
    role: "Venture Partner",
    initials: "JS",
    bio: "Jake focuses on firm strategy. He co-founded General Assembly and has been investing in blockchain since 2014, drawn to its ability to challenge concentrated internet power. He holds a BA from Yale and an MBA from Wharton.",
  },
  {
    name: "Matt Cooper",
    role: "Investment Partner",
    initials: "MC",
    bio: "Matthew founded Kraynos Capital, a pre-seed fund for blockchain startups. Before that he worked at the Maker Foundation and was a founding member of Etale Trading, later acquired by NYDIG. He holds a BA from UNC Chapel Hill.",
  },
  {
    name: "Connor Klein",
    role: "Investment Partner",
    initials: "CK",
    bio: "Connor joined from Morgan Stanley, where he covered consumer and retail banking, including the metaverse. He previously worked in growth at Halliday. He holds a BA in Economics from the University of Pennsylvania.",
  },
  {
    name: "Thomas Brophy",
    role: "VP of Finance",
    initials: "TB",
    bio: "Tom runs finance at the firm. He previously worked on the accounting team at Kennedy Lewis and as a senior fund accountant at Carta, serving seed-stage venture firms. He holds a BA in Economics from the University of Maryland.",
  },
  {
    name: "Chris Bae",
    role: "Entrepreneur-in-Residence",
    initials: "CB",
    bio: "Chris is an EIR and co-founder of portfolio company Enhanced Digital Group. He sat on the management and investment committee at UBS Hedge Fund Solutions and earlier led trading desks at Goldman Sachs and Merrill Lynch. He holds a BSc in Economics from MIT.",
  },
];
