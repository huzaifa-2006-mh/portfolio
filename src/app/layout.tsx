import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Muhammad Huzaifa | Full-Stack & WordPress Developer",
  description: "Official portfolio of Muhammad Huzaifa - Full-Stack MERN & WordPress Developer based in Karachi, Pakistan. Building scalable web apps, custom themes, and digital solutions.",
  keywords: ["Muhammad Huzaifa", "Full Stack Developer", "MERN Stack", "WordPress Developer", "React", "Node.js", "Karachi", "Pakistan"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
        {children}
      </body>
    </html>
  );
}
