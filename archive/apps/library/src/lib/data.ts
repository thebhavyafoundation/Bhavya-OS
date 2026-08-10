import {
  getDocuments as _getDocuments,
  getDocument as _getDocument,
  getDocumentsByCategory as _getDocumentsByCategory,
  getCollections as _getCollections,
  getCollection as _getCollection,
  searchDocuments as _searchDocuments,
} from "@bhavya/content-core";

export const getDocuments = _getDocuments;
export const getDocument = _getDocument;
export const getDocumentsByCategory = _getDocumentsByCategory;
export const getCollections = _getCollections;
export const getCollection = _getCollection;
export const searchDocuments = _searchDocuments;

export type {
  DocumentCategory as DocCategory,
  Document as LibraryDocument,
  Collection,
} from "@bhavya/content-core";
