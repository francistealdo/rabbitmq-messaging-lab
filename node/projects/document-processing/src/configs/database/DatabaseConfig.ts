import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, "../../..");

export const databaseConfig = {
  client: "sqlite3",
  filename: path.join(projectRoot, "data", "document-processing.db"),
  migrationsDirectory: path.join(projectRoot, "migrations"),
  seedsDirectory: path.join(projectRoot, "seeds"),
};
