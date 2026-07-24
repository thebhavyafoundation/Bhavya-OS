# Bhavya Design Language (BDL) Manifesto

## Philosophy
Bhavya Design Language (BDL) is the visual DNA of the Bhavya Foundation. It is not a UI library; it is a strict semantic system that dictates how every pixel behaves across the institution. The design philosophy is rooted in permanence, clarity, trust, and accessibility. We do not design for trends; we design for decades.

## Typography Principles
We rely on fluid typography driven by mathematical scales (using `clamp()`). Typography must command respect and ensure absolute readability. 
- **Editorial Mode:** Emphasizes long-form reading and institutional gravitas.
- **Institutional Mode:** Emphasizes data density, operational clarity, and precision.

## Color Rationale
No hardcoded hex values are permitted in components. All colors must be mapped to semantic tokens.
- **Editorial Theme:** Warm, museum-like, inspired by nature and civilization (forest greens, earth browns, soft ivory).
- **Institutional Theme:** Modern, operational, glass-like (deep blacks, slate, neon data accents).

## Motion Principles
Motion communicates hierarchy and state change. We never animate for decoration. 
- Fast, purposeful easing curves (inspired by Apple/Linear).
- Strict adherence to `prefers-reduced-motion`.

## Accessibility Commitments
- WCAG 2.2 AA is our absolute baseline.
- Every interactive element must have a visible focus state and be keyboard navigable.
- Semantic HTML (e.g., `<button>` vs `<a>`) is enforced at the primitive level.

## Component Philosophy
1. **Primitives Only:** BDL contains no business logic. It provides raw materials (Button, Card, Grid).
2. **Strict Props:** Components accept semantic tokens, not raw CSS values.
3. **Compound Components:** Complex UI is built by composing primitives.

## Long-Term Evolution Policy
Modifications to BDL must go through the ADR process. The design system is the foundation of Bhavya OS, and any change cascades across all internal and public modules.


Bhavya Design Language exists to express institutional trust through clarity, consistency, accessibility, and restraint. Every visual decision should reduce complexity, increase comprehension, and reinforce the Foundation's commitment to serving generations to come.
