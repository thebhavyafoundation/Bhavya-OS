export default {
  logo: <span style={{ fontWeight: 800 }}>Bhavya Foundation</span>,
  project: {
    link: 'https://github.com/bhavya-foundation',
  },
  docsRepositoryBase: 'https://github.com/bhavya-foundation/website',
  footer: {
    text: '© 2026 Bhavya Foundation. All rights reserved.',
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Bhavya Foundation',
    };
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  toc: {
    backToTop: true,
  },
  useEditLink() {
    return {
      text: 'Edit this page on GitHub',
      href: 'https://github.com/bhavya-foundation/website/edit/main',
    };
  },
};
