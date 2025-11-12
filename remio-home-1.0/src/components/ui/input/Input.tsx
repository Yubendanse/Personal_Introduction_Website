"use client";
import { Input as UInput, type InputProps } from "@nextui-org/input";

export const Input = ({
  className = "",
  ...inputProps
}: {
  className?: string;
} & InputProps) => {
  return <UInput className={className} {...inputProps} />;
};
