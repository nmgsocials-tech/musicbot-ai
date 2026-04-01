import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MusicBot AI",
  description: "Search any song and instantly see its BPM, key, mode, and Camelot code.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
