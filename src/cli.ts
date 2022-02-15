import yargs from "yargs";

async function main() {
  await yargs(process.argv.slice(2));
}

main().catch((error) => {
  console.error("Uncaught error occurred");
  console.error();
  console.error(error);
  process.exit(1);
});
