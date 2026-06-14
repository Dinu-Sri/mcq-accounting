import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SL Accounting MCQ - Practice Past Papers",
    template: "%s | SL Accounting MCQ",
  },
  description: "Practice Sri Lanka A/L Accounting past paper MCQs with timed quizzes and instant feedback.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background`}>
        <header className="border-b bg-card">
          <div className="mx-auto max-w-4xl px-4 h-14 flex items-center justify-between">
            <a href="/" className="font-bold text-lg">
              SL Accounting MCQ
            </a>
            <span className="text-xs text-muted-foreground">
              A/L Past Paper Practice
            </span>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
