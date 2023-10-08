"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Wallet } from ".";

const Header: React.FC = () => {
  const pathname = usePathname();
  const links = [
    {
      href: "/",
      label: "Staking",
    },
    {
      href: "/validators",
      label: "Validators",
    },
    {
      href: "/faq",
      label: "FAQ",
    },
  ];
  return (
    <header className="w-full p-3">
      <div className="mx-auto max-w-screen-2xl flex justify-between items-center px-4">
        <div className="flex items-center space-x-8">
          <Image
            src="/logo.png"
            alt="OkAlice Liquid Staking Platform"
            width="250"
            height="88"
            priority={true}
          />
          <nav className="flex space-x-8 text-2xl text-primary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${
                  pathname === link.href
                    ? "text-gray-400 border-b-2 border-gray-400"
                    : "hover:text-gray-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {/* <ChainSwitcher /> */}
          <Wallet />
        </div>
      </div>
    </header>
  );
};

export default Header;
