
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConditionHealthy.com | Clinical Trial Finder",
  description: "Find high-paying clinical research studies and advanced treatment options near you.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
