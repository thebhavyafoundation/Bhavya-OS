import * as React from 'react';
import { GridProps } from './Grid.types';
import './Grid.tokens';

export const Grid = React.forwardRef<HTMLElement, GridProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-grid ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Grid.displayName = 'Grid';
