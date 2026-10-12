import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("certify_documents", (table) => {
    table.string("id", 100).primary();
    table.string("user_id", 100).notNullable();
    table.text("file");
    table.integer("status").notNullable().defaultTo(1);
    table.text("message");
    table.dateTime("created_at");
    table.dateTime("updated_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("certify_documents");
}
