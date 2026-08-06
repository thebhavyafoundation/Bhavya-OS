/**
 * Bhavya OS — Review Module
 * Code review and quality gates.
 */

export class Review {
  constructor() {
    this.reviews = new Map();
    this.gates = [
      { id: "typecheck", name: "TypeScript Type Check", required: true },
      { id: "lint", name: "ESLint", required: true },
      { id: "build", name: "Build", required: true },
      { id: "accessibility", name: "Accessibility", required: true },
      { id: "performance", name: "Performance", required: false },
      { id: "architecture", name: "Architecture Validation", required: true },
      { id: "dependency", name: "Dependency Validation", required: true },
      { id: "documentation", name: "Documentation", required: false },
    ];
  }

  async createReview(submission) {
    const review = {
      id: `review-${Date.now()}`,
      submission,
      status: "pending",
      gateResults: [],
      createdAt: new Date().toISOString(),
    };
    this.reviews.set(review.id, review);
    return review;
  }

  async runGate(reviewId, gateId, result) {
    const review = this.reviews.get(reviewId);
    if (!review) throw new Error(`Review ${reviewId} not found`);
    
    const gate = this.gates.find(g => g.id === gateId);
    if (!gate) throw new Error(`Gate ${gateId} not found`);
    
    review.gateResults.push({
      gateId,
      gateName: gate.name,
      ...result,
      timestamp: new Date().toISOString(),
    });
    
    return review;
  }

  async completeReview(reviewId) {
    const review = this.reviews.get(reviewId);
    if (!review) throw new Error(`Review ${reviewId} not found`);
    
    const requiredGates = this.gates.filter(g => g.required);
    const failedRequired = requiredGates.filter(gate => {
      const result = review.gateResults.find(r => r.gateId === gate.id);
      return result && !result.passed;
    });
    
    review.status = failedRequired.length > 0 ? "failed" : "passed";
    review.completedAt = new Date().toISOString();
    
    return review;
  }

  getReview(reviewId) {
    return this.reviews.get(reviewId);
  }

  listReviews(filter) {
    const reviews = [...this.reviews.values()];
    if (!filter) return reviews;
    return reviews.filter(filter);
  }
}
