import type { Metadata } from "next";

import "./globals.css";
import { Footer, Header, Providers } from "@/components";

export const metadata: Metadata = {
  title: "Liquid Staking Platform",
  description: "Kenneth Verbeure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-r from-gray-100 via-lightblue to-gray-100 p-4 pt-0 flex flex-col items-center">
        <Providers>
          <Header />
          <h1 className="text-center my-12 text-primary">
            <span className="text-4xl font-bold">Liquid Staking Platform</span>
          </h1>
          <div className="w-full max-w-screen-2xl mx-auto px-4 flex flex-col items-center flex-grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
