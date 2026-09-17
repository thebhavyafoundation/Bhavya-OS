// Resource Registry
// Track volunteers, staff, equipment, grants, documents, assets.
// Every resource belongs to exactly one mission.

export interface Resource {
  id: string;
  missionId: string;
  type:
    | "volunteer"
    | "staff"
    | "equipment"
    | "vehicle"
    | "grant"
    | "document"
    | "asset"
    | "material";
  name: string;
  description: string;
  status: "available" | "assigned" | "in-use" | "reserved" | "retired";
  assignedTo?: string; // project or task ID
  quantity: number;
  unit: string;
  cost?: number;
  source?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  metadata: Record<string, unknown>;
}

export interface ResourceInput {
  action:
    | "register"
    | "assign"
    | "release"
    | "update"
    | "list"
    | "get"
    | "get-by-mission"
    | "get-by-type";
  resourceId?: string;
  missionId?: string;
  type?: Resource["type"];
  name?: string;
  description?: string;
  quantity?: number;
  unit?: string;
  cost?: number;
  assignedTo?: string;
  typeFilter?: string;
}

export class ResourceRegistry {
  name = "resources";
  description = "Track all resources belonging to missions";
  capabilities = [
    "register-resource",
    "assign-resource",
    "release-resource",
    "query-resources",
    "audit-trail",
  ];

  private resources = new Map<string, Resource>();
  private auditLog: Array<{
    action: string;
    resourceId: string;
    agent: string;
    timestamp: Date;
    details: Record<string, unknown>;
  }> = [];

  async initialize(): Promise<void> {
    // Ready
  }

  async execute(
    input: ResourceInput,
  ): Promise<{ success: boolean; result?: unknown }> {
    switch (input.action) {
      case "register":
        return this.register(input);
      case "assign":
        return this.assign(input);
      case "release":
        return this.release(input);
      case "update":
        return this.update(input);
      case "list":
        return this.list();
      case "get":
        return this.get(input);
      case "get-by-mission":
        return this.getByMission(input);
      case "get-by-type":
        return this.getByType(input);
    }
  }

  private async register(
    input: ResourceInput,
  ): Promise<{ success: boolean; resource?: Resource }> {
    if (
      !input.missionId ||
      !input.type ||
      !input.name ||
      !input.quantity ||
      !input.unit
    ) {
      return { success: false };
    }

    const resource: Resource = {
      id: `res:${crypto.randomUUID()}`,
      missionId: input.missionId,
      type: input.type,
      name: input.name,
      description: input.description ?? "",
      status: "available",
      quantity: input.quantity,
      unit: input.unit,
      cost: input.cost,
      metadata: {},
    };

    this.resources.set(resource.id, resource);
    this.audit("register", resource.id, "resource-registry", {
      name: resource.name,
      type: resource.type,
    });

    return { success: true, resource };
  }

  private async assign(
    input: ResourceInput,
  ): Promise<{ success: boolean; resource?: Resource }> {
    if (!input.resourceId || !input.assignedTo) return { success: false };

    const resource = this.resources.get(input.resourceId);
    if (!resource) return { success: false };

    resource.status = "assigned";
    resource.assignedTo = input.assignedTo;
    this.audit("assign", resource.id, "resource-registry", {
      assignedTo: input.assignedTo,
    });

    return { success: true, resource };
  }

  private async release(
    input: ResourceInput,
  ): Promise<{ success: boolean; resource?: Resource }> {
    if (!input.resourceId) return { success: false };

    const resource = this.resources.get(input.resourceId);
    if (!resource) return { success: false };

    resource.status = "available";
    resource.assignedTo = undefined;
    this.audit("release", resource.id, "resource-registry", {});

    return { success: true, resource };
  }

  private async update(
    input: ResourceInput,
  ): Promise<{ success: boolean; resource?: Resource }> {
    if (!input.resourceId) return { success: false };

    const resource = this.resources.get(input.resourceId);
    if (!resource) return { success: false };

    if (input.name) resource.name = input.name;
    if (input.description) resource.description = input.description;
    if (input.quantity) resource.quantity = input.quantity;
    if (input.cost) resource.cost = input.cost;
    this.audit("update", resource.id, "resource-registry", {});

    return { success: true, resource };
  }

  private async list(): Promise<{ success: boolean; resources: Resource[] }> {
    return { success: true, resources: Array.from(this.resources.values()) };
  }

  private async get(
    input: ResourceInput,
  ): Promise<{ success: boolean; resource?: Resource }> {
    if (!input.resourceId) return { success: false };
    const resource = this.resources.get(input.resourceId);
    return { success: !!resource, resource };
  }

  private async getByMission(
    input: ResourceInput,
  ): Promise<{ success: boolean; resources: Resource[] }> {
    if (!input.missionId) return { success: false, resources: [] };
    const resources = Array.from(this.resources.values()).filter(
      (r) => r.missionId === input.missionId,
    );
    return { success: true, resources };
  }

  private async getByType(
    input: ResourceInput,
  ): Promise<{ success: boolean; resources: Resource[] }> {
    if (!input.typeFilter) return { success: false, resources: [] };
    const resources = Array.from(this.resources.values()).filter(
      (r) => r.type === input.typeFilter,
    );
    return { success: true, resources };
  }

  getAuditLog() {
    return [...this.auditLog];
  }

  private audit(
    action: string,
    resourceId: string,
    agent: string,
    details: Record<string, unknown>,
  ): void {
    this.auditLog.push({
      action,
      resourceId,
      agent,
      timestamp: new Date(),
      details,
    });
  }

  async shutdown(): Promise<void> {
    this.resources.clear();
    this.auditLog = [];
  }
}
