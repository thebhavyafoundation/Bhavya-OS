import * as React from 'react';
import { LinkProps } from './Link.types';
import './Link.tokens';

export const Link = React.forwardRef<HTMLElement, LinkProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-link ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Link.displayName = 'Link';
