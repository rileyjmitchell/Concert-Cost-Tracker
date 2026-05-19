import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Concert Cost Tracker",
  description: "Track concert costs, fun ratings, and value across your shows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="valentine" suppressHydrationWarning>
      <body
        className={`${inter.className} ${jakarta.variable} antialiased min-h-screen bg-base-100 font-sans`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
