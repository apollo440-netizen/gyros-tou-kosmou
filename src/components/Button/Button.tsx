import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { playSound } from '../../audio/soundManager';
import './Button.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'sun' | 'leaf' | 'grape' | 'coral';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'md' | 'lg';
  children: ReactNode;
  /** Απενεργοποίηση ήχου κλικ (π.χ. όταν παίζει ήδη άλλος ήχος) */
  silent?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  silent = false,
  onClick,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      onClick={(e) => {
        if (!silent) playSound('click');
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}
