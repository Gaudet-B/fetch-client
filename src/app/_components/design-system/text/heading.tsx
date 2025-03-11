import { PropsWithChildren } from "react";

export function H1({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <h1 className={`text-2xl ${className}`}>{children}</h1>;
}

export function H2({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  return <h2 className={`text-xl ${className}`}>{children}</h2>;
}
