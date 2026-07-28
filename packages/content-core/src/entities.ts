import { Entity, EntityType } from "./models";
import { getDocuments } from "./documents";

// ── Seed Entities ──────────────────────────────────────────

const SEED_ENTITIES: Omit<
  Entity,
  "documentIds" | "mentions" | "created" | "updated"
>[] = [
  {
    id: "entity-founder",
    name: "Shri Manohar Lal",
    type: "person",
    description: "Founder, Bhavya Foundation",
    properties: {},
    aliases: [],
  },
  {
    id: "entity-bhavya",
    name: "Bhavya Foundation",
    type: "organization",
    description: "Restoring Nature. Empowering Humanity. Preserving Heritage.",
    properties: {},
    aliases: ["Bhavya"],
  },
  {
    id: "entity-nature",
    name: "Nature Mission",
    type: "project",
    description: "Environmental conservation, plantation, biodiversity",
    properties: {},
    aliases: [],
  },
  {
    id: "entity-knowledge",
    name: "Knowledge Mission",
    type: "project",
    description: "AI Lab, Digital Library, Research, Education",
    properties: {},
    aliases: [],
  },
  {
    id: "entity-heritage",
    name: "Heritage Mission",
    type: "project",
    description: "Temple restoration, archives, yoga, traditional knowledge",
    properties: {},
    aliases: [],
  },
  {
    id: "entity-community",
    name: "Community Mission",
    type: "project",
    description: "Volunteer corps, community engagement",
    properties: {},
    aliases: [],
  },
  {
    id: "entity-ai-gateway",
    name: "AI Gateway",
    type: "technology",
    description: "Provider-agnostic AI abstraction layer",
    properties: {},
    aliases: [],
  },
  {
    id: "entity-bdl",
    name: "Bhavya Design Language",
    type: "standard",
    description: "UI design tokens, typography, visual hierarchy",
    properties: {},
    aliases: ["BDL"],
  },
  {
    id: "entity-bar",
    name: "Bhavya Architecture Rules",
    type: "standard",
    description: "Monorepo dependency rules, design system isolation",
    properties: {},
    aliases: ["BAR"],
  },
  {
    id: "entity-bps",
    name: "Bhavya Production Standards",
    type: "standard",
    description: "CI/CD quality gates, bundle budgets, testing requirements",
    properties: {},
    aliases: ["BPS"],
  },
  {
    id: "entity-himachal",
    name: "Himachal Pradesh",
    type: "location",
    description: "Primary operational region for Bhavya Foundation",
    properties: {},
    aliases: [],
  },
  {
    id: "entity-cedrus",
    name: "Cedrus deodara",
    type: "species",
    description:
      "Himalayan Cedar \u2014 native tree species in plantation programs",
    properties: {},
    aliases: ["Deodar", "Himalayan Cedar"],
  },
];

// ── Entity Extraction ──────────────────────────────────────

function matchEntityToDocument(
  entity: Omit<Entity, "documentIds" | "mentions" | "created" | "updated">,
  docText: string,
): boolean {
  const lowerText = docText.toLowerCase();
  if (lowerText.includes(entity.name.toLowerCase())) return true;
  for (const alias of entity.aliases) {
    if (lowerText.includes(alias.toLowerCase())) return true;
  }
  return false;
}

// ── Entity Repository ──────────────────────────────────────

let _entitiesCache: Entity[] | null = null;

export function getEntities(): Entity[] {
  if (!_entitiesCache) {
    const docs = getDocuments();
    const now = new Date().toISOString();
    _entitiesCache = SEED_ENTITIES.map((entity) => {
      const matchingDocs = docs.filter((d) => {
        const text = `${d.title} ${d.content} ${d.summary}`.toLowerCase();
        return matchEntityToDocument(entity, text);
      });
      return {
        ...entity,
        documentIds: matchingDocs.map((d) => d.id),
        mentions: matchingDocs.length,
        created: now,
        updated: now,
      };
    });
  }
  return _entitiesCache;
}

export function getEntity(id: string): Entity | undefined {
  return getEntities().find((e) => e.id === id);
}

export function getEntitiesByType(type: EntityType): Entity[] {
  return getEntities().filter((e) => e.type === type);
}

export function searchEntities(query: string): Entity[] {
  const q = query.toLowerCase();
  return getEntities().filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q),
  );
}
