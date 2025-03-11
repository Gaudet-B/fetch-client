"use client";

import React, { useMemo } from "react";
import {
  Input,
  Field,
  Label,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Checkbox as HeadlessCheckbox,
} from "@headlessui/react";
import { SearchButton } from "../button/button";

function _checkSelected(selected: string | Array<string>) {
  return (
    selected === "" || !selected.length || selected.length === 0 || !selected
  );
}

export function TextInput({
  className,
  label,
  name,
  value,
  onBlur,
  onChange,
  autoComplete = "off",
}: {
  className?: string;
  label?: string;
  name: string;
  value?: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  autoComplete?: "off" | "on";
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    onChange(value);
  };

  return (
    <Field
      className={`flex h-full w-full items-center rounded-full border border-gray-900 bg-white ${className}`}
    >
      {/** hidden label for screen readers */}
      <Label htmlFor={name} className="sr-only">
        {label}
      </Label>
      <Input
        placeholder={label}
        name={name}
        type="text"
        onBlur={onBlur}
        onChange={handleChange}
        className={`h-full w-full rounded-full px-2 font-mono ${className}`}
        value={value}
        autoComplete={autoComplete}
      />
    </Field>
  );
}

function SearchDropdown({ children }: { children: React.ReactNode }) {
  return (
    <div className="data=[closed]:scale-90 absolute z-50 flex max-h-[80vh] w-80 flex-col overflow-y-auto rounded-lg bg-white pt-2 font-normal text-gray-500 shadow-lg transition duration-200 ease-out data-[closed]:opacity-0">
      {children}
    </div>
  );
}

export function SearchInput({
  label,
  name,
  items,
  value,
  onBlur,
  onChange,
  onSelect,
}: {
  label: string;
  name: string;
  items?: Array<string>;
  value?: string;
  onBlur: () => void;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
}) {
  const handleBlur = () => {
    setTimeout(() => onBlur(), 300);
  };

  const handleSelect = (value: string) => onSelect(value);

  return (
    <div className="flex h-10 w-96 items-center justify-between">
      <div className="h-10 w-[337px]">
        <TextInput
          label={label}
          name={name}
          onBlur={handleBlur}
          onChange={onChange}
          className="rounded-r-none"
          value={value}
        />
        {items && items.length > 0 && (
          <SearchDropdown>
            {items.map((item) => (
              <div
                key={item}
                onClick={() => handleSelect(item)}
                className="flex h-10 cursor-pointer items-center px-2 py-2 hover:bg-gray-100 hover:text-blue-900"
              >
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                  {item}
                </span>
              </div>
            ))}
          </SearchDropdown>
        )}
      </div>
      {/** @note disabled button since there is no "true" search functionality yet */}
      <SearchButton disabled />
    </div>
  );
}

export function NumberInput({
  name,
  min = 0,
  max = 99,
  value,
  onChange,
}: {
  name: string;
  min?: number;
  max?: number;
  value?: number;
  onChange: (value: number) => void;
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = parseInt(e.target.value);
    if (isNaN(value)) return;
    onChange(value);
  };

  return (
    <Input
      name={name}
      type="number"
      onChange={handleChange}
      className="w-11 rounded-md text-center"
      min={min}
      max={max}
      value={value}
    />
  );
}

function CheckmarkIcon() {
  return (
    <svg
      className="stroke-white opacity-0 group-data-[checked]:opacity-100"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M3 8L6 11L11 3.5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      className="stroke-white opacity-0 group-data-[checked]:opacity-100"
      viewBox="0 0 14 14"
      fill="none"
    >
      <path
        d="M7 3.5V10.5M10.5 7H3.5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Checkbox({
  checked,
  name,
  checkedIcon = "check",
  uncheckedIcon = "empty",
}: {
  checked?: boolean;
  checkedIcon?: "check" | "plus";
  uncheckedIcon?: "empty" | "plus";
  name?: string;
}) {
  const Icon = useMemo(() => {
    const c = checkedIcon === "check" ? CheckmarkIcon : PlusIcon;
    const u = uncheckedIcon === "empty" ? null : PlusIcon;
    return checked ? c : u;
  }, [checked]);

  return (
    <HeadlessCheckbox
      className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500"
      name={name}
      checked={checked}
    >
      {Icon && <Icon />}
    </HeadlessCheckbox>
  );
}

function MultiSelectOption({
  item,
  selected,
}: {
  item: string;
  selected: Array<string>;
}) {
  return (
    <ListboxOption
      className="flex h-8 items-center justify-start gap-2 align-text-top"
      value={item}
    >
      <Checkbox checked={selected.includes(item)} />
      <span className="mb-1">{item}</span>
    </ListboxOption>
  );
}

const MemoizedMultiSelectOption = React.memo(
  MultiSelectOption,
  (prevProps, nextProps) => {
    return prevProps.selected === nextProps.selected;
  },
);

function SingleSelectOption({ item }: { item: string }) {
  return (
    <ListboxOption key={item} value={item}>
      {item}
    </ListboxOption>
  );
}

function OptionSeparator() {
  return <div className="h-px w-full border-b border-gray-300" />;
}

function SelectOption({
  item,
  lastItem,
  multiple,
  selected,
}: {
  item: string;
  lastItem: boolean;
  multiple: boolean;
  selected: string | Array<string>;
}) {
  return multiple && Array.isArray(selected) ? (
    <>
      <MemoizedMultiSelectOption key={item} item={item} selected={selected} />
      {!lastItem && <OptionSeparator key={`${item}-separator`} />}
    </>
  ) : (
    <>
      <SingleSelectOption key={item} item={item} />
      {!lastItem && <OptionSeparator key={`${item}-separator`} />}
    </>
  );
}

export function Select({
  items,
  label,
  name,
  placeholder,
  selected,
  onChange,
  multiple = false,
}: {
  items: Array<string>;
  label: string;
  name: string;
  placeholder?: string;
  selected: string | Array<string>;
  onChange: (value: string | Array<string>) => void;
  multiple?: boolean;
}) {
  return (
    <Field className="flex h-8 w-full items-center font-mono">
      <Label htmlFor={name} className="sr-only">
        {label}
      </Label>
      <Listbox value={selected} onChange={onChange} multiple={multiple}>
        <ListboxButton className="h-8 w-[25ch] overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-white px-2 text-start">
          {multiple && Array.isArray(selected) ? selected.join(", ") : selected}
          {_checkSelected(selected) && placeholder && (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          className={`data=[closed]:scale-90 z-50 flex h-96 w-[25ch] translate-y-1 flex-col gap-1 rounded-lg bg-white px-2 pt-2 shadow-lg transition duration-200 ease-out data-[closed]:opacity-0`}
          transition
        >
          {items.map((item, idx) => (
            <SelectOption
              key={`${item}-${idx}`}
              item={item}
              lastItem={idx === items.length - 1}
              multiple={multiple}
              selected={selected}
            />
          ))}
        </ListboxOptions>
      </Listbox>
    </Field>
  );
}
