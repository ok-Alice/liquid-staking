import type { Metadata } from "next";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import AccountListener from "@/components/AccountListener";
import Notifications from "@/ui-kit/notifications";

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

          <main className="w-full max-w-screen-2xl mx-auto px-4 pt-12 flex flex-col items-center flex-grow">
            {children}
          </main>
          <Footer />
          <Notifications />
          <AccountListener />
        </Providers>
      </body>
    </html>
  );
}
