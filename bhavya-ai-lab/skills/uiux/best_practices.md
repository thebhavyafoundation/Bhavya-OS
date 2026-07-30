# UI/UX Best Practices

## Design System

1. **Use design tokens** for all values
2. **Document everything** in a central location
3. **Version control** the design system
4. **Test components** in isolation
5. **Keep it simple** - fewer options, fewer mistakes

## Typography

1. **Limit font families** to 2-3 maximum
2. **Use a type scale** (e.g., 12, 14, 16, 20, 24, 32, 48)
3. **Maintain line height** of 1.5 for body text
4. **Use rem units** for font sizes
5. **Test at different sizes** for readability

## Color

1. **Use a limited palette** (primary, secondary, neutral)
2. **Ensure contrast** ≥ 4.5:1 for text
3. **Test with color blindness** simulators
4. **Don't rely on color alone** to convey meaning
5. **Support dark mode** from the start

## Spacing

1. **Use a spacing scale** (4, 8, 12, 16, 24, 32, 48, 64)
2. **Be consistent** - same spacing for similar elements
3. **Use white space** to create hierarchy
4. **Avoid arbitrary values** - stick to the scale
5. **Test responsive** at all breakpoints

## Layout

1. **Use a grid system** for alignment
2. **Limit content width** to 65-75 characters
3. **Use responsive units** (%, vw, rem)
4. **Test on mobile first** then scale up
5. **Maintain visual hierarchy** at all sizes

## Accessibility

1. **Use semantic HTML** (button, nav, main, etc.)
2. **Add alt text** to all images
3. **Ensure keyboard navigation** works
4. **Test with screen readers**
5. **Support `prefers-reduced-motion`**

## Animation

1. **Keep it subtle** - don't distract
2. **Use consistent timing** (200-300ms)
3. **Respect reduced motion** preferences
4. **Make animations purposeful** - guide attention
5. **Test performance** - avoid jank

## Responsive

1. **Mobile first** approach
2. **Test at breakpoints**: 375, 768, 1024, 1440
3. **Use flexible layouts** (flex, grid)
4. **Hide/show content** as needed
5. **Test touch targets** on mobile

## Dark Mode

1. **Use CSS variables** for colors
2. **Test both modes** thoroughly
3. **Adjust contrast** for dark backgrounds
4. **Use appropriate shadows** for dark mode
5. **Don't just invert colors**
