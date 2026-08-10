import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://bhavyafoundation.org',
  integrations: [
    starlight({
      title: 'Bhavya Foundation',
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/bhavya-foundation' },
        { icon: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com/company/bhavya-foundation' },
        { icon: 'youtube', label: 'YouTube', href: 'https://youtube.com/@bhavyafoundation' },
      ],
      sidebar: [
        { label: 'Home', slug: 'index' },
        { label: 'AI Institute', slug: 'ai-institute' },
        { label: 'Knowledge Packages', items: [
          { label: 'KP-001: How LLMs Work', slug: 'kp/kp-001' },
        ]},
        { label: 'Blog', items: [
          { label: 'Welcome', slug: 'blog/welcome' },
        ]},
      ],
    }),
  ],
});
