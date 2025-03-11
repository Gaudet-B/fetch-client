import { PropsWithChildren } from "react";

export function Main({ children }: PropsWithChildren) {
  return (
    <main className="flex w-full grow items-center justify-center">
      {children}
    </main>
  );
}

export function Scrollable({
  children,
  height,
}: PropsWithChildren<{ height?: number }>) {
  return (
    <div className="w-full" style={{ height: height ? `${height}px` : "100%" }}>
      <div className="h-full w-full overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
