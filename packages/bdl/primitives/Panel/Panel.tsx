import * as React from 'react';
import { PanelProps } from './Panel.types';
import './Panel.tokens';

export const Panel = React.forwardRef<HTMLElement, PanelProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-panel ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Panel.displayName = 'Panel';
