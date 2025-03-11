"use client";

import { Button as HeadlessButton } from "@headlessui/react";
import { PropsWithChildren } from "react";
import SearchIcon from "../icons/Search";
import { buttonThemes } from "./theme";
import Plus from "../icons/Plus";
import Check from "../icons/Check";

export default function Button({
  children,
  /** @note additional classNames will override button theme */
  className,
  onClick,
  disabled,
  theme = "primary",
  type = "button",
}: PropsWithChildren<{
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  theme?: "primary" | "secondary";
  type?: "button" | "submit";
}>) {
  return (
    <HeadlessButton
      className={`flex h-10 w-full items-center justify-center rounded-full border border-blue-900 text-center text-blue-900 ${buttonThemes[theme]} ${className}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </HeadlessButton>
  );
}

export function SearchButton({
  disabled,
  onClick,
}: {
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="h-10 -translate-x-12 rounded-r-full">
      <div className="absolute flex h-10 w-12">
        <Button
          className="rounded-l-none border-gray-900 pl-2"
          onClick={onClick}
          disabled={disabled}
        >
          <SearchIcon />
        </Button>
      </div>
    </div>
  );
}

export function FavoriteButton({
  selected,
  onClick,
  disabled = false,
}: {
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <HeadlessButton
      className={`h-12 w-14 rounded-lg border-2 border-green-400 transition-colors duration-300 ${
        selected ? "bg-green-400" : "bg-white"
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      {selected ? <Check /> : <Plus />}
    </HeadlessButton>
  );
}

function Caret({ direction }: { direction: "prev" | "next" }) {
  return (
    <span
      className={`transition-transform group-hover:translate-x-0 group-hover:font-bold ${
        direction === "prev" ? "translate-x-1" : "-translate-x-1"
      }`}
    >
      {direction === "prev" ? "<" : ">"}
    </span>
  );
}

export function PaginationButton({
  onClick,
  direction,
  disabled,
}: {
  onClick: () => void;
  direction: "prev" | "next";
  disabled?: boolean;
}) {
  return (
    <HeadlessButton onClick={onClick} disabled={disabled}>
      {!disabled && (
        <div
          className={`group flex w-14 cursor-pointer items-center gap-2 transition-colors duration-300 hover:text-green-400 ${
            direction === "prev" ? "justify-start" : "justify-end"
          }`}
        >
          {direction === "prev" ? <Caret direction={direction} /> : null}
          <span>{direction}</span>
          {direction === "next" ? <Caret direction={direction} /> : null}
        </div>
      )}
    </HeadlessButton>
  );
}
