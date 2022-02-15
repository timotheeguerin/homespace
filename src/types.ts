export interface Workspace {
  name: string;
  rootPath: string;
  packages: WorkspacePackage[];
}

export interface WorkspacePackage {
  relativePath: string;
}
