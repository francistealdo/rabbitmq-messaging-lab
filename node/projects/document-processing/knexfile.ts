import type { Knex } from "knex";
import { databaseConfig } from "./src/configs/database/DatabaseConfig.ts";

const config: Knex.Config = {
  client: databaseConfig.client,
  connection: {
    filename: databaseConfig.filename,
  },
  useNullAsDefault: true,
  migrations: {
    directory: databaseConfig.migrationsDirectory,
  },
  seeds: {
    directory: databaseConfig.seedsDirectory,
  },
};

export default config;
