# Bhavya Foundation

**Nature. Knowledge. Heritage. Building for Generations.**

[![Website](https://img.shields.io/badge/Website-website--ten--vert--90.vercel.app-green)](https://website-ten-vert-90.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Company-blue)](https://www.linkedin.com/company/143079926/)
[![GitHub](https://img.shields.io/badge/GitHub-Organization-black)](https://github.com/thebhavyafoundation)

---

## About

Bhavya Foundation is a public institution committed to building a better tomorrow. We restore nature, advance knowledge, preserve heritage, and empower communities.

### Four Missions

| Mission          | Focus                                       | Impact                  |
| ---------------- | ------------------------------------------- | ----------------------- |
| 🌱 **Forest**    | Restore ecosystems, conserve biodiversity   | 8+ hectares restored    |
| 📚 **Knowledge** | AI labs, digital libraries, STEM education  | 10K+ students empowered |
| 🏛️ **Heritage**  | Document and preserve traditional knowledge | Active preservation     |
| 👥 **Community** | Youth empowerment, village development      | 50+ communities engaged |

---

## Platform

Bhavya OS is the digital operating system for Bhavya Foundation — a production-grade Turborepo monorepo for public websites, mission applications, documentation, dashboards, and operational tools.

### Architecture

```
apps/
├── website/          # Public foundation website
├── admin/            # Founder and operations dashboard
├── volunteer/        # Volunteer portal
├── forest/           # Forest mission application
├── knowledge/        # Knowledge mission application
├── library/          # Digital library
└── heritage/         # Heritage mission application

packages/
├── constitution/     # Constitutional documents SDK
├── runtime/          # AI runtime engine
├── ui/               # Reusable interface components
├── theme/            # Brand tokens and design system
└── ...
```

### Constitution SDK

The single source of truth for all 15 Constitutional Documents:

```javascript
import { initialize, search, cite } from "@bhavya/constitution";

await initialize();

// Search across all constitutional documents
const results = await search("conflict of interest");

// Generate a citation
const citation = await cite("constitution", { format: "text" });
// => Bhavya Foundation, "The Constitution" (01), Article 01 (effective 2026-01-01)
```

**Stats:** 15 documents | 2,578 indexed terms | 460 knowledge graph nodes

---

## Knowledge Packages

Structured educational content following the KP Standard.

### KP-001: How Large Language Models Work

| Artifact      | Description                                        |
| ------------- | -------------------------------------------------- |
| Lesson        | 6 sections, 5 learning outcomes                    |
| Assessment    | 15 questions (8 MCQ, 4 short-answer, 3 reflection) |
| Teacher Guide | Objectives, materials, discussion prompts          |
| Workbook      | 8 pages with exercises and reflection              |
| Visual Spec   | 8 scenes, subject-aware palette                    |
| Website       | 4 pages with HTML/CSS                              |

---

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build for production
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

## Governance

Bhavya Foundation operates under 15 Constitutional Documents that define governance, policy, ethics, compliance, and institutional authority.

**View the Constitution:** [01_The_Constitution.md](_archive/constitution-2026-09-05/01_The_Constitution.md) (canonical access via the `@bhavya/constitution` SDK)

**Constitutional Hierarchy:**

| Level | Document                                            | Authority   |
| ----- | --------------------------------------------------- | ----------- |
| 100   | The Constitution                                    | Supreme     |
| 95    | Trust Deed                                          | Legal       |
| 90    | Founder's Charter                                   | Visionary   |
| 85    | Board Charter, Code of Ethics, Financial Management | Governance  |
| 80    | Governance Manual, Conflict of Interest, Brand      | Operational |

---

## Contributing

We welcome contributions that align with our mission. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting a pull request.

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Contact

- **Website:** [website-ten-vert-90.vercel.app](https://website-ten-vert-90.vercel.app)
- **LinkedIn:** [Bhavya Foundation](https://www.linkedin.com/company/143079926/)
- **GitHub:** [thebhavyafoundation](https://github.com/thebhavyafoundation)

---

<p align="center">
  <em>Nature. Knowledge. Heritage. Building for Generations.</em>
</p>
