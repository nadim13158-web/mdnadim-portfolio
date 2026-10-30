/* ============================================================
   MD NADIM KHONDOKAR — PORTFOLIO DATA
   ------------------------------------------------------------
   Ekhane SOB information 100% honest ache. Kono fake project,
   fake client review ba mithya number nai.

   Nijer information change korte chaile sudhu ei file edit korun.
   ============================================================ */

export const personal = {
  name: "Md Nadim Khondokar",
  firstName: "Md Nadim",
  lastName: "Khondokar",
  role: "Graphic Designer",
  roles: ["Graphic Designer", "Poster & Social Media Design", "Learning Front-end"],
  tagline:
    "I design posters, logos and social media content — and I'm learning to build my own designs for the web.",
  email: "nadim13158@gmail.com",
  location: "Bangladesh",
  availability: "Open for design work",
  bio: `I'm a graphic designer who loves clean typography, good colour and layouts that
  actually communicate. I started designing out of curiosity and kept going because I
  enjoyed it.`,
  socials: [
    { name: "Email", url: "message", icon: "mail" }, // opens the "Let's talk" message pop-up
    // Nicher link gulo ekhono khali. Nijer link dile boshaben:
    // GitHub  -> https://github.com/apnar-username
    // Facebook -> https://facebook.com/apnar-username
    // WhatsApp -> https://wa.me/8801XXXXXXXXX
    { name: "GitHub", url: "", icon: "github" },
    { name: "Facebook", url: "", icon: "facebook" },
    { name: "WhatsApp", url: "", icon: "whatsapp" },
  ],
};

/* ------------------------------------------------------------
   Honest numbers. Nijer real number boshaben.
   Jodi ekhono client kaj na kore thake, 0 rakhlei somossa nai —
   eta "learning journey" portfolio, eta shotti bole deya
   beshi belivable.
   ------------------------------------------------------------ */
export const stats = [
  { label: "Designs created", value: 0, suffix: "" },
  { label: "Real projects", value: 0, suffix: "" },
  { label: "Months designing", value: 0, suffix: "" },
  { label: "Tools learning", value: 6, suffix: "" },
];

export const services = [
  {
    icon: "design",
    title: "Poster & Flyer Design",
    description:
      "Event posters, flyers and cover designs built around strong typography and a clear focus point.",
    points: ["Event posters", "Flyers", "Covers"],
  },
  {
    icon: "social",
    title: "Social Media Design",
    description:
      "Post, story and thumbnail designs that follow one consistent visual style across a page.",
    points: ["Post designs", "Stories", "Thumbnails"],
  },
  {
    icon: "brand",
    title: "Simple Brand Marks",
    description:
      "Basic logo concepts, colour palettes and font pairings for a small business or personal page.",
    points: ["Logo concepts", "Colour palette", "Font pairing"],
  },
  {
    icon: "code",
    title: "Front-end (still learning)",
    description:
      "I'm a beginner. I can build a simple responsive page with HTML, CSS and a little React while I keep practising.",
    points: ["HTML & CSS", "Basic React", "This portfolio"],
  },
];

/* ------------------------------------------------------------
   Skill levels honestly marked. "Learning" group er gulo ekhono
   kom — eta shotti, ar shotti bolle kharap kichu na.
   ------------------------------------------------------------ */
export const skills = [
  { name: "Photoshop", level: 0, group: "Design tools" },
  { name: "Illustrator", level: 0, group: "Design tools" },
  { name: "Figma", level: 0, group: "Design tools" },
  { name: "Canva", level: 0, group: "Design tools" },
  { name: "HTML & CSS", level: 0, group: "Still learning" },
  { name: "JavaScript", level: 0, group: "Still learning" },
  { name: "React", level: 0, group: "Still learning" },
];

export const toolIcons = [
  "Photoshop",
  "Illustrator",
  "Figma",
  "Canva",
  "HTML",
  "CSS",
  "JavaScript",
  "React",
];

/* ------------------------------------------------------------
   PROJECTS
   Ekhono kono real client project nai, tai fake project gulo
   SOB delete kore dewa hoyeche. Nijer kaj guti add korar somoy
   niche format ta follow korun. "practice" tag dile bujhte
   parben eta practice work.
   ------------------------------------------------------------ */
export const projects: {
  title: string;
  description: string;
  tags: string[];
  live: string;
  code: string;
  year: string;
}[] = [
  // Nijer design add korle ekhane likhun, jemon:
  // {
  //   title: "Apnar design er naam",
  //   description: "Ki kaj chilo, ki banailen — duita line e",
  //   tags: ["Poster", "Practice"],
  //   live: "#",
  //   code: "#",
  //   year: "2026",
  // },
];

export const projectFilters = ["All", "Poster", "Branding", "Social Media", "Practice"];

/* ------------------------------------------------------------
   EXPERIENCE — honestly a beginner.
   ------------------------------------------------------------ */
export const experience = [
  {
    role: "Learning front-end development",
    company: "Self-taught, at home",
    period: "Started recently",
    description:
      "Learning HTML, CSS, JavaScript and React step by step. This portfolio is my first real web project — I built it, broke it and fixed it many times while learning.",
  },
  {
    role: "Learning graphic design",
    company: "Self-taught, at home",
    period: "Earlier",
    description:
      "Started with simple posters and social media designs in Canva and Photoshop, watching free tutorials and practising by recreating designs I liked.",
  },
];

export const education = [
  {
    degree: "Front-end development — self-taught",
    institute: "Free tutorials, documentation and practice projects",
    period: "Currently learning",
  },
  {
    degree: "Graphic design — self-taught",
    institute: "YouTube tutorials and daily practice",
    period: "Started my design journey",
  },
];

/* ------------------------------------------------------------
   TESTIMONIALS
   Fake client review gulo SOB remove kora hoyeche.
   Jokhon ashole kono client kaj korbe, tar review ekhane add
   korben — tokhon eta strong hobe. Er age porjonto section ta
   dekhabe "coming soon" message.
   ------------------------------------------------------------ */
export const testimonials: { name: string; role: string; quote: string }[] = [];

/* ------------------------------------------------------------
   Anyo fake information o chilo — oi gulo o remove kora hoyeche.
   Jodi apnar college/degree thake, ekhane add korte paren.
   ------------------------------------------------------------ */
