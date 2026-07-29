# Accessibility Standard

**Status:** published
**Date:** 2026-07-15
**Owner:** Engineering Team

## Purpose

Define accessibility requirements for all Bhavya Foundation digital products to ensure inclusive access for all users.

## Requirements

### WCAG 2.1 AA Compliance

All user interfaces must meet WCAG 2.1 Level AA standards:

1. **Perceivable**
   - Text alternatives for non-text content
   - Captions for multimedia
   - Content adaptable to different presentations
   - Sufficient color contrast

2. **Operable**
   - Keyboard accessible
   - Enough time to read content
   - No content that causes seizures
   - Navigable and findable

3. **Understandable**
   - Readable and predictable
   - Input assistance and error prevention

4. **Robust**
   - Compatible with assistive technologies

### Testing

- Automated testing with axe-core
- Manual testing with screen readers (NVDA, VoiceOver)
- Regular accessibility audits

## Implementation

- Use semantic HTML elements
- Implement ARIA labels where needed
- Provide skip navigation links
- Ensure form fields have labels
- Test with keyboard-only navigation
