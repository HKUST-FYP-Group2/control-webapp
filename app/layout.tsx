import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { inter } from '@/app/ui/fonts';
import { Suspense } from "react";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Virtual Window Control",
  description: "Control your Virtual Window",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <Suspense>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
