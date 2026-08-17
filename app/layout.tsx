import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import GoogleAnalytics from "../page_components/GoogleAnalytics";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "vSpringboard | Master New Skills Online",
  description:
    "Join 42,000+ learners on vSpringboard. Discover tailored courses in tech, design, and more — learn at your own pace with expert instructors.",

  keywords: [
    "online learning",
    "skill development",
    "courses",
    "vSpringboard",
    "e-learning",
  ],

  openGraph: {
    title: "vSpringboard | Master New Skills Online",
    description:
      "Join 42,000+ learners on vSpringboard. Discover tailored courses and grow at your own pace.",
    url: "https://vspringboard.vercel.app",
    siteName: "vSpringboard",
    images: [
      {
        url: "https://vspringboard.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "vSpringboard — Online Learning Platform",
      },
    ],
    type: "website",
    locale: "en_US",
  },

  twitter: {
    card: "summary_large_image",
    title: "vSpringboard | Master New Skills Online",
    description:
      "Join 42,000+ learners on vSpringboard. Discover tailored courses and grow at your own pace.",
    images: ["https://vspringboard.vercel.app/og-image.png"],
  },

  alternates: {
    canonical: "https://vspringboard.vercel.app",
  },

  metadataBase: new URL("https://vspringboard.vercel.app"),

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html className="bg-[#fff]" lang="en" suppressHydrationWarning>
        <head>
          <meta
            name="google-site-verification"
            content="srD7ijcCDigxyOM90GocIsgc0wetQJy4WwQS2g2YJE8"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GoogleAnalytics />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
