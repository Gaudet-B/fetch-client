"use client";

import { useEffect } from "react";
import useLogin from "~/hooks/useLogin";

export default function LogoutContent() {
  const { handleLogout } = useLogin();

  useEffect(() => {
    handleLogout();
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="-translate-y-24 text-2xl">logging out...</div>
    </div>
  );
}
