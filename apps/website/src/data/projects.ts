export type ProjectMission =
  | "Nature"
  | "Heritage"
  | "Knowledge"
  | "Community"
  | "Platform";

export type ProjectBudget = "Operational" | "Grant Funded";
export type ProjectStatus = "Active" | "Planning" | "Completed";

export interface SectorData {
  readonly name: string;
  readonly canopyDensity: string;
  readonly telemetry: string;
  readonly alerts: number;
}

export interface Project {
  id: string;
  name: string;
  mission: ProjectMission;
  budget: ProjectBudget;
  status: ProjectStatus;
  impact: string;
  sectors?: readonly SectorData[];
  type?: string;
  itemsCount?: string;
}

export const projects: readonly Project[] = [
  {
    id: "P-001",
    name: "Western Ghats Canopy Protection",
    mission: "Nature",
    budget: "Operational",
    status: "Active",
    impact: "14,200 hectares under satellite monitoring",
    sectors: [
      {
        name: "Sector A — Western Ghats",
        canopyDensity: "94.2%",
        telemetry: "Active",
        alerts: 0,
      },
      {
        name: "Sector B — Sacred Grove Corridor",
        canopyDensity: "88.7%",
        telemetry: "Active",
        alerts: 1,
      },
      {
        name: "Nilgiri Biosphere Buffer",
        canopyDensity: "91.5%",
        telemetry: "Active",
        alerts: 0,
      },
      {
        name: "Anamalai Wildlife Passage",
        canopyDensity: "96.0%",
        telemetry: "Active",
        alerts: 0,
      },
    ],
  },
  {
    id: "P-002",
    name: "Palm-Leaf Manuscript Digitization",
    mission: "Heritage",
    budget: "Grant Funded",
    status: "Active",
    impact: "4,200 manuscripts digitized via multispectral imaging",
    type: "3D & Multispectral Scan",
    itemsCount: "4,200 Manuscripts",
  },
  {
    id: "P-003",
    name: "Sacred Grove Restoration Network",
    mission: "Nature",
    budget: "Operational",
    status: "Active",
    impact: "32 groves under active restoration",
  },
  {
    id: "P-004",
    name: "Open Knowledge Platform",
    mission: "Knowledge",
    budget: "Operational",
    status: "Active",
    impact: "16 institutional standards published, 14+ knowledge graph nodes",
  },
  {
    id: "P-005",
    name: "Volunteer Corps Program",
    mission: "Community",
    budget: "Operational",
    status: "Active",
    impact: "Open enrollment — 4 regional chapters active",
  },
  {
    id: "P-006",
    name: "3D Heritage Architecture Scan",
    mission: "Heritage",
    budget: "Grant Funded",
    status: "Active",
    impact: "32 monuments scanned with millimeter-accurate photogrammetry",
    type: "3D Laser Mesh Scan",
    itemsCount: "32 Monuments",
  },
  {
    id: "P-007",
    name: "AI Gateway Infrastructure",
    mission: "Platform",
    budget: "Operational",
    status: "Active",
    impact: "Runtime v3.0 certified — provider-agnostic AI gateway",
  },
  {
    id: "P-008",
    name: "Community Education Workshops",
    mission: "Knowledge",
    budget: "Operational",
    status: "Active",
    impact: "4 regional chapters conducting ecology, heritage, and technology workshops",
  },
] as const;
