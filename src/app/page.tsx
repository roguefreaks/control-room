import { ConsoleProvider } from "@/components/console/ConsoleProvider";
import { Boot } from "@/components/console/Boot";
import { StatusStrip } from "@/components/console/StatusStrip";
import { SectionObserver } from "@/components/console/SectionObserver";
import { CommandPalette } from "@/components/palette/CommandPalette";
import { Hero } from "@/components/modules/Hero";
import { Operations } from "@/components/modules/Operations";
import { Deployments } from "@/components/modules/Deployments";
import { Telemetry } from "@/components/modules/Telemetry";
import { AuditLog } from "@/components/modules/AuditLog";
import { Incidents } from "@/components/modules/Incidents";
import { Comms } from "@/components/modules/Comms";
import { DaySummary } from "@/components/modules/DaySummary";
import { getHealth } from "@/lib/health";
import { getDeployFeed } from "@/lib/github";
import { listSignals } from "@/lib/guestbook";
import { profile, SITE_URL } from "@/content/profile";

/** ISR: live data (health, deploy feed, signals) refreshes every 10 minutes. */
export const revalidate = 600;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  email: `mailto:${profile.email}`,
  url: SITE_URL,
  jobTitle: "Full-Stack Developer",
  address: { "@type": "PostalAddress", addressLocality: "Hyderabad", addressCountry: "IN" },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Graphic Era Deemed to be University",
  },
  sameAs: [
    profile.links.linkedin,
    profile.links.githubPrimary,
    profile.links.githubFreelance,
  ],
  knowsAbout: ["Next.js", "TypeScript", "React", "PostgreSQL", "Supabase", "Node.js"],
};

export default async function Page() {
  const [health, feed, signals] = await Promise.all([
    getHealth().catch(() => []),
    getDeployFeed().catch(() => []),
    listSignals().catch(() => null),
  ]);

  return (
    <ConsoleProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Boot />
      <StatusStrip />
      <SectionObserver />
      <main className="flex-1">
        <Hero health={health} />
        <Operations />
        <Deployments health={health} feed={feed} />
        <Telemetry />
        <AuditLog />
        <Incidents />
        <Comms initialSignals={signals} />
      </main>
      <DaySummary />
      <CommandPalette />
    </ConsoleProvider>
  );
}
