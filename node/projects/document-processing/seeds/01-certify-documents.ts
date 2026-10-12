import { randomUUID } from "crypto";
import type { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  await knex("certify_documents").del();

  const rows = [];

  for (let i = 0; i < 100; i++) {
    rows.push({
      id: randomUUID(),
      user_id: randomUUID(),
      file: Buffer.from(randomUUID()).toString("base64"),
      status: 1,
      message: "",
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    });
  }

  await knex("certify_documents").insert(rows);
}
