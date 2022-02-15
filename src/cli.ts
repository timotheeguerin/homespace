import yargs from "yargs";
import { verifyChanges } from "./change-tracking.js";

async function main() {
  await yargs(process.argv.slice(2)).command(
    "change",
    "Record changes",
    (cmd) =>
      cmd.option("verify", {
        type: "boolean",
        describe: "Verify there is no pending changes",
      }),
    async (args) => {
      if (args.verify) {
        await verifyChanges(process.cwd());
      }
    },
  ).argv;
}

main().catch((error) => {
  console.error("Uncaught error occurred");
  console.error();
  console.error(error);
  process.exit(1);
});
