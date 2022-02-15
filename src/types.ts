export interface Workspace {
  type: "workspace";
  name: string;
  rootPath: string;
  packages: Record<string, WorkspacePackage>;
}

export interface WorkspacePackage {
  type: "package";
  name: string;
  path: string;
}
