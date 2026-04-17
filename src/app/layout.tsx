import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nandor Tamas — Director of Design",
  description:
    "Portfolio of Nandor Tamas, Director of Design specializing in AI, Platform, Systems, and Brand Experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} antialiased`}>
      <body
        className="min-h-screen"
        style={{ fontFamily: "var(--font-dm-sans), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
