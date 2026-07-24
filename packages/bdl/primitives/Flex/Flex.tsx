import * as React from 'react';
import { FlexProps } from './Flex.types';
import './Flex.tokens';

export const Flex = React.forwardRef<HTMLElement, FlexProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-flex ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Flex.displayName = 'Flex';
