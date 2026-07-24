import * as React from 'react';
import { SidebarProps } from './Sidebar.types';
import './Sidebar.tokens';

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-sidebar ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
