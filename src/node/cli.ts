import cac from "cac";
import { startDevServer } from "./server";
import { build } from "./build";

const cli = cac();

cli
  .command("[root]", "Run the development server")
  .alias("serve")
  .alias("dev")
  .action(async () => {
    await startDevServer();
  });

cli.command("build", "Build the app for production").action(async () => {
  await build();
});

cli.help();

cli.parse();
