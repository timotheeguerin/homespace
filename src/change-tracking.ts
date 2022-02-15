import { resolveWorkspace } from "./workspace.js";

export async function verifyChanges(workspaceDir: string) {
  const workspace = await resolveWorkspace(workspaceDir);
  console.log("Workspace", workspace);
}
