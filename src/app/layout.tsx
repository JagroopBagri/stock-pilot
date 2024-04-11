import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css"

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
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
