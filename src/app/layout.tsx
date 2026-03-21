import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

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
      <body className={`${geistSans.variable} font-sans antialiased`} style={{ background: '#e0e5ec', color: '#4b5563' }}>
        <AppProvider>
          <AuthGuard>
            <main className="min-h-screen max-w-lg md:max-w-2xl mx-auto">
              {children}
            </main>
            <BottomNav />
          </AuthGuard>
        </AppProvider>
      </body>
    </html>
  );
}
