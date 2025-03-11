"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import DogLogo from "../icons/DogLogo";

export function NavItem({
  children,
  disabled,
  href,
  show,
  onClick,
}: PropsWithChildren<{
  disabled?: boolean;
  href?: string;
  show?: boolean;
  onClick?: () => void;
}>) {
  if (!show) return null;
  return (
    <li
      className={`font-semibold text-blue-900 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={onClick}
    >
      {href ? <Link href={href}>{children}</Link> : children}
    </li>
  );
}

export function Navigation({ loggedIn }: { loggedIn?: boolean }) {
  return (
    <nav className="flex h-11 w-full items-center bg-gray-100 px-4 py-2 shadow-md">
      <ul className="flex w-full items-center justify-between">
        <div className="h-10 w-10">
          <DogLogo />
        </div>
        <NavItem href="/logout" show={loggedIn}>
          logout
        </NavItem>
      </ul>
    </nav>
  );
}
