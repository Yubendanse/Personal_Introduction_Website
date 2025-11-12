"use client";
import { Textarea as UTextarea, type TextAreaProps } from "@nextui-org/input";

export const Textarea = ({
  className = "",
  ...TextAreaProps
}: {
  className?: string;
} & TextAreaProps) => {
  return <UTextarea className={className} {...TextAreaProps} />;
};
