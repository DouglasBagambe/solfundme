// frontend/app/components/Header.tsx

// Header.tsx
"use client";
import React from "react";
import Link from "next/link";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

const Header = () => {
  return (
    <>
      {/* Spacer div to prevent content from going under header */}
      <div className="h-32" />

      <div
        className="fixed top-0 w-full bg-gradient-to-r from-purple-950/95 via-blue-950/95 to-cyan-950/95 border-b border-white/10 backdrop-blur-sm z-50"
        style={{ height: "100px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent transform transition-all duration-200 group-hover:-translate-y-0.5">
                SolFundMe
              </h1>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-12">
              <Link
                href="/campaigns"
                className="group relative text-gray-300 hover:text-white text-base font-medium transition-all duration-200"
              >
                <span className="transform transition-all duration-200 group-hover:-translate-y-0.5 inline-block">
                  Campaigns
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
              </Link>

              <Link
                href="/create"
                className="group relative text-gray-300 hover:text-white text-base font-medium transition-all duration-200"
              >
                <span className="transform transition-all duration-200 group-hover:-translate-y-0.5 inline-block">
                  Create Campaign
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
              </Link>

              {/* Wallet Button */}
              <div className="group transform transition-all duration-200 hover:-translate-y-0.5">
                <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !transition-colors !duration-200" />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/campaigns"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Campaigns
            </Link>
            <Link
              href="/create"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
            >
              Create Campaign
            </Link>
            <div className="px-3 py-2">
              <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700 !transition-colors !duration-200" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
