import { ReactNode } from "react";
import clsx from "clsx";

type TextVariant =
  | "title"
  | "subtitle"
  | "body"
  | "caption"
  | "button"
  | "highlight";

interface TextProps {
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<TextVariant, string> = {
  title: "text-2xl font-bold",
  subtitle: "text-xl font-semibold text-gray-700",
  body: "text-base text-gray-800",
  caption: "text-sm text-gray-500",
  button: "text-sm font-medium uppercase",
  highlight: "text-lg font-semibold text-primary",
};

export function Text({ variant = "body", children, className }: TextProps) {
  return <p className={clsx(variantStyles[variant], className)}>{children}</p>;
}
