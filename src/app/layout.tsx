import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";
import { ModeProvider } from "@/lib/mode/mode-context";

const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Anayo — Build Your AI Buddy",
  description:
    "Learn how AI really works by building your own AI buddy, one superpower at a time. For curious humans, age 8 to 88.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable} antialiased`}>
      <body>
        <div className="bg" />
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  );
}
