import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Liquid Staking Platform",
  description: "Kenneth Verbeure",
};

type Props = {
  children: React.ReactNode;
};
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-r from-gray-100 via-lightblue to-gray-100 p-0 flex flex-col items-center">
        <Providers>
          <Header />

          <main className="w-full max-w-screen-2xl mx-auto px-4 flex flex-col items-center flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
