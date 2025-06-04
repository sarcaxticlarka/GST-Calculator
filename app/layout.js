import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { icons } from "lucide-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Star Furniture GST Calculator | Professional GST Tool for Furniture Shops",
  description:
    "Easily calculate GST with Star Almirah's advanced GST calculator. Ideal for furniture businesses with bulk calculation, history tracking, and export features.",
  keywords: [
    "GST calculator",
    "furniture GST calculator",
    "Star Almirah",
    "furniture shop billing tool",
    "GST tool for furniture",
    "professional GST calculator"
  ],
  icons: {
    icon: "/https://images.unsplash.com/photo-1649209979970-f01d950cc5ed?q=80&w=3141&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",    
  },
  openGraph: {
    title: "Star Furniture GST Calculator",
    description:
      "Advanced GST calculator built for furniture shops. Bulk tax calculations, history tracking, and export options — all in one place.",
     siteName: "Star Almirah & Furniture",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
