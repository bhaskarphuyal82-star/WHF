import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { unstable_noStore as noStore } from 'next/cache';

import { AuthProvider } from "@/components/Providers";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteSettingsProvider } from "@/components/SiteSettingsContext";
import connectDB from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  noStore();
  let siteName = "World Hindu Federation Nepal - WHF Nepal";
  let siteLogo = "/whf-logo.png";
  
  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    if (settings) {
      if (settings.siteName) siteName = settings.siteName;
      if (settings.siteLogo) siteLogo = settings.siteLogo;
    }
  } catch (error) {
    console.error("Failed to fetch site settings for metadata", error);
  }

  return {
    title: siteName,
    description: "World Hindu Federation Nepal is a non-profit advocacy organization dedicated to promoting Hindu values, culture, and community welfare in Nepal.",
    icons: {
      icon: siteLogo,
      shortcut: siteLogo,
      apple: siteLogo,
    },
    openGraph: {
      title: siteName,
      images: [
        {
          url: siteLogo,
          alt: siteName,
        }
      ]
    }
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  noStore();
  let settingsData = {};
  try {
    await connectDB();
    const settings = await SiteSettings.findOne().lean();
    if (settings) {
      settingsData = {
        siteName: settings.siteName,
        siteLogo: settings.siteLogo,
        chairmanName: settings.chairmanName,
        chairmanTitle: settings.chairmanTitle,
        chairmanSignature: settings.chairmanSignature,
      };
    }
  } catch (error) {
    console.error("Failed to fetch site settings in layout", error);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <SiteSettingsProvider initialSettings={settingsData}>
              {children}
            </SiteSettingsProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
