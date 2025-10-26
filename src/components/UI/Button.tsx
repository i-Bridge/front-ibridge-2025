import { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "Primary" | "Secondary";
}

const baseStyles =
  "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const variantStyles = {
  
  Primary: "bg-Primary text-white hover:bg-blue-700 focus:ring-blue-400",
  Secondary: "bg-Secondary text-white hover:bg-purple-700 focus:ring-purple-400",
};

// 자주 쓰는 조합 2개 export
export function PrimaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button variant="Primary" size="md" {...props}>
      {children}
    </Button>
  );
}

export function SecondaryButton({ children, ...props }: ButtonProps) {
  return (
    <Button variant="Secondary" size="md" {...props}>
      {children}
    </Button>
  );
}

// 기본 버튼
export function Button({
  children,
  size = "md",
  variant = "Primary",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
