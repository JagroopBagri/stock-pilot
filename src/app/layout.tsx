import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import Store from "@/components/Store";
import ThemeWrapper from "@/components/ThemeWrapper";

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
    <html lang="en">
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
        <Store>
          <ThemeWrapper>
            {children}
            <Toaster
              position="bottom-left"
              toastOptions={{
                className: "react-hot-toast",
                duration: 5000,
              }}
            />
          </ThemeWrapper>
        </Store>
      </body>
    </html>
  );
}