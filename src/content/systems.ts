/** The two production systems (freelance work). Facts from the resume PDF. */
export type ProductionSystem = {
  id: string;
  ticket: string;
  name: string;
  what: string;
  url: string;
  stack: string[];
  highlights: string[];
};

export const client = {
  name: "Subhash Chand Multi-Speciality Hospital",
  place: "Deoria, India",
  role: "Freelance Full-Stack Developer",
  period: "Since Mar 2026",
  mode: "Remote · sole developer",
} as const;

export const systems: ProductionSystem[] = [
  {
    id: "prabhu-dana-pani",
    ticket: "SYS-01",
    name: "Prabhu Dana Pani",
    what: "Canteen ordering and operations for a hospital: online, POS and dine-in orders, in English and Hindi.",
    url: "https://prabhu-dana-pani.vercel.app",
    stack: ["Next.js 14", "React 18", "TypeScript", "PostgreSQL", "Supabase"],
    highlights: [
      "40+ table PostgreSQL schema with Row-Level Security and 41 versioned migrations",
      "Server-side authoritative pricing and a transition-gated order state machine",
      "POS with split billing and KOT printing, live kitchen queue, 18-section admin portal (inventory, payroll, FSSAI reporting)",
      "RBAC with TOTP 2FA, Web Push (VAPID/PWA), UPI payment flows",
    ],
  },
  {
    id: "cascade-coal",
    ticket: "SYS-02",
    name: "Cascade & Coal",
    what: "Laundry management for the hospital's garment care unit: 30 screens across customer, staff POS and admin portals.",
    url: "https://cascade-coal-delta.vercel.app",
    stack: ["Next.js 16", "React 19", "TypeScript", "Supabase", "Vercel"],
    highlights: [
      "3-tier authentication: Google OAuth + HMAC-signed sessions with brute-force lockouts",
      "Edge rate limiting, CSP/HSTS hardening, India DPDP Act compliance (consent, data export, right to erasure)",
      "QR bag tags with in-browser camera scanning, weight-photo proof uploads, SLA tracking, WhatsApp order notifications",
      "CI/CD with GitHub Actions + Vitest, health checks, automated backups, zero-downtime Vercel deploys",
    ],
  },
];

/** Smaller resume projects, shown as secondary "lab experiments". */
export type LabExperiment = {
  id: string;
  name: string;
  what: string;
  stack: string[];
  date?: string;
};

export const experiments: LabExperiment[] = [
  {
    id: "pseudo-compiler",
    name: "Pseudo-Code Compiler",
    what: "Compiler in Python (SLY) translating pseudocode into executable Python via lexical and syntax analysis.",
    stack: ["Python", "SLY", "Automata Theory"],
    date: "May 2025",
  },
  {
    id: "nlp-summarizer",
    name: "Text Summarization with NLP",
    what: "Extractive (spaCy) + abstractive (HuggingFace transformer) pipeline summarizing long documents, with evaluation for coherence.",
    stack: ["Python", "HuggingFace", "spaCy"],
    date: "Jan 2025",
  },
  {
    id: "iv-monitor",
    name: "IoT IV Fluid Monitoring",
    what: "ESP32 firmware that automates IV fluid monitoring with real-time alerts. Won 2nd Runner-Up at an international hackathon with 500+ teams.",
    stack: ["C++", "ESP32", "IoT"],
    date: "Jul 2025",
  },
  {
    id: "lane-detection",
    name: "Real-Time Lane Detection",
    what: "OpenCV perception module detecting road lanes in video using Canny edge detection and Hough transforms, running in real time.",
    stack: ["Python", "OpenCV"],
    date: "Aug 2024",
  },
];
