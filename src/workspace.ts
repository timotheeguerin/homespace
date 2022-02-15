import { readFile } from "fs/promises";
import glob from "glob";
import { join } from "path";
import { promisify } from "util";
import { Workspace, WorkspacePackage } from "./types.js";
import { HomespaceError, isFile } from "./utils.js";

export async function resolveWorkspace(directory: string): Promise<Workspace> {
  const workspace = await loadPackageOrWorkspace(directory);
  if (workspace === undefined) {
    throw new HomespaceError(`Workspace not found at "${directory}"`);
  }
  if (workspace.type === "package") {
    throw new HomespaceError(`Package "${directory}" is not a workspace. Missing "workspaces" property.`);
  }
  return workspace;
}

async function loadPackageJson(path: string) {
  const content = await readFile(path);
  return JSON.parse(content.toString());
}

const findFiles = promisify(glob);

async function resolveWorkspacePackages(root: string, packages: string[]): Promise<Record<string, WorkspacePackage>> {
  const result: Record<string, WorkspacePackage> = {};
  for (const pattern of packages) {
    const resolvedPaths = await findFiles(pattern, {
      cwd: root,
    });
    for (const relativePath of resolvedPaths) {
      const packagePath = join(root, relativePath);
      const packageOrWorkspace = await loadPackageOrWorkspace(packagePath);
      if (packageOrWorkspace === undefined) {
        continue;
      } else if (packageOrWorkspace.type === "package") {
        result[relativePath] = packageOrWorkspace;
      } else {
        for (const [nestedRelativePath, nestedPackage] of Object.entries(packageOrWorkspace.packages)) {
          result[join(relativePath, nestedRelativePath)] = nestedPackage;
        }
      }
    }
  }
  return result;
}

async function loadPackageOrWorkspace(directory: string): Promise<WorkspacePackage | Workspace | undefined> {
  const packageJsonPath = join(directory, "package.json");
  if (!(await isFile(packageJsonPath))) {
    return undefined;
  }
  const definition = await loadPackageJson(packageJsonPath);
  if (definition.workspaces) {
    const packages = await resolveWorkspacePackages(directory, definition.workspaces);
    return {
      type: "workspace",
      rootPath: directory,
      name: definition.name,
      packages,
    };
  } else {
    return {
      type: "package",
      name: definition.name,
      path: directory,
    };
  }
}
