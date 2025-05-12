"use client";

import { Disclosure } from "@headlessui/react";
import Link from "next/link";
import React from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import Drawer from "./Drawer";
import Drawerdata from "./Drawerdata";
import { useWallet } from "@solana/wallet-adapter-react";
import dynamic from "next/dynamic";

// Carga dinámica del botón de wallet para evitar errores SSR
const WalletMultiButton = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

interface NavigationItem {
  name: string;
  href: string;
  current: boolean;
}

const navigation: NavigationItem[] = [
  { name: "Home", href: "#home-section", current: false },
  { name: "Exchange", href: "#exchange-section", current: false },
  { name: "Features", href: "#features-section", current: false },
  { name: "FAQ", href: "#faq-section", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { connected, publicKey } = useWallet();

  return (
    <Disclosure as="nav" className="navbar">
      <>
        <div className="mx-auto max-w-7xl p-3 md:p-4 lg:px-8">
          <div className="relative flex h-12 sm:h-20 items-center">
            <div className="flex flex-1 items-center sm:justify-between">
              {/* LOGO */}
              <div className="flex flex-shrink-0 items-center">
                <img
                  className="block h-10 w-20px lg:hidden"
                  src={"/images/Logo/logo.svg"}
                  alt="Crypto-Logo"
                />
                <img
                  className="hidden h-48px w-48px lg:block"
                  src={"/images/Logo/logo.svg"}
                  alt="Crypto-Logo"
                />
              </div>

              {/* LINKS */}
              <div className="hidden lg:flex items-center border-right">
                <div className="flex justify-end space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900"
                          : "navlinks text-white hover:text-offwhite hover-underline",
                        "px-3 py-4 rounded-md text-lg font-normal"
                      )}
                      aria-current={item.href ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* WALLET BUTTON */}
              <div className="hidden lg:flex items-center gap-4 ml-4">
                {connected && publicKey && (
                  <p className="text-sm text-cyan-300">
                    {publicKey.toBase58().slice(0, 4)}...
                    {publicKey.toBase58().slice(-4)}
                  </p>
                )}
                <WalletMultiButton className="!bg-[#64cdff] hover:!bg-[#4dbde6] !text-black font-semibold !rounded-full !px-6 !py-2 !text-base" />
              </div>
            </div>

                {/* WALLET MOBILE */}
<div className="block lg:hidden ml-auto">
  <WalletMultiButton className="!bg-[#64cdff] hover:!bg-[#4dbde6] !text-black font-semibold !rounded-full !px-4 !py-2 !text-sm" />
</div>


            {/* DRAWER ICON */}
            <div className="block lg:hidden">
              <Bars3Icon
                className="block h-6 w-6 text-white"
                aria-hidden="true"
                onClick={() => setIsOpen(true)}
              />
            </div>

            {/* DRAWER MENU MOBILE */}
            <Drawer isOpen={isOpen} setIsOpen={setIsOpen}>
              <Drawerdata />
            </Drawer>
          </div>
        </div>
      </>
    </Disclosure>
  );
};

export default Navbar;
