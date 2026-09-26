/**
 * Mission profiles — constitutional source of truth for the four missions.
 *
 * Mandates are VERBATIM quotes from the archived 15-document legacy
 * constitution set (_archive/constitution-2026-09-05/); sources are cited
 * precisely. Roadmaps are plans ("Now/Next/Later"), never achievements, and
 * carry no digits (D1 — spec 2026-09-26-foundation-v2-design.md).
 *
 * @module mission-profiles
 */

export type MissionId = "forest" | "knowledge" | "heritage" | "community";

export interface MissionMandate {
  quote: string;
  source: string;
}

export interface RoadmapPhase {
  phase: "Now" | "Next" | "Later";
  title: string;
  intent: string;
}

export interface MissionProfile {
  id: MissionId;
  name: string;
  status: "active" | "planning";
  statusLabel: string;
  statusCopy: string;
  oneLiner: string;
  mandates: MissionMandate[];
  roadmap: RoadmapPhase[];
  accomplishments: string;
}

const PLANNING_ACCOMPLISHMENTS =
  "No accomplishments published yet — this mission has not launched. Progress will be published here with sources when it does.";

export const MISSION_PROFILES: readonly MissionProfile[] = [
  {
    id: "forest",
    name: "Forest Mission",
    status: "planning",
    statusLabel: "Not started — in planning",
    statusCopy:
      "Named by the constitution as a permanent mission. Field work has not started; sourced progress will appear on this page when it does.",
    oneLiner:
      "Restore ecosystems, protect biodiversity, and conserve water through long-term stewardship of native forests.",
    mandates: [
      {
        quote:
          "The Foundation shall establish the Bhavya Forest Mission as its flagship environmental initiative.",
        source:
          "Legacy Constitution (2026-09-05), Doc 12 — Environmental Conservation Policy, Article 3",
      },
      {
        quote:
          "The Foundation shall work towards restoring ecological balance and encouraging responsible environmental stewardship.",
        source:
          "Legacy Constitution (2026-09-05), Doc 1 — The Constitution, §13.2 (Pillar I: Nature)",
      },
    ],
    roadmap: [
      {
        phase: "Now",
        title: "Establish pilot plantations",
        intent:
          "Begin native-tree restoration with community participation and a maintenance and monitoring plan for every site.",
      },
      {
        phase: "Next",
        title: "Publish monitoring records",
        intent:
          "Share seasonal survival and growth observations with sources as they are collected in the field.",
      },
      {
        phase: "Later",
        title: "Scale community forestry",
        intent:
          "Extend restoration and watershed protection through school, Panchayat, and researcher partnerships.",
      },
    ],
    accomplishments: PLANNING_ACCOMPLISHMENTS,
  },
  {
    id: "knowledge",
    name: "Knowledge Mission",
    status: "active",
    statusLabel: "Active",
    statusCopy:
      "The academy and open curriculum are running now. Activity with dates and sources appears below.",
    oneLiner:
      "AI labs, digital libraries, research, and open education that treat knowledge as a public good.",
    mandates: [
      {
        quote: "Knowledge shall be regarded as a public good.",
        source:
          "Legacy Constitution (2026-09-05), Doc 1 — The Constitution, §13.4 (Pillar II: Knowledge)",
      },
      {
        quote:
          "Technology should never replace wisdom, compassion, or human judgment. Our mission is not to create more users of Artificial Intelligence, but to cultivate responsible creators, innovators, and leaders who use AI to solve real problems, uplift communities, and preserve human dignity.",
        source:
          "Legacy Constitution (2026-09-05), Doc 13 — AI Ethics and Responsible AI Policy, closing statement",
      },
    ],
    roadmap: [
      {
        phase: "Now",
        title: "Run the open AI curriculum",
        intent:
          "Keep the academy's lessons and knowledge objects freely available, and revise them with cited sources.",
      },
      {
        phase: "Next",
        title: "Establish Bhavya AI Labs",
        intent:
          "Open centres for learning, experimentation, and innovation under the Knowledge Mission.",
      },
      {
        phase: "Later",
        title: "Build the Bhavya Digital Library",
        intent:
          "Grow the digital library as the flagship institution of the Knowledge Mission, open to all.",
      },
    ],
    accomplishments:
      "Published with dates and sources as work happens — recent activity appears below.",
  },
  {
    id: "heritage",
    name: "Heritage Mission",
    status: "planning",
    statusLabel: "Not started — in planning",
    statusCopy:
      "Defined by the constitution as a permanent mission. Documentation has not started; sourced progress will appear here.",
    oneLiner:
      "Document and safeguard traditional knowledge, temples, architecture, history, and living heritage.",
    mandates: [
      {
        quote:
          "The Foundation recognizes that cultural heritage strengthens identity, continuity, and community wellbeing.",
        source:
          "Legacy Constitution (2026-09-05), Doc 1 — The Constitution, §13.7 (Pillar III: Heritage)",
      },
      {
        quote:
          "Where the Foundation undertakes work relating to temples or other heritage sites, it shall do so lawfully, respectfully, and in coordination with the relevant authorities, custodians, or managing bodies.",
        source:
          "Legacy Constitution (2026-09-05), Doc 1 — The Constitution, §13.7 (Pillar III: Heritage)",
      },
    ],
    roadmap: [
      {
        phase: "Now",
        title: "Begin documentation",
        intent:
          "Record temples, architecture, and oral histories — lawfully, respectfully, and with custodians' permission.",
      },
      {
        phase: "Next",
        title: "Publish open archives",
        intent:
          "Release heritage records and cultural-education material with sources for public access.",
      },
      {
        phase: "Later",
        title: "Support conservation",
        intent:
          "Assist conservation of heritage sites in coordination with the relevant authorities and managing bodies.",
      },
    ],
    accomplishments: PLANNING_ACCOMPLISHMENTS,
  },
  {
    id: "community",
    name: "Community Mission",
    status: "planning",
    statusLabel: "Not started — in planning",
    statusCopy:
      "Defined by the constitution as a permanent mission. The volunteer programme has not launched; sourced progress will appear here.",
    oneLiner:
      "Youth, women, schools, and villages — leadership, volunteering, and participation at the local level.",
    mandates: [
      {
        quote:
          "Volunteers are essential partners in advancing the Foundation's mission of environmental conservation, education, heritage preservation, and community development.",
        source:
          "Legacy Constitution (2026-09-05), Doc 10 — Volunteer Policy, Preamble",
      },
      {
        quote:
          "A volunteer is not someone who gives spare time. A volunteer is someone who chooses to share responsibility for the future. Every member of the Bhavya Volunteer Corps is a steward of our mission and an ambassador of our values.",
        source:
          "Legacy Constitution (2026-09-05), Doc 10 — Volunteer Policy, closing statement",
      },
    ],
    roadmap: [
      {
        phase: "Now",
        title: "Recruit the Bhavya Volunteer Corps",
        intent:
          "Establish a structured volunteer programme with clear standards for safety, ethics, and recognition.",
      },
      {
        phase: "Next",
        title: "Partner with schools",
        intent:
          "Work with schools on AI literacy, environmental education, and youth leadership programmes.",
      },
      {
        phase: "Later",
        title: "Grow village development",
        intent:
          "Support youth, women, and village communities through participation and local leadership.",
      },
    ],
    accomplishments: PLANNING_ACCOMPLISHMENTS,
  },
];

export function getMissionProfile(id: MissionId): MissionProfile {
  const profile = MISSION_PROFILES.find((m) => m.id === id);
  if (!profile) throw new Error(`Unknown mission id: ${id}`);
  return profile;
}
