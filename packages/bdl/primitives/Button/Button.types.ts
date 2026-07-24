import * as React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'outline' | 'ghost' | 'danger' | 'success' | 'warning' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
export type ButtonTone = 'editorial' | 'institutional';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The semantic variant of the button. */
  variant?: ButtonVariant;
  /** The size of the button. */
  size?: ButtonSize;
  /** The theme tone. Editorial is for public trust, Institutional is for operations. */
  tone?: ButtonTone;
  /** If true, the button shows a loading state. */
  loading?: boolean;
  /** Element placed before the children. */
  iconLeft?: React.ReactNode;
  /** Element placed after the children. */
  iconRight?: React.ReactNode;
}
