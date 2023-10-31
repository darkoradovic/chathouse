import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToasterContext from "./context/ToasterContext";
import NextAuthProvider from "./context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chathouse",
  description: "Chathouse app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#350693" />
      </head>
      <body className={inter.className}>
        <NextAuthProvider>
          <ToasterContext />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
