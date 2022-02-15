import { stat } from "fs/promises";

export class HomespaceError extends Error {}

export async function isFile(path: string) {
  try {
    const stats = await stat(path);
    return stats.isFile();
  } catch {
    return false;
  }
}
