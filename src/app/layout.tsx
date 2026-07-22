import type { Metadata, Viewport } from "next";
import { Archivo, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import { profile, SITE_URL } from "@/content/profile";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
  axes: ["wdth"],
});

const instrument = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "achyut.ops · 2 systems in production",
    template: "%s · achyut.ops",
  },
  description:
    "Achyut Anand Pandey, full-stack developer. Two live client platforms doing 100+ orders a day. This portfolio is the console I run them from.",
  keywords: [
    "Achyut Anand Pandey",
    "full-stack developer",
    "Next.js",
    "TypeScript",
    "Supabase",
    "Hyderabad",
  ],
  authors: [{ name: profile.name, url: SITE_URL }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "ACHYUT // CONTROL ROOM",
    description:
      "Full-stack developer. 2 systems in production, 100+ orders/day. Available immediately in Hyderabad, India.",
    siteName: "achyut.ops",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACHYUT // CONTROL ROOM",
    description:
      "Full-stack developer. 2 systems in production, 100+ orders/day. Available immediately in Hyderabad, India.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // One colour for every phone. The console boots dark regardless of the
  // device's own theme, and the browser paints this before first paint —
  // a light entry here is exactly the cream flash visitors reported.
  themeColor: "#131311",
};

/** Runs before paint: dark-first console — stored preference wins, else dark. */
const themeInit = `(function(){var d=document.documentElement;d.classList.add("js");try{var s=localStorage.getItem("cr-theme");d.setAttribute("data-theme",s==="light"?"light":"dark");}catch(e){d.setAttribute("data-theme","dark");}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="dark light" />
        <style>{`html{background:#131311;color-scheme:dark}html[data-theme="light"]{background:#f2efe7;color-scheme:light}`}</style>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
