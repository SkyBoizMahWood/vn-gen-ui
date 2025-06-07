import "dotenv/config";

import nconf from "nconf";

nconf
  .env(["PORT", "NODE_ENV", "NEO4J_URL"])
  .argv({
    e: {
      alias: "NODE_ENV",
      describe: "Set production or development mode.",
      demand: false,
      default: "development",
    },
    p: {
      alias: "PORT",
      describe: "Port to run on.",
      demand: false,
      default: 3000,
    },
    n: {
      alias: "neo4j",
      describe: "Use local or remote neo4j instance",
      demand: false,
      default: "local",
    },
  })
  .defaults({
    USERNAME: process.env.NEO4J_USER,
    PASSWORD: process.env.NEO4J_PASS,
    neo4j: "local",
    "neo4j-url":
      process.env.NEO4J_URL ||
      `bolt://${process.env.NEO4J_HOST}:${process.env.NEO4J_PORT}` ||
      "bolt://localhost:7687",
  });

export default nconf;
