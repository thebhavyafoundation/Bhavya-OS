// Page Schema System
// Every page is declarative. The renderer reads the schema and composes the page.
// Adding or updating data inside Bhavya OS automatically changes what visitors see.

export interface PageSchema {
  id: string;
  title: string;
  description: string;
  path: string;
  sections: SectionSchema[];
  metadata: PageMetadata;
}

export interface SectionSchema {
  type: 'hero' | 'impact-metrics' | 'projects' | 'reports' | 'gallery' | 'text' | 'documents' | 'trustees' | 'policies' | 'research' | 'news' | 'contact' | 'search' | 'financial-statements' | 'annual-reports';
  title?: string;
  source?: DataSource;
  config?: Record<string, unknown>;
}

export interface DataSource {
  service: string;
  action: string;
  params?: Record<string, unknown>;
  transform?: string;
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  canonical?: string;
}

// Page Registry
export const PAGE_SCHEMAS: PageSchema[] = [
  {
    id: 'home',
    title: 'Home',
    description: 'Bhavya Foundation - Restoring Nature. Empowering Humanity. Preserving Heritage.',
    path: '/',
    sections: [
      { type: 'hero', title: 'Welcome' },
      { type: 'impact-metrics', title: 'Our Impact' },
      { type: 'projects', title: 'Featured Projects', source: { service: 'projects', action: 'list' } },
      { type: 'news', title: 'Latest Updates' },
    ],
    metadata: { title: 'Bhavya Foundation', description: 'Restoring Nature. Empowering Humanity. Preserving Heritage.', keywords: ['environment', 'education', 'heritage', 'foundation'] },
  },
  {
    id: 'about',
    title: 'About Us',
    description: 'Learn about the Bhavya Foundation governance and mission.',
    path: '/about',
    sections: [
      { type: 'hero', title: 'About Bhavya Foundation' },
      { type: 'text', title: 'Our Story', config: { content: 'The Bhavya Foundation was established to restore nature, empower humanity, and preserve heritage.' } },
      { type: 'trustees', title: 'Board of Trustees', source: { service: 'governance', action: 'list' } },
    ],
    metadata: { title: 'About Us', description: 'Learn about the Bhavya Foundation.', keywords: ['about', 'foundation', 'governance'] },
  },
  {
    id: 'mission',
    title: 'Mission',
    description: 'Our mission to restore nature, empower humanity, and preserve heritage.',
    path: '/mission',
    sections: [
      { type: 'hero', title: 'Our Mission' },
      { type: 'text', title: 'Mission Statement', config: { content: 'Restoring Nature. Empowering Humanity. Preserving Heritage.' } },
      { type: 'impact-metrics', title: 'Mission Impact' },
      { type: 'projects', title: 'Mission-Driven Projects', source: { service: 'projects', action: 'list' } },
    ],
    metadata: { title: 'Mission', description: 'Our mission to restore nature, empower humanity, and preserve heritage.', keywords: ['mission', 'environment', 'education', 'heritage'] },
  },
  {
    id: 'programs',
    title: 'Programs',
    description: 'Our programs across environment, education, and heritage.',
    path: '/programs',
    sections: [
      { type: 'hero', title: 'Our Programs' },
      { type: 'projects', title: 'Active Programs', source: { service: 'projects', action: 'list' } },
    ],
    metadata: { title: 'Programs', description: 'Our programs across environment, education, and heritage.', keywords: ['programs', 'projects', 'initiatives'] },
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'All projects and initiatives.',
    path: '/projects',
    sections: [
      { type: 'hero', title: 'Our Projects' },
      { type: 'projects', title: 'All Projects', source: { service: 'projects', action: 'list' } },
    ],
    metadata: { title: 'Projects', description: 'All projects and initiatives.', keywords: ['projects', 'initiatives', 'programs'] },
  },
  {
    id: 'transparency',
    title: 'Transparency',
    description: 'Our commitment to transparency and accountability.',
    path: '/transparency',
    sections: [
      { type: 'hero', title: 'Transparency' },
      { type: 'impact-metrics', title: 'Impact Summary' },
      { type: 'financial-statements', title: 'Financial Reports', source: { service: 'finance', action: 'get-report' } },
      { type: 'documents', title: 'Audit Reports', source: { service: 'audit', action: 'query' } },
    ],
    metadata: { title: 'Transparency', description: 'Our commitment to transparency.', keywords: ['transparency', 'accountability', 'audit'] },
  },
  {
    id: 'annual-reports',
    title: 'Annual Reports',
    description: 'Annual reports and financial statements.',
    path: '/annual-reports',
    sections: [
      { type: 'hero', title: 'Annual Reports' },
      { type: 'annual-reports', title: 'Reports', source: { service: 'finance', action: 'get-report' } },
    ],
    metadata: { title: 'Annual Reports', description: 'Annual reports.', keywords: ['annual', 'reports', 'financial'] },
  },
  {
    id: 'financial-statements',
    title: 'Financial Statements',
    description: 'Financial statements and budgets.',
    path: '/financial-statements',
    sections: [
      { type: 'hero', title: 'Financial Statements' },
      { type: 'financial-statements', title: 'Statements', source: { service: 'finance', action: 'get-report' } },
    ],
    metadata: { title: 'Financial Statements', description: 'Financial statements.', keywords: ['financial', 'statements', 'budgets'] },
  },
  {
    id: 'trustees',
    title: 'Trustees',
    description: 'Board of Trustees.',
    path: '/trustees',
    sections: [
      { type: 'hero', title: 'Board of Trustees' },
      { type: 'trustees', title: 'Trustees', source: { service: 'governance', action: 'list' } },
    ],
    metadata: { title: 'Trustees', description: 'Board of Trustees.', keywords: ['trustees', 'board', 'governance'] },
  },
  {
    id: 'policies',
    title: 'Policies',
    description: 'Governance policies and documents.',
    path: '/policies',
    sections: [
      { type: 'hero', title: 'Policies' },
      { type: 'policies', title: 'Governance Policies', source: { service: 'governance', action: 'list' } },
    ],
    metadata: { title: 'Policies', description: 'Governance policies.', keywords: ['policies', 'governance', 'documents'] },
  },
  {
    id: 'research',
    title: 'Research',
    description: 'Research and publications.',
    path: '/research',
    sections: [
      { type: 'hero', title: 'Research' },
      { type: 'research', title: 'Publications', source: { service: 'knowledge', action: 'search' } },
    ],
    metadata: { title: 'Research', description: 'Research and publications.', keywords: ['research', 'publications', 'knowledge'] },
  },
  {
    id: 'search',
    title: 'Search',
    description: 'Search across all content.',
    path: '/search',
    sections: [
      { type: 'search', title: 'Search' },
    ],
    metadata: { title: 'Search', description: 'Search across all content.', keywords: ['search'] },
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Contact the Bhavya Foundation.',
    path: '/contact',
    sections: [
      { type: 'hero', title: 'Contact Us' },
      { type: 'contact', title: 'Get in Touch' },
    ],
    metadata: { title: 'Contact', description: 'Contact us.', keywords: ['contact', 'get in touch'] },
  },
];

// Get page by path
export function getPageByPath(path: string): PageSchema | undefined {
  return PAGE_SCHEMAS.find((p) => p.path === path);
}

// Get all pages
export function getAllPages(): PageSchema[] {
  return PAGE_SCHEMAS;
}
