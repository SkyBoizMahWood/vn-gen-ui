import "dotenv/config";

import nconf from "nconf";

// Default Neo4j configuration
const DEFAULT_NEO4J_CONFIG = {
  URL: "bolt://localhost:7687",
  USER: "neo4j",
  PASS: "password",
  HOST: "localhost",
  PORT: "7687"
};

nconf
  .env(["PORT", "NODE_ENV", "NEO4J_URL", "NEO4J_USER", "NEO4J_PASS", "NEO4J_HOST", "NEO4J_PORT"])
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
  })
  .defaults({
    USERNAME: process.env.NEO4J_USER || DEFAULT_NEO4J_CONFIG.USER,
    PASSWORD: process.env.NEO4J_PASS || DEFAULT_NEO4J_CONFIG.PASS,
    "neo4j-url": process.env.NEO4J_URL || 
      `bolt://${process.env.NEO4J_HOST || DEFAULT_NEO4J_CONFIG.HOST}:${process.env.NEO4J_PORT || DEFAULT_NEO4J_CONFIG.PORT}`,
  });

export default nconf;
