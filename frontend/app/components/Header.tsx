// frontend/app/components/Header.tsx

"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "sticky top-0 z-50 w-full",
        "bg-gradient-to-r from-purple-900/90 via-blue-900/90 to-cyan-900/90",
        "backdrop-blur-lg supports-[backdrop-filter]:bg-background/60",
        "border-b border-white/10",
        scrolled && "shadow-lg shadow-purple-500/20"
      )}
    >
      <div className="container flex h-16 items-center">
        <div className="flex flex-1 items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2"
          >
            <Link href="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 opacity-75 blur"></div>
                <span className="relative bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-2xl font-black text-transparent">
                  SolFundMe
                </span>
              </div>
            </Link>
          </motion.div>

          <nav className="flex items-center space-x-8">
            {[
              { href: "/campaigns", label: "Campaigns" },
              { href: "/create", label: "Create Campaign" },
            ].map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  className="relative group text-sm font-medium"
                >
                  <span className="text-gray-200 transition duration-300 ease-in-out group-hover:text-white">
                    {item.label}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 opacity-75 blur group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <WalletMultiButton />
              </div>
            </motion.div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
