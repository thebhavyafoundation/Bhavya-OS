import * as React from 'react';
import { CardProps } from './Card.types';
import './Card.tokens';

export const Card = React.forwardRef<HTMLElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <div ref={ref as any} className={`bdl-card ${className || ''}`} {...props}>
      {props.children}
    </div>
  );
});

Card.displayName = 'Card';
