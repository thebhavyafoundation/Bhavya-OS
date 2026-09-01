// Finance Service
// Budgets, grants, donations, financial reports.

export interface Budget {
  id: string;
  name: string;
  fiscalYear: string;
  totalAllocation: number;
  spent: number;
  remaining: number;
  categories: BudgetCategory[];
  status: 'draft' | 'approved' | 'active' | 'closed';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

export interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
  projects: string[];
}

export interface Grant {
  id: string;
  name: string;
  donor: string;
  amount: number;
  purpose: string;
  status: 'applied' | 'approved' | 'received' | 'utilized' | 'closed';
  appliedAt: Date;
  receivedAt?: Date;
  utilizationDeadline?: Date;
  utilizedAmount: number;
  reports: GrantReport[];
  metadata: Record<string, unknown>;
}

export interface GrantReport {
  id: string;
  period: string;
  amountUtilized: number;
  activities: string[];
  submittedAt: Date;
}

export interface Donation {
  id: string;
  donor: string;
  amount: number;
  date: Date;
  method: string;
  restricted: boolean;
  purpose?: string;
  receiptIssued: boolean;
  taxDeductible: boolean;
  metadata: Record<string, unknown>;
}

export interface FinancialReport {
  id: string;
  title: string;
  period: string;
  type: 'monthly' | 'quarterly' | 'annual' | 'audit';
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  incomeByCategory: Record<string, number>;
  expensesByCategory: Record<string, number>;
  generatedAt: Date;
  approvedBy?: string;
  documentId?: string;
  metadata: Record<string, unknown>;
}

export interface FinanceInput {
  action: 'create-budget' | 'approve-budget' | 'record-grant' | 'update-grant' | 'record-donation' | 'generate-report' | 'get-budget' | 'get-grants' | 'get-donations' | 'get-report';
  budgetId?: string;
  grantId?: string;
  donationId?: string;
  name?: string;
  donor?: string;
  amount?: number;
  purpose?: string;
  fiscalYear?: string;
  period?: string;
  approver?: string;
  categories?: BudgetCategory[];
}

export class FinanceService {
  name = 'finance';
  description = 'Budgets, grants, donations, financial reports';
  capabilities = [
    'create-budget',
    'approve-budget',
    'record-grant',
    'update-grant',
    'record-donation',
    'generate-report',
    'search-financial',
    'audit-trail',
  ];

  private budgets = new Map<string, Budget>();
  private grants = new Map<string, Grant>();
  private donations = new Map<string, Donation>();
  private reports = new Map<string, FinancialReport>();
  private auditLog: Array<{ action: string; id: string; agent: string; timestamp: Date; details: Record<string, unknown> }> = [];

  async initialize(): Promise<void> {
    // Ready
  }

  async execute(input: FinanceInput): Promise<{ success: boolean; result?: any }> {
    switch (input.action) {
      case 'create-budget':
        return this.createBudget(input);
      case 'approve-budget':
        return this.approveBudget(input);
      case 'record-grant':
        return this.recordGrant(input);
      case 'update-grant':
        return this.updateGrant(input);
      case 'record-donation':
        return this.recordDonation(input);
      case 'generate-report':
        return this.generateReport(input);
      case 'get-budget':
        return this.getBudget(input);
      case 'get-grants':
        return this.getGrants();
      case 'get-donations':
        return this.getDonations();
      case 'get-report':
        return this.getReport(input);
    }
  }

  private async createBudget(input: FinanceInput): Promise<{ success: boolean; budget?: Budget }> {
    if (!input.name || !input.fiscalYear || !input.amount || !input.categories) {
      return { success: false };
    }

    const budget: Budget = {
      id: `budget:${crypto.randomUUID()}`,
      name: input.name,
      fiscalYear: input.fiscalYear,
      totalAllocation: input.amount,
      spent: 0,
      remaining: input.amount,
      categories: input.categories,
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: {},
    };

    this.budgets.set(budget.id, budget);
    this.audit('create-budget', budget.id, 'finance', { name: budget.name });

    return { success: true, budget };
  }

  private async approveBudget(input: FinanceInput): Promise<{ success: boolean; budget?: Budget }> {
    if (!input.budgetId || !input.approver) return { success: false };

    const budget = this.budgets.get(input.budgetId);
    if (!budget) return { success: false };

    budget.status = 'approved';
    budget.approvedBy = input.approver;
    budget.approvedAt = new Date();
    budget.updatedAt = new Date();

    this.audit('approve-budget', budget.id, input.approver, {});

    return { success: true, budget };
  }

