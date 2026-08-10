import {
  getHeritageMissions as _getHeritageMissions,
  getHeritageMission as _getHeritageMission,
  createHeritageMission as _createHeritageMission,
  getHeritageSites as _getHeritageSites,
  getHeritageSite as _getHeritageSite,
  getHeritageSitesByMission as _getHeritageSitesByMission,
  createHeritageSite as _createHeritageSite,
  getHeritageAssets as _getHeritageAssets,
  getHeritageAsset as _getHeritageAsset,
  getHeritageAssetsBySite as _getHeritageAssetsBySite,
  getHeritageAssetsByMission as _getHeritageAssetsByMission,
  createHeritageAsset as _createHeritageAsset,
  getAssessments as _getAssessments,
  getAssessment as _getAssessment,
  getAssessmentsByAsset as _getAssessmentsByAsset,
  createAssessment as _createAssessment,
  getDocumentations as _getDocumentations,
  getDocumentation as _getDocumentation,
  getDocumentationsByAsset as _getDocumentationsByAsset,
  createDocumentation as _createDocumentation,
  getConservationPlans as _getConservationPlans,
  getConservationPlan as _getConservationPlan,
  getConservationPlansByAsset as _getConservationPlansByAsset,
  createConservationPlan as _createConservationPlan,
  getHeritageImpactReports as _getHeritageImpactReports,
  getHeritageImpact as _getHeritageImpact,
  createHeritageImpact as _createHeritageImpact,
  getHeritageStats as _getHeritageStats,
} from "@bhavya/content-core";

export const getHeritageMissions = _getHeritageMissions;
export const getHeritageMission = _getHeritageMission;
export const createHeritageMission = _createHeritageMission;
export const getHeritageSites = _getHeritageSites;
export const getHeritageSite = _getHeritageSite;
export const getHeritageSitesByMission = _getHeritageSitesByMission;
export const createHeritageSite = _createHeritageSite;
export const getHeritageAssets = _getHeritageAssets;
export const getHeritageAsset = _getHeritageAsset;
export const getHeritageAssetsBySite = _getHeritageAssetsBySite;
export const getHeritageAssetsByMission = _getHeritageAssetsByMission;
export const createHeritageAsset = _createHeritageAsset;
export const getAssessments = _getAssessments;
export const getAssessment = _getAssessment;
export const getAssessmentsByAsset = _getAssessmentsByAsset;
export const createAssessment = _createAssessment;
export const getDocumentations = _getDocumentations;
export const getDocumentation = _getDocumentation;
export const getDocumentationsByAsset = _getDocumentationsByAsset;
export const createDocumentation = _createDocumentation;
export const getConservationPlans = _getConservationPlans;
export const getConservationPlan = _getConservationPlan;
export const getConservationPlansByAsset = _getConservationPlansByAsset;
export const createConservationPlan = _createConservationPlan;
export const getHeritageImpactReports = _getHeritageImpactReports;
export const getHeritageImpact = _getHeritageImpact;
export const createHeritageImpact = _createHeritageImpact;
export const getHeritageStats = _getHeritageStats;

export type {
  HeritageMission as Mission,
  HeritageSite as Site,
  HeritageAsset as Asset,
  AssetType,
  AssetCondition,
  ConditionAssessment as Assessment,
  AssessmentType,
  Documentation,
  DocumentationType,
  ConservationPlan,
  ConservationStatus,
  HeritageImpact as Impact,
  HeritageStats as Stats,
} from "@bhavya/content-core";
