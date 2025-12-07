import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virus Spread Model | Differential Equations in Cybersecurity",
  description: "An interactive presentation exploring how differential equations model virus spread in computer networks using SIR and SIS epidemiological models.",
  keywords: ["differential equations", "virus spread", "cybersecurity", "SIR model", "SIS model", "malware", "network security"],
  authors: [{ name: "Differential Equations Presentation" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0a0a0f] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
