import { HTMLAttributes } from 'react';

// 미리 정의된 텍스트 스타일 묶음
const VARIANTS = {
  title1: 'text-2xl noto-bold text-black',
  title2: 'text-xl noto-bold text-black',
  subtitle: 'text-lg noto-regular text-gray-700',
  body: 'text-base noto-regular text-gray-800',
  caption: 'text-sm noto-light text-gray-500',
} as const;

type Variant = keyof typeof VARIANTS;

interface TxtProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  size?: 'xl' | 'lg' | 'base' | 'sm' | 'xs';
  weight?: 'light' | 'regular' | 'bold' | 'black';
  color?: string; // tailwind 예: 'text-red-500'
  className?: string;
}

export default function Txt({
  variant,
  size = 'base',
  weight = 'regular',
  color = 'text-black',
  className = '',
  ...props
}: TxtProps) {
  let combinedClassName = '';

  if (variant) {
    combinedClassName = `${VARIANTS[variant]} ${className}`;
  } else {
    const sizeClass = {
      xl: 'text-2xl',
      lg: 'text-xl',
      base: 'text-base',
      sm: 'text-sm',
      xs: 'text-xs',
    }[size];

    const weightClass = {
      light: 'noto-light',
      regular: 'noto-regular',
      bold: 'noto-bold',
      black: 'noto-black',
    }[weight];

    combinedClassName = `font-noto ${sizeClass} ${weightClass} ${color} ${className}`;
  }

  return <span className={combinedClassName} {...props} />;
}
