import fs from "fs";
import path from "path";

export class MemoryReader {
  private memoryPath: string;

  constructor(memoryPath?: string) {
    this.memoryPath = memoryPath ?? path.resolve(process.cwd(), "../../memory");
  }

  readDomain<T = unknown>(domain: string): T | null {
    try {
      const filePath = path.join(this.memoryPath, domain, "_meta.json");
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
      }
    } catch (e) {
      console.error(`MemoryReader: failed to read domain '${domain}'`, e);
    }
    return null;
  }
}
