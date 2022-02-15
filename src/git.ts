import { spawnSync } from "child_process";

export function getBaseCommit(targetBranch: string) {
  const output = run("git", ["--no-optional-locks", "merge-base", "HEAD", targetBranch]);
  return output.trim();
}

export function run(command: string, args: string[]): string {
  const ps = spawnSync(command, args, {
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });
  return ps.stdout.toString();
}
