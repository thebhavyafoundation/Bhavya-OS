import * as React from 'react';
import { TextProps } from './Text.types';
import './Text.tokens';

export const Text = React.forwardRef<HTMLElement, TextProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-text ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Text.displayName = 'Text';
