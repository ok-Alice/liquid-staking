"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowAltCircleDown,
  faExchange,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import Account from "./Account";

const Header: React.FC = () => {
  const pathname = usePathname();
  const links = [
    {
      href: "/staking",
      label: "Staking",
      icon: faExchange,
    },
    {
      href: "/unstaking",
      label: "Unstaking",
      icon: faArrowAltCircleDown,
    },
    {
      href: "/validators",
      label: "Validators",
      icon: faUsers,
    },
  ];
  return (
    <header className="w-full p-3">
      <div className="mx-auto max-w-screen-2xl flex justify-between items-center px-4">
        <div className="flex items-center space-x-8">
          <Link href="/staking">
            <Image
              src="/logo.png"
              alt="OkAlice Liquid Staking Platform"
              width="250"
              height="88"
              priority={true}
            />
          </Link>
          <nav className="flex space-x-12 text-2xl text-primary">
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
                <span className="flex items-center space-x-2">
                  <FontAwesomeIcon icon={link.icon} className="w-5 h-5" />
                  <span>{link.label}</span>
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <Account />
      </div>
    </header>
  );
};

export default Header;
