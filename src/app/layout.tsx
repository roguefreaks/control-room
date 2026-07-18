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
    default: "achyut.ops — 2 systems in production",
    template: "%s · achyut.ops",
  },
  description:
    "Achyut Anand Pandey — full-stack developer running two live client platforms (100+ orders/day). This portfolio is the operations console.",
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
      "Full-stack developer. 2 systems in production, 100+ orders/day. Available immediately — Hyderabad, India.",
    siteName: "achyut.ops",
  },
  twitter: {
    card: "summary_large_image",
    title: "ACHYUT // CONTROL ROOM",
    description:
      "Full-stack developer. 2 systems in production, 100+ orders/day. Available immediately — Hyderabad, India.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2efe7" },
    { media: "(prefers-color-scheme: dark)", color: "#131311" },
  ],
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
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
