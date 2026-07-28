// Recognition Service
// Track contributions, hours, achievements, certificates.

export interface Recognition {
  id: string;
  personId: string;
  type: 'hours' | 'project-completion' | 'achievement' | 'certificate' | 'recommendation';
  title: string;
  description: string;
  missionId?: string;
  projectId?: string;
  value?: number;
  unit?: string;
  awardedAt: Date;
  awardedBy: string;
  verified: boolean;
  publicVisible: boolean;
  metadata: Record<string, unknown>;
}

export interface RecognitionInput {
  action: 'award-hours' | 'award-achievement' | 'award-certificate' | 'add-recommendation' | 'list' | 'get' | 'get-by-person' | 'get-public' | 'get-stats';
  recognitionId?: string;
  personId?: string;
  missionId?: string;
  projectId?: string;
  title?: string;
  description?: string;
  hours?: number;
  achievementName?: string;
  certName?: string;
  recommendedBy?: string;
  publicVisible?: boolean;
}

export class RecognitionService {
  name = 'recognition';
  description = 'Track contributions, hours, achievements, certificates';
  capabilities = [
    'award-hours',
    'award-achievement',
    'award-certificate',
    'add-recommendation',
    'query-recognition',
    'generate-stats',
    'audit-trail',
  ];

  private recognitions = new Map<string, Recognition>();
  private auditLog: Array<{ action: string; recognitionId: string; agent: string; timestamp: Date; details: Record<string, unknown> }> = [];

  async initialize(): Promise<void> {
    // Ready
  }

  async execute(input: RecognitionInput): Promise<{ success: boolean; result?: any }> {
    switch (input.action) {
      case 'award-hours':
        return this.awardHours(input);
      case 'award-achievement':
        return this.awardAchievement(input);
      case 'award-certificate':
        return this.awardCertificate(input);
      case 'add-recommendation':
        return this.addRecommendation(input);
      case 'list':
        return this.list();
      case 'get':
        return this.get(input);
      case 'get-by-person':
        return this.getByPerson(input);
      case 'get-public':
        return this.getPublic(input);
      case 'get-stats':
        return this.getStats(input);
    }
  }

  private async awardHours(input: RecognitionInput): Promise<{ success: boolean; recognition?: Recognition }> {
    if (!input.personId || !input.hours || !input.missionId) return { success: false };

    const recognition: Recognition = {
      id: `rec:${crypto.randomUUID()}`,
      personId: input.personId,
      type: 'hours',
      title: `${input.hours} hours logged`,
      description: input.description ?? '',
      missionId: input.missionId,
      projectId: input.projectId,
      value: input.hours,
      unit: 'hours',
      awardedAt: new Date(),
      awardedBy: 'system',
      verified: true,
      publicVisible: input.publicVisible ?? false,
      metadata: {},
    };

    this.recognitions.set(recognition.id, recognition);
    this.audit('award-hours', recognition.id, 'recognition', { hours: input.hours });

    return { success: true, recognition };
  }

  private async awardAchievement(input: RecognitionInput): Promise<{ success: boolean; recognition?: Recognition }> {
    if (!input.personId || !input.achievementName) return { success: false };

    const recognition: Recognition = {
      id: `rec:${crypto.randomUUID()}`,
      personId: input.personId,
      type: 'achievement',
      title: input.achievementName,
      description: input.description ?? '',
      missionId: input.missionId,
      awardedAt: new Date(),
      awardedBy: 'system',
      verified: true,
      publicVisible: input.publicVisible ?? true,
      metadata: {},
    };

    this.recognitions.set(recognition.id, recognition);
    this.audit('award-achievement', recognition.id, 'recognition', { achievement: input.achievementName });

    return { success: true, recognition };
  }

  private async awardCertificate(input: RecognitionInput): Promise<{ success: boolean; recognition?: Recognition }> {
    if (!input.personId || !input.certName) return { success: false };

    const recognition: Recognition = {
      id: `rec:${crypto.randomUUID()}`,
      personId: input.personId,
      type: 'certificate',
      title: input.certName,
      description: input.description ?? '',
      awardedAt: new Date(),
      awardedBy: 'system',
      verified: true,
      publicVisible: input.publicVisible ?? true,
      metadata: {},
    };

    this.recognitions.set(recognition.id, recognition);
    this.audit('award-certificate', recognition.id, 'recognition', { cert: input.certName });

    return { success: true, recognition };
  }

  private async addRecommendation(input: RecognitionInput): Promise<{ success: boolean; recognition?: Recognition }> {
    if (!input.personId || !input.recommendedBy || !input.description) return { success: false };

    const recognition: Recognition = {
      id: `rec:${crypto.randomUUID()}`,
      personId: input.personId,
      type: 'recommendation',
      title: `Recommendation by ${input.recommendedBy}`,
      description: input.description,
      awardedAt: new Date(),
      awardedBy: input.recommendedBy,
      verified: false,
      publicVisible: input.publicVisible ?? false,
      metadata: {},
    };

    this.recognitions.set(recognition.id, recognition);
    this.audit('add-recommendation', recognition.id, 'recognition', { by: input.recommendedBy });

    return { success: true, recognition };
  }

  private async list(): Promise<{ success: boolean; recognitions: Recognition[] }> {
    return { success: true, recognitions: Array.from(this.recognitions.values()) };
  }

  private async get(input: RecognitionInput): Promise<{ success: boolean; recognition?: Recognition }> {
    if (!input.recognitionId) return { success: false };
    const recognition = this.recognitions.get(input.recognitionId);
    return { success: !!recognition, recognition };
  }

  private async getByPerson(input: RecognitionInput): Promise<{ success: boolean; recognitions: Recognition[] }> {
    if (!input.personId) return { success: false, recognitions: [] };
    const recognitions = Array.from(this.recognitions.values()).filter((r) => r.personId === input.personId);
    return { success: true, recognitions };
  }

  private async getPublic(input: RecognitionInput): Promise<{ success: boolean; recognitions: Recognition[] }> {
    const recognitions = Array.from(this.recognitions.values()).filter((r) => r.publicVisible);
    return { success: true, recognitions };
  }

  private async getStats(input: RecognitionInput): Promise<{ success: boolean; stats: Record<string, unknown> }> {
    if (!input.personId) return { success: false, stats: {} };

    const personRecs = Array.from(this.recognitions.values()).filter((r) => r.personId === input.personId);
    const totalHours = personRecs.filter((r) => r.type === 'hours').reduce((sum, r) => sum + (r.value ?? 0), 0);
    const achievements = personRecs.filter((r) => r.type === 'achievement').length;
    const certificates = personRecs.filter((r) => r.type === 'certificate').length;

    return {
      success: true,
      stats: {
        personId: input.personId,
        totalHours,
        achievements,
        certificates,
        totalRecognitions: personRecs.length,
      },
    };
  }

  getAuditLog() {
    return [...this.auditLog];
  }

  private audit(action: string, recognitionId: string, agent: string, details: Record<string, unknown>): void {
    this.auditLog.push({ action, recognitionId, agent, timestamp: new Date(), details });
  }

  async shutdown(): Promise<void> {
    this.recognitions.clear();
    this.auditLog = [];
  }
}
