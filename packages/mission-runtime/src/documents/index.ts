export interface Document {
  id: string;
  title: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: string;
  tags: string[];
  locale: string;
}

export interface DocumentProvider {
  get(id: string): Promise<Document | null>;
  list(type?: string): Promise<Document[]>;
  upload(doc: Omit<Document, "id" | "uploadedAt">): Promise<Document>;
  delete(id: string): Promise<boolean>;
}

export class DocumentService implements DocumentProvider {
  private docs: Map<string, Document> = new Map();

  async get(id: string): Promise<Document | null> {
    return this.docs.get(id) ?? null;
  }

  async list(type?: string): Promise<Document[]> {
    let results = [...this.docs.values()];
    if (type) results = results.filter(d => d.mimeType.startsWith(type));
    return results.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }

  async upload(doc: Omit<Document, "id" | "uploadedAt">): Promise<Document> {
    const entry: Document = {
      ...doc,
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      uploadedAt: new Date().toISOString(),
    };
    this.docs.set(entry.id, entry);
    return entry;
  }

  async delete(id: string): Promise<boolean> {
    return this.docs.delete(id);
  }
}
