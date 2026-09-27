export const EMAIL = "jamesbenedictpandio@gmail.com";
export const GITHUB = "https://github.com/jbpandio";
export const LINKEDIN = "https://www.linkedin.com/in/james-benedict-pandio-642317255/";
export const RESUME = "resume.pdf";

export type Project = {
  slug: string;
  title: string;
  desc: string;
  /** Screenshot under /public, e.g. "/work/ai-resume-optimizer.png". */
  image?: string;
  placeholder: string;
  meta: { k: string; v: string }[];
  sections: { h: string; b: string }[];
};

const TODO_META = [
  { k: "role", v: "[add role]" },
  { k: "stack", v: "[add stack]" },
  { k: "year", v: "[add year]" },
  { k: "links", v: "[add live / repo link]" },
];

const TODO_SECTIONS = [
  { h: "The problem", b: "[What problem does this solve, and for whom?]" },
  { h: "What I built", b: "[Architecture, key features, and stack decisions.]" },
  { h: "Result", b: "[Outcome: users, time saved, or what you learned.]" },
];

export const PROJECTS: Project[] = [
  {
    slug: "ai-resume-optimizer",
    title: "AI Resume Optimizer",
    desc: "Rewrites and tailors a resume to a specific job posting using AI.",
    placeholder: "Drop a screenshot of AI Resume Optimizer",
    meta: TODO_META,
    sections: TODO_SECTIONS,
  },
  {
    slug: "levy-gst-reconciliation",
    title: "Levy — GST Reconciliation",
    desc: "Matches and reconciles GST records so discrepancies surface automatically.",
    placeholder: "Drop a screenshot of Levy",
    meta: TODO_META,
    sections: TODO_SECTIONS,
  },
];

export const STACK: [string, string[]][] = [
  ["languages", ["JavaScript", "TypeScript"]],
  ["frontend", ["React", "Next.js", "Angular", "Vue", "Vite", "Tailwind"]],
  ["backend", ["Node.js", "Express", "Prisma"]],
  ["data", ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Firebase"]],
  ["cloud & tooling", ["Vercel", "Google Cloud", "Docker", "Git", "Playwright", "Postman"]],
  ["ai", ["Claude (Claude Code)", "OpenAI (Codex)", "Ollama"]],
];

export const SECTIONS = [
  { n: "01", id: "work", label: "work" },
  { n: "02", id: "stack", label: "stack" },
  { n: "03", id: "about", label: "about" },
  { n: "04", id: "contact", label: "contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];
