import * as React from 'react';
import { AvatarProps } from './Avatar.types';
import './Avatar.tokens';

export const Avatar = React.forwardRef<HTMLElement, AvatarProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-avatar ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Avatar.displayName = 'Avatar';
