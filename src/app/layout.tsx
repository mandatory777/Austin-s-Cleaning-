import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import BottomNav from "@/components/BottomNav";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Pulse — Your Health & Fitness Companion",
  description: "All-in-one health and fitness app with smart meal planning, workout tracking, recovery monitoring, and food journaling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <AppProvider>
          <main className="min-h-screen max-w-lg mx-auto bg-white shadow-sm">
            {children}
          </main>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
