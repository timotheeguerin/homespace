import { readFile } from "fs/promises";
import glob from "glob";
import { join } from "path";
import { promisify } from "util";
import { Workspace, WorkspacePackage } from "./types.js";

export async function resolveWorkspace(directory: string): Promise<Workspace> {
  const workspacePackage = await loadPackageJson(join(directory, "package.json"));
  const packages = await resolveWorkspacePackages(directory, workspacePackage.workspaces);
  return {
    rootPath: directory,
    name: workspacePackage.name ?? "n/a",
    packages,
  };
}

async function loadPackageJson(path: string) {
  const content = await readFile(path);
  return JSON.parse(content.toString());
}

const findFiles = promisify(glob);

async function resolveWorkspacePackages(root: string, packages: string[]): Promise<WorkspacePackage[]> {
  const result = [];
  for (const pattern of packages) {
    const resolvedPaths = await findFiles(pattern, {
      cwd: root,
    });
    for (const resolvedPath of resolvedPaths) {
      result.push({
        relativePath: resolvedPath,
      });
    }
  }
  return result;
}
