import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LexAI – AI-Powered Legal Document Automation",
  description:
    "Draft, review, and manage legal documents with the power of AI. Fast, secure, and trusted.",
  keywords: ["legal documents", "AI lawyer", "contract automation", "NDA", "legal tech"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
