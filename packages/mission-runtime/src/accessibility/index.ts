export interface A11yConfig {
  skipLinkTarget: string;
  reduceMotion?: boolean;
}

export function getSkipLinkProps(target: string) {
  return {
    href: `#${target}`,
    className: "skip-link",
    "aria-label": "Skip to main content",
  };
}
