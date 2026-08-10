import {
  getDocuments as _getDocuments,
  getDocument as _getDocument,
  getDocumentsByCategory as _getDocumentsByCategory,
  getRecentDocuments as _getRecentDocuments,
  getKnowledgeGraph as _getKnowledgeGraph,
  getGraphNode as _getGraphNode,
  getLinkedNodes as _getLinkedNodes,
  getCollections as _getCollections,
  getCollection as _getCollection,
  getEntities as _getEntities,
  getEntity as _getEntity,
  getEntitiesByType as _getEntitiesByType,
  searchEntities as _searchEntities,
  getRelationships as _getRelationships,
  getRelationshipsBySource as _getRelationshipsBySource,
  getRelationshipsByTarget as _getRelationshipsByTarget,
  getGraphNodeNeighbors as _getGraphNodeNeighbors,
  getGraphStats as _getGraphStats,
  getSearchIndex as _getSearchIndex,
  searchAll as _searchAll,
  searchDocuments as _searchDocuments,
  getContentStats as _getContentStats,
} from "@bhavya/content-core";

export const getDocuments = _getDocuments;
export const getDocument = _getDocument;
export const getDocumentsByCategory = _getDocumentsByCategory;
export const getRecentDocuments = _getRecentDocuments;
export const getKnowledgeGraph = _getKnowledgeGraph;
export const getGraphNode = _getGraphNode;
export const getLinkedNodes = _getLinkedNodes;
export const getCollections = _getCollections;
export const getCollection = _getCollection;
export const getEntities = _getEntities;
export const getEntity = _getEntity;
export const getEntitiesByType = _getEntitiesByType;
export const searchEntities = _searchEntities;
export const getRelationships = _getRelationships;
export const getRelationshipsBySource = _getRelationshipsBySource;
export const getRelationshipsByTarget = _getRelationshipsByTarget;
export const getGraphNodeNeighbors = _getGraphNodeNeighbors;
export const getGraphStats = _getGraphStats;
export const getSearchIndex = _getSearchIndex;
export const searchAll = _searchAll;
export const searchDocuments = _searchDocuments;
export const getKnowledgeStats = _getContentStats;

export type {
  Document as KnowledgeDocument,
  DocumentCategory,
  Collection,
  GraphNode,
  Entity,
  EntityType,
  ContentStats as KnowledgeStats,
} from "@bhavya/content-core";
