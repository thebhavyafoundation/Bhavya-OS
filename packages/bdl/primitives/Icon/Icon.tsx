import * as React from 'react';
import { IconProps } from './Icon.types';
import './Icon.tokens';

export const Icon = React.forwardRef<HTMLElement, IconProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-icon ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Icon.displayName = 'Icon';
