export interface Workspace {
  name: string;
  rootPath: string;
  packages: Record<string, WorkspacePackage>;
}

export interface WorkspacePackage {
  path: string;
}
