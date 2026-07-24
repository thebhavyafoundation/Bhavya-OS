import * as React from 'react';
import { SurfaceProps } from './Surface.types';
import './Surface.tokens';

export const Surface = React.forwardRef<HTMLElement, SurfaceProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-surface ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Surface.displayName = 'Surface';
