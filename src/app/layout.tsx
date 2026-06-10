import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/auth/SessionProvider";
import { Navbar } from "@/components/layout/Navbar";
import { PushNotificationButton } from "@/components/notifications/PushNotificationButton";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://golfganja.com"),
  title: {
    default: "Golf N Ganja",
    template: "%s | Golf N Ganja",
  },
  description:
    "Premium livestreams, golf content, podcast interviews, and community features for the Golf N Ganja creator network.",
  applicationName: "Golf N Ganja",
  appleWebApp: {
    capable: true,
    title: "Golf N Ganja",
  },
  icons: {
    icon: [
      {
        url: "/brand/gng-cut.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    shortcut: ["/brand/gng-cut.png"],
    apple: [
      {
        url: "/brand/gng-green.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "Golf N Ganja",
    description:
      "Premium livestreams, golf content, podcast interviews, and community features for the Golf N Ganja creator network.",
    images: [
      {
        url: "/brand/gng-green.png",
        width: 1024,
        height: 1024,
        alt: "Golf N Ganja logo on grass",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground">
        <SessionProvider>
          <Navbar />
          {children}
          <PushNotificationButton />
        </SessionProvider>
      </body>
    </html>
  );
}
