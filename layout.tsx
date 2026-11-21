import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeonWave | Online Cloud Music Streaming",
  description: "Full-Stack Music Streaming Web Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="dark">
      <body className={`${jakarta.className} bg-zinc-950 text-white antialiased overflow-hidden`}>
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}
