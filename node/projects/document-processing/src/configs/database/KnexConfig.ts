import knex from "knex";
import { databaseConfig } from "./DatabaseConfig.ts";

const db = knex({
  client: databaseConfig.client,
  connection: {
    filename: databaseConfig.filename,
  },
  useNullAsDefault: true,
});

export default db;
