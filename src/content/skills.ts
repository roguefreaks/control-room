/** TELEMETRY module data. Grouped readouts — never rendered as percentage bars. */
export type SkillGroup = { id: string; label: string; unit: string; items: string[] };

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "Languages",
    unit: "LANG",
    items: ["TypeScript", "JavaScript", "Python", "C++", "Java", "SQL"],
  },
  {
    id: "frontend",
    label: "Frontend",
    unit: "UI",
    items: [
      "Next.js 14/16 (App Router, Server Components)",
      "React",
      "Tailwind CSS",
      "Zustand",
      "Framer Motion",
      "PWA",
    ],
  },
  {
    id: "backend",
    label: "Backend & Database",
    unit: "CORE",
    items: [
      "Node.js",
      "PostgreSQL",
      "Supabase (RLS, Auth, Storage)",
      "REST APIs",
      "Server Actions",
      "Zod",
      "OAuth 2.0",
    ],
  },
  {
    id: "devops",
    label: "Cloud & DevOps",
    unit: "OPS",
    items: [
      "AWS",
      "Vercel",
      "GitHub Actions CI/CD",
      "Docker",
      "Git",
      "Vitest",
      "Web Push (VAPID)",
      "WhatsApp Business API",
    ],
  },
  {
    id: "ai-nlp",
    label: "AI / NLP",
    unit: "ML",
    items: ["HuggingFace Transformers", "spaCy", "Pandas", "NumPy", "Prompt Engineering"],
  },
  {
    id: "fundamentals",
    label: "CS Fundamentals",
    unit: "BASE",
    items: ["Data Structures & Algorithms", "OOP", "Operating Systems", "DBMS", "Compiler Design"],
  },
];
