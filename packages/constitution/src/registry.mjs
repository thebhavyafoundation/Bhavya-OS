/**
 * Constitution Registry — Metadata for all 15 Constitutional Documents
 * 
 * This is the SINGLE SOURCE OF TRUTH for document metadata.
 * All AI actions must reference this registry and cite sources.
 */

export const DOCUMENTS = [
  {
    id: 'constitution',
    number: '01',
    title: 'The Constitution of Bhavya Foundation',
    filename: '01_The_Constitution.md',
    authority: 'supreme',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'The Supreme Document — the Master Constitution from which all other governing documents derive authority. Defines the Foundation\'s identity, core values, governance structure, and binding principles.',
    category: 'governance',
    dependencies: [],
    authorityLevel: 100,
    articles: [
      'Preamble', 'Definitions and Interpretation', 'Name, Registered Office, and Legal Status',
      'Vision, Mission, and Core Values', 'Governance Structure', 'Board of Trustees',
      'Founder\'s Authority', 'Executive Leadership', 'Advisory Board',
      'Operational Structure', 'Financial Governance', 'Programmes and Initiatives',
      'Brand and Intellectual Property', 'Technology and Digital Presence',
      'Risk Management and Internal Controls', 'Transparency and Public Reporting',
      'Amendment and Constitutional Review', 'Dissolution', 'Governing Law and Jurisdiction',
      'Ratification'
    ],
    keyProvisions: [
      'Supreme Document Clause (Article 2.1)',
      'Non-Negotiable Values (Article 4.2)',
      'Founder\'s Perpetual Authority (Article 7.2)',
      'Financial Limits without Board Approval (Article 11.1)',
      'Brand Protection (Article 13)',
      'Constitutional Amendment Process (Article 17)',
      'Dedication to God (Article 19)'
    ],
    relatedDocuments: ['trust-deed', 'founders-charter', 'board-charter', 'governance-manual'],
    tags: ['supreme', 'governance', 'identity', 'values', 'structure']
  },
  {
    id: 'trust-deed',
    number: '02',
    title: 'Public Charitable Trust Deed',
    filename: '02_Public_Charitable_Trust_Deed.md',
    authority: 'legal',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'The legal deed establishing Bhavya Foundation as a Public Charitable Trust under the Indian Trusts Act, 1882. Defines legal obligations, trustee responsibilities, and operational constraints.',
    category: 'legal',
    dependencies: ['constitution'],
    authorityLevel: 95,
    keyProvisions: [
      'Trust Purpose and Objectives (Clause 3)',
      'Trustee Powers and Duties (Clause 5)',
      'Property and Assets (Clause 6)',
      'Accounts and Audit (Clause 8)',
      'Dissolution (Clause 10)',
      'Irrevocability (Clause 12)'
    ],
    relatedDocuments: ['constitution', 'board-charter', 'financial-management'],
    tags: ['legal', 'trust', 'registration', 'compliance']
  },
  {
    id: 'founders-charter',
    number: '03',
    title: 'The Founder\'s Charter',
    filename: '03_The_Founders_Charter.md',
    authority: 'visionary',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Defines the perpetual authority, vision, and legacy of the Founder of Bhavya Foundation. The Founder\'s role cannot be replicated or diluted.',
    category: 'governance',
    dependencies: ['constitution'],
    authorityLevel: 90,
    keyProvisions: [
      'Founder\'s Perpetual Authority',
      'Founder\'s Advisory Role',
      'Founder\'s Veto Power',
      'Vision Stewardship',
      'Legacy Protection',
      'Founder-Designate Process'
    ],
    relatedDocuments: ['constitution', 'board-charter', 'governance-manual'],
    tags: ['founder', 'vision', 'legacy', 'authority']
  },
  {
    id: 'board-charter',
    number: '04',
    title: 'Board of Trustees Charter',
    filename: '04_Board_of_Trustees_Charter.md',
    authority: 'governance',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Defines the composition, roles, responsibilities, and operational procedures of the Board of Trustees of Bhavya Foundation.',
    category: 'governance',
    dependencies: ['constitution', 'trust-deed'],
    authorityLevel: 85,
    keyProvisions: [
      'Board Composition',
      'Trustee Roles and Responsibilities',
      'Board Committees',
      'Meeting Procedures',
      'Decision-Making Framework',
      'Conflict of Interest Management'
    ],
    relatedDocuments: ['constitution', 'trust-deed', 'governance-manual', 'code-of-ethics'],
    tags: ['board', 'trustees', 'governance', 'meetings']
  },
  {
    id: 'governance-manual',
    number: '05',
    title: 'Governance Manual',
    filename: '05_Governance_Manual.md',
    authority: 'operational',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Comprehensive guide for implementing governance policies and procedures at Bhavya Foundation. Translates the Constitution and Board Charter into actionable operational procedures.',
    category: 'governance',
    dependencies: ['constitution', 'board-charter'],
    authorityLevel: 80,
    keyProvisions: [
      'Decision-Making Framework',
      'Approval Authorities',
      'Meeting Calendar',
      'Communication Protocols',
      'Technology Governance',
      'Compliance Monitoring',
      'Operational Excellence'
    ],
    relatedDocuments: ['constitution', 'board-charter', 'code-of-ethics', 'financial-management'],
    tags: ['governance', 'operations', 'procedures', 'compliance']
  },
  {
    id: 'code-of-ethics',
    number: '06',
    title: 'Code of Ethics & Professional Conduct',
    filename: '06_Code_Of_Ethics.md',
    authority: 'ethical',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Defines the ethical standards and professional conduct expected of all Trustees, Officers, Employees, Volunteers, and Partners of Bhavya Foundation.',
    category: 'ethics',
    dependencies: ['constitution'],
    authorityLevel: 85,
    keyProvisions: [
      'Core Ethical Principles',
      'Conflict of Interest',
      'Confidentiality',
      'Anti-Corruption and Anti-Bribery',
      'Data Protection',
      'Whistleblower Protection',
      'Enforcement and Discipline'
    ],
    relatedDocuments: ['constitution', 'conflict-of-interest', 'ai-ethics'],
    tags: ['ethics', 'conduct', 'professional', 'enforcement']
  },
  {
    id: 'conflict-of-interest',
    number: '07',
    title: 'Conflict of Interest Policy',
    filename: '07_Conflict_of_Interest_Policy.md',
    authority: 'compliance',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Establishes the framework for identifying, managing, and resolving conflicts of interest within Bhavya Foundation.',
    category: 'compliance',
    dependencies: ['constitution', 'code-of-ethics'],
    authorityLevel: 80,
    keyProvisions: [
      'Definition of Conflict of Interest',
      'Disclosure Requirements',
      'Recusal Procedures',
      'Management Strategies',
      'Gifts and Hospitality',
      'Related Party Transactions'
    ],
    relatedDocuments: ['code-of-ethics', 'board-charter', 'governance-manual'],
    tags: ['conflict', 'disclosure', 'recusal', 'compliance']
  },
  {
    id: 'financial-management',
    number: '08',
    title: 'Financial Management & Procurement Policy',
    filename: '08_Financial_Management_and_Procurement_Policy.md',
    authority: 'financial',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Defines the financial management framework, procurement rules, and internal controls for Bhavya Foundation.',
    category: 'financial',
    dependencies: ['constitution', 'trust-deed'],
    authorityLevel: 85,
    keyProvisions: [
      'Financial Authority Levels',
      'Bank Account Management',
      'Income and Revenue Management',
      'Expenditure Management',
      'Procurement Process',
      'Budget and Planning',
      'Internal Controls'
    ],
    relatedDocuments: ['constitution', 'trust-deed', 'governance-manual', 'donation-acceptance'],
    tags: ['finance', 'procurement', 'budget', 'controls']
  },
  {
    id: 'donation-acceptance',
    number: '09',
    title: 'Donation Acceptance Policy',
    filename: '09_Donation_Acceptance_Policy.md',
    authority: 'financial',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Establishes the principles and procedures for accepting, processing, and managing donations to Bhavya Foundation.',
    category: 'financial',
    dependencies: ['constitution', 'financial-management'],
    authorityLevel: 75,
    keyProvisions: [
      'Types of Donations',
      'Donation Limits',
      'Acceptance Criteria',
      'Restricted and Unrestricted Donations',
      'Tax Benefits',
      'Donor Recognition',
      'Anonymous Donations',
      'Foreign Contributions'
    ],
    relatedDocuments: ['financial-management', 'constitution', 'brand-constitution'],
    tags: ['donations', 'fundraising', 'tax', 'donors']
  },
  {
    id: 'volunteer-policy',
    number: '10',
    title: 'Volunteer Management Policy',
    filename: '10_Volunteer_Policy.md',
    authority: 'community',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Establishes the framework for recruiting, managing, and supporting volunteers at Bhavya Foundation.',
    category: 'community',
    dependencies: ['constitution'],
    authorityLevel: 70,
    keyProvisions: [
      'Recruitment and Selection',
      'Code of Conduct',
      'Training and Support',
      'Risk Management',
      'Recognition and Rewards',
      'Termination and Exit'
    ],
    relatedDocuments: ['constitution', 'code-of-ethics', 'child-protection'],
    tags: ['volunteers', 'community', 'recruitment', 'training']
  },
  {
    id: 'child-protection',
    number: '11',
    title: 'Child Protection & Safeguarding Policy',
    filename: '11_Child_Protection_And_Safeguarding_Policy.md',
    authority: 'protection',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Establishes a comprehensive framework for protecting children and vulnerable persons from harm.',
    category: 'protection',
    dependencies: ['constitution', 'volunteer-policy'],
    authorityLevel: 90,
    keyProvisions: [
      'Zero Tolerance for Abuse',
      'Code of Conduct with Children',
      'Recruitment Checks',
      'Reporting Obligations',
      'Response Procedures',
      'Support for Victims',
      'Training Requirements'
    ],
    relatedDocuments: ['constitution', 'volunteer-policy', 'code-of-ethics'],
    tags: ['child-protection', 'safeguarding', 'safety', 'abuse-prevention']
  },
  {
    id: 'environmental-conservation',
    number: '12',
    title: 'Environmental Conservation Policy',
    filename: '12_Environmental_Conservation_Policy.md',
    authority: 'mission',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Defines the Foundation\'s commitment to environmental sustainability and conservation.',
    category: 'mission',
    dependencies: ['constitution'],
    authorityLevel: 75,
    keyProvisions: [
      'Environmental Stewardship',
      'Carbon Footprint Reduction',
      'Sustainable Operations',
      'Environmental Education',
      'Conservation Partnerships',
      'Environmental Reporting'
    ],
    relatedDocuments: ['constitution', 'ai-ethics', 'brand-constitution'],
    tags: ['environment', 'sustainability', 'conservation', 'carbon']
  },
  {
    id: 'ai-ethics',
    number: '13',
    title: 'AI Ethics & Responsible AI Policy',
    filename: '13_AI_Ethics_And_Responsible_AI_Policy.md',
    authority: 'technology',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Defines the ethical principles and responsible practices for AI development and deployment at Bhavya Foundation.',
    category: 'technology',
    dependencies: ['constitution', 'code-of-ethics'],
    authorityLevel: 85,
    keyProvisions: [
      'Human-Centric AI Principles',
      'Transparency and Explainability',
      'Fairness and Non-Discrimination',
      'Privacy and Data Protection',
      'Accountability and Responsibility',
      'AI Governance Framework',
      'AI Ethics Committee'
    ],
    relatedDocuments: ['constitution', 'code-of-ethics', 'digital-library', 'ai-institute'],
    tags: ['ai', 'ethics', 'transparency', 'accountability']
  },
  {
    id: 'digital-library',
    number: '14',
    title: 'Digital Library Policy',
    filename: '14_Digital_Library_Policy.md',
    authority: 'knowledge',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Defines the governance and operational framework for the Digital Library of Bhavya Foundation.',
    category: 'knowledge',
    dependencies: ['constitution', 'ai-ethics'],
    authorityLevel: 75,
    keyProvisions: [
      'Access and Usage',
      'Content Curation',
      'Knowledge Preservation',
      'AI-Powered Features',
      'Copyright and Licensing',
      'Quality Assurance',
      'Community Contribution'
    ],
    relatedDocuments: ['constitution', 'ai-ethics', 'brand-constitution', 'ai-institute'],
    tags: ['digital-library', 'knowledge', 'content', 'preservation']
  },
  {
    id: 'brand-constitution',
    number: '15',
    title: 'Brand Constitution',
    filename: '15_Brand_Constitution.md',
    authority: 'identity',
    version: '1.0',
    effectiveDate: '2026-01-01',
    description: 'Defines the visual identity, brand standards, and brand usage guidelines for Bhavya Foundation.',
    category: 'identity',
    dependencies: ['constitution'],
    authorityLevel: 80,
    keyProvisions: [
      'Brand Identity (Colors, Typography, Logo)',
      'Brand Voice and Messaging',
      'Brand Application',
      'Digital Presence',
      'Brand Governance',
      'Brand Evolution',
      'Cultural Sensitivity'
    ],
    relatedDocuments: ['constitution', 'digital-library', 'environmental-conservation'],
    tags: ['brand', 'identity', 'visual', 'messaging']
  }
];

