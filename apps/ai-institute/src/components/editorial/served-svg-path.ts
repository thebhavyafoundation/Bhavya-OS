/**
 * Convert a diagram manifest's `production_svg` value into the URL the app
 * actually serves.
 *
 * The manifests record `production_svg` as a repository path — the diagram
 * audit scripts (`scripts/diagrams/*.mjs`) resolve it against the repo root —
 * but the browser cannot use that path: files under
 * `apps/ai-institute/public/` are served from the site root. Passing the
 * repository path straight to `<img>` made every diagram request
 * `/apps/ai-institute/public/...`, which the router redirects to `/login`
 * (HTML, not SVG) and the image renders as broken alt text.
 *
 * Only the one documented mapping is applied; already-rooted paths and
 * absolute URLs pass through unchanged.
 */
const PUBLIC_DIR_PREFIX = "apps/ai-institute/public/";

export function servedSvgPath(productionSvg: string): string {
  if (/^https?:\/\//.test(productionSvg)) return productionSvg;
  const withoutPublicPrefix = productionSvg.startsWith(PUBLIC_DIR_PREFIX)
    ? productionSvg.slice(PUBLIC_DIR_PREFIX.length)
    : productionSvg;
  return withoutPublicPrefix.startsWith("/")
    ? withoutPublicPrefix
    : "/" + withoutPublicPrefix;
}
