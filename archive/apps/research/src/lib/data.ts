import {
  getProjects as _getProjects,
  getProject as _getProject,
  getProjectsByStatus as _getProjectsByStatus,
  getProjectsByMission as _getProjectsByMission,
  createProject as _createProject,
  updateProject as _updateProject,
  advanceProject as _advanceProject,
  getSources as _getSources,
  getSourcesByProject as _getSourcesByProject,
  addSource as _addSource,
  getEvidence as _getEvidence,
  getEvidenceByProject as _getEvidenceByProject,
  addEvidence as _addEvidence,
  getReviews as _getReviews,
  getReviewsByProject as _getReviewsByProject,
  addReview as _addReview,
  getResearchStats as _getResearchStats,
} from "@bhavya/content-core";

export const getProjects = _getProjects;
export const getProject = _getProject;
export const getProjectsByStatus = _getProjectsByStatus;
export const getProjectsByMission = _getProjectsByMission;
export const createProject = _createProject;
export const updateProject = _updateProject;
export const advanceProject = _advanceProject;
export const getSources = _getSources;
export const getSourcesByProject = _getSourcesByProject;
export const addSource = _addSource;
export const getEvidence = _getEvidence;
export const getEvidenceByProject = _getEvidenceByProject;
export const addEvidence = _addEvidence;
export const getReviews = _getReviews;
export const getReviewsByProject = _getReviewsByProject;
export const addReview = _addReview;
export const getResearchStats = _getResearchStats;

export type {
  ResearchProject,
  Source,
  SourceType,
  Evidence,
  EvidenceStrength,
  Review,
  ReviewDecision,
  ResearchStatus,
  ResearchStats,
} from "@bhavya/content-core";