/**
 * Get document by ID
 */
export function getDocument(id) {
  return DOCUMENTS.find(doc => doc.id === id);
}

/**
 * Get document by number
 */
export function getDocumentByNumber(number) {
  return DOCUMENTS.find(doc => doc.number === number);
}

/**
 * Get all documents in a category
 */
export function getDocumentsByCategory(category) {
  return DOCUMENTS.filter(doc => doc.category === category);
}

/**
 * Get document dependencies
 */
export function getDependencies(id) {
  const doc = getDocument(id);
  if (!doc) return [];
  return doc.dependencies.map(depId => getDocument(depId)).filter(Boolean);
}

/**
 * Get documents that depend on a given document
 */
export function getDependents(id) {
  return DOCUMENTS.filter(doc => doc.dependencies.includes(id));
}

/**
 * Search documents by keyword
 */
export function searchDocuments(keyword) {
  const lower = keyword.toLowerCase();
  return DOCUMENTS.filter(doc => 
    doc.title.toLowerCase().includes(lower) ||
    doc.description.toLowerCase().includes(lower) ||
    doc.tags.some(tag => tag.includes(lower)) ||
    doc.keyProvisions.some(prov => prov.toLowerCase().includes(lower))
  );
}

/**
 * Get governance hierarchy
 */
export function getGovernanceHierarchy() {
  return DOCUMENTS.sort((a, b) => b.authorityLevel - a.authorityLevel);
}

export default DOCUMENTS;
