"use client";

import Button from "@designsystem/button";
import { TextInput } from "@designsystem/form/input";
import useLogin from "~/hooks/useLogin";

function FormInput({
  label,
  name,
  onChange,
}: {
  label: string;
  name: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="h-10">
      <TextInput
        label={label}
        name={name}
        onChange={onChange}
        autoComplete="on"
      />
    </div>
  );
}

export function LoginForm() {
  const { handleNameChange, handleEmailChange, handleLogin } = useLogin();

  return (
    <form className="flex w-full flex-col gap-2">
      <FormInput label="name" name="name" onChange={handleNameChange} />
      <FormInput label="email" name="email" onChange={handleEmailChange} />
      <Button onClick={handleLogin}>login</Button>
    </form>
  );
}
