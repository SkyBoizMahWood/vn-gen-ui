import nconf from "./config";
import neo4j from "neo4j-driver";

const driver = neo4j.driver(
  nconf.get("neo4j-url"),
  neo4j.auth.basic(nconf.get("USERNAME"), nconf.get("PASSWORD")),
  {
    encrypted: 'ENCRYPTION_OFF',
    trust: 'TRUST_ALL_CERTIFICATES'
  }
);

export const getSession = () => driver.session();
export const db = driver;
