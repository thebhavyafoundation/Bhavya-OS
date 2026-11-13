/**
 * The skip link.
 *
 * WCAG 2.4.1 (Bypass Blocks) expects a keyboard user to be able to move past
 * repeated navigation to the content itself. The site header carries a large
 * navigation, so without this link every page requires a user to tab through
 * it on every visit.
 *
 * The link is hidden until it receives focus. The styles for that already
 * exist in `globals.css` under `.skip-link` — the class was defined but never
 * rendered, which is why the behaviour was missing.
 *
 * It is a server component: it has no state and no behaviour beyond the
 * browser's own focus handling.
 */
export function SkipLink({ target = "main-content" }: { target?: string }) {
  return (
    <a href={`#${target}`} className="skip-link">
      Skip to content
    </a>
  );
}
