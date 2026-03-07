import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import GlobalModalManager from "@/components/GlobalModalManager";

import { SITE_CONFIG } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConditionHealthy.com | Clinical Trial Finder",
  description: "Find high-paying clinical research studies and advanced treatment options near you.",
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    google: "fwaLfQ5e7EPKJWcsStsdpSev9YQhWPmqwUDyKQg8EvM",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
