import fs from "fs";
import path from "path";

export class RegistryReader {
  private registryPath: string;

  constructor(registryPath?: string) {
    this.registryPath = registryPath ?? path.resolve(process.cwd(), "../../registry");
  }

  read<T = unknown>(file: string): T | null {
    try {
      const filePath = path.join(this.registryPath, file);
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
      }
    } catch (e) {
      console.error(`RegistryReader: failed to read ${file}`, e);
    }
    return null;
  }
}
