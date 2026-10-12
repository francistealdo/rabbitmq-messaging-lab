import knex from "knex";

const db = knex({
  client: "sqlite3",
  connection: {
    filename:
      process.env.SQLITE_DB_PATH ??
      "./projects/document-processing/data/document-processing.db",
  },
  useNullAsDefault: true,
});

export default db;
