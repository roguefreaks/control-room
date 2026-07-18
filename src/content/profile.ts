/**
 * All personal facts. Sourced from Achyut's resume PDFs — edit here, never in components.
 */
export const profile = {
  name: "Achyut Anand Pandey",
  shortName: "Achyut",
  console: "ACHYUT // CONTROL ROOM",
  tagline: "I build and run these systems. When they break, I fix them.",
  role: "Full-stack developer",
  summary:
    "Sole developer of two live client platforms processing 100+ orders/day combined. B.Tech CSE (2026), 500+ DSA problems, AWS Certified Cloud Practitioner.",
  location: "Hyderabad, India",
  availability: "Available immediately",
  email: "achyutpandey018@gmail.com",
  phone: "+91-6203460603",
  links: {
    linkedin: "https://www.linkedin.com/in/achyut-pandey-02848032b",
    githubPrimary: "https://github.com/roguefreaks",
    githubFreelance: "https://github.com/SKY830-sudo",
  },
  /** Served from /public — replace the file to update the resume. */
  resumePath: "/Achyut_Anand_Pandey_Resume.pdf",
  resumeFileName: "Achyut_Anand_Pandey_Resume.pdf",
} as const;

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://achyut-control-room.vercel.app";
