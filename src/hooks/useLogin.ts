import { useState } from "react";
import { redirect, RedirectType } from "next/navigation";
import { postOptions } from "~/server/requestOptions";

export default function useLogin() {
  const [name, setName] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();

  const handleNameChange = (value: string) => setName(value);
  const handleEmailChange = (value: string) => setEmail(value);

  const handleLogin = async () => {
    const options = await postOptions();
    const response = await fetch("/api/auth/login", {
      ...options,
      body: JSON.stringify({ name, email }),
    });

    if (!response.ok) {
      console.error("Failed to login", await response.json());
    }

    redirect("/search", RedirectType.push);
  };

  const handleLogout = async () => {
    const options = await postOptions();
    const response = await fetch("/api/auth/logout", {
      ...options,
    });

    if (!response.ok) {
      console.error("Failed to logout", await response.json());
    }

    redirect("/login");
  };

  return {
    name,
    email,
    handleNameChange,
    handleEmailChange,
    handleLogin,
    handleLogout,
  };
}
