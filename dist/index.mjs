// src/node/cli.ts
import cac from "cac";
var cli = cac();
cli.command("[root]", "Run the development server").alias("serve").alias("dev").action(async () => {
  console.log("\u6D4B\u8BD5 cli~");
});
cli.help();
cli.parse();
//# sourceMappingURL=index.mjs.map