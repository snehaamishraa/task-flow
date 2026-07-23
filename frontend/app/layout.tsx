import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const title = "TaskFlow — Manage Your Tasks Without the Chaos";
const description =
  "TaskFlow brings your boards, deadlines, and status updates into one fast workspace. Plan the sprint, automate the busywork, and keep everyone aligned.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | TaskFlow",
  },
  description,
  applicationName: "TaskFlow",
  keywords: [
    "task management",
    "project management",
    "team collaboration",
    "kanban board",
    "workflow automation",
  ],
  openGraph: {
    title,
    description,
    siteName: "TaskFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0a0a0b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark h-full scroll-smooth antialiased",
        inter.variable,
        geistMono.variable,
      )}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