  private async recordGrant(input: FinanceInput): Promise<{ success: boolean; grant?: Grant }> {
    if (!input.name || !input.donor || !input.amount) return { success: false };

    const grant: Grant = {
      id: `grant:${crypto.randomUUID()}`,
      name: input.name,
      donor: input.donor,
      amount: input.amount,
      purpose: input.purpose ?? '',
      status: 'received',
      appliedAt: new Date(),
      receivedAt: new Date(),
      utilizedAmount: 0,
      reports: [],
      metadata: {},
    };

    this.grants.set(grant.id, grant);
    this.audit('record-grant', grant.id, 'finance', { name: grant.name, donor: grant.donor });

    return { success: true, grant };
  }

  private async updateGrant(input: FinanceInput): Promise<{ success: boolean; grant?: Grant }> {
    if (!input.grantId) return { success: false };

    const grant = this.grants.get(input.grantId);
    if (!grant) return { success: false };

    if (input.amount) grant.utilizedAmount += input.amount;
    if (input.purpose) grant.purpose = input.purpose;

    this.audit('update-grant', grant.id, 'finance', { utilized: input.amount });

    return { success: true, grant };
  }

  private async recordDonation(input: FinanceInput): Promise<{ success: boolean; donation?: Donation }> {
    if (!input.donor || !input.amount) return { success: false };

    const donation: Donation = {
      id: `donation:${crypto.randomUUID()}`,
      donor: input.donor,
      amount: input.amount,
      date: new Date(),
      method: 'unknown',
      restricted: false,
      purpose: input.purpose,
      receiptIssued: false,
      taxDeductible: true,
      metadata: {},
    };

    this.donations.set(donation.id, donation);
    this.audit('record-donation', donation.id, 'finance', { donor: donation.donor, amount: donation.amount });

    return { success: true, donation };
  }

  private async generateReport(input: FinanceInput): Promise<{ success: boolean; report?: FinancialReport }> {
    if (!input.period || !input.action) return { success: false };

    const totalIncome = Array.from(this.donations.values()).reduce((sum, d) => sum + d.amount, 0)
      + Array.from(this.grants.values()).reduce((sum, g) => sum + g.amount, 0);

    const totalExpenses = Array.from(this.budgets.values()).reduce((sum, b) => sum + b.spent, 0);

    const report: FinancialReport = {
      id: `report:${crypto.randomUUID()}`,
      title: `${input.action} Financial Report - ${input.period}`,
      period: input.period,
      type: input.action as any,
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      incomeByCategory: { donations: totalIncome * 0.6, grants: totalIncome * 0.4 },
      expensesByCategory: { programs: totalExpenses * 0.7, admin: totalExpenses * 0.2, fundraising: totalExpenses * 0.1 },
      generatedAt: new Date(),
      metadata: {},
    };

    this.reports.set(report.id, report);
    this.audit('generate-report', report.id, 'finance', { period: report.period });

    return { success: true, report };
  }

  private async getBudget(input: FinanceInput): Promise<{ success: boolean; budget?: Budget }> {
    if (!input.budgetId) return { success: false };
    const budget = this.budgets.get(input.budgetId);
    return { success: !!budget, budget };
  }

  private async getGrants(): Promise<{ success: boolean; grants: Grant[] }> {
    return { success: true, grants: Array.from(this.grants.values()) };
  }

  private async getDonations(): Promise<{ success: boolean; donations: Donation[] }> {
    return { success: true, donations: Array.from(this.donations.values()) };
  }

  private async getReport(input: FinanceInput): Promise<{ success: boolean; report?: FinancialReport }> {
    if (!input.period) return { success: false };
    const report = Array.from(this.reports.values()).find((r) => r.period === input.period);
    return { success: !!report, report };
  }

  getAuditLog() {
    return [...this.auditLog];
  }

  private audit(action: string, id: string, agent: string, details: Record<string, unknown>): void {
    this.auditLog.push({ action, id, agent, timestamp: new Date(), details });
  }

  async shutdown(): Promise<void> {
    this.budgets.clear();
    this.grants.clear();
    this.donations.clear();
    this.reports.clear();
    this.auditLog = [];
  }
}
