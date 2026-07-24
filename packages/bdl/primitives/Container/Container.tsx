import * as React from 'react';
import { ContainerProps } from './Container.types';
import './Container.tokens';

export const Container = React.forwardRef<HTMLElement, ContainerProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-container ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Container.displayName = 'Container';
