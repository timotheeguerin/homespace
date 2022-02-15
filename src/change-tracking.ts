import { getRepoChanges } from "@rushstack/package-deps-hash";
import { getBaseCommit } from "./git.js";
import { resolveWorkspace } from "./workspace.js";

export async function verifyChanges(workspaceDir: string) {
  const workspace = await resolveWorkspace(workspaceDir);
  console.log("Workspace", workspace);
  const commitBase = getBaseCommit("main");
  const changes = getRepoChanges(workspaceDir, commitBase);
  console.log("Changes", changes);
}
