import type { Metadata } from "next";
import { Suspense } from "react";

import { Footer, Header, Providers } from "@/components";

import Loading from "./loading";

import "./globals.css";

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

          <div className="w-full max-w-screen-2xl mx-auto px-4 mt-12 flex flex-col items-center flex-grow">
            <Suspense fallback={<Loading />}>{children} </Suspense>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
