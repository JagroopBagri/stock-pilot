import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/NavBar/NavBar";
import { useState, useContext } from "react";
import Store from "@/components/Store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stock Pilot",
  description: "Personalized hub for tracking and optimizing stock investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cmyk">
      <link
        rel="icon"
        href="/icon.png"
        type="image/<generated>"
        sizes="<generated>"
      />
      <link
        rel="apple-touch-icon"
        href="/apple-icon.png"
        type="image/<generated>"
        sizes="<generated>"
      />
      <Store>
        <body className={inter.className}>
          <NavBar></NavBar>
          {children}
          <Toaster
            position="bottom-left"
            toastOptions={{
              className: "react-hot-toast",
              duration: 5000,
            }}
          />
        </body>
      </Store>
    </html>
  );
}
