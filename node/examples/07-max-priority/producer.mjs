import amqp from "amqplib";
import { randomUUID } from "crypto";

async function main() {
  const connection = await amqp.connect({
    hostname: process.env.RABBITMQ_HOST ?? "localhost",
    port: Number(process.env.RABBITMQ_PORT ?? 5672),
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
  });

  const channel = await connection.createChannel();

  await channel.assertQueue("priority-queue", {
    durable: true,
    maxPriority: 5, // Set the maximum priority level for the queue
  });

  // Publish messages without priority
  for (let i = 1; i <= 10; i++) {
    channel.publish(
      "",
      "priority-queue",
      Buffer.from(`Message ${i} without priority - ${randomUUID()}`),
    );
  }

  // Publish a message with a specific priority level
  channel.publish(
    "",
    "priority-queue",
    Buffer.from(`Message with priority 1 - ${randomUUID()}`),
    {
      priority: 1, // Set the priority level for this message
    },
  );

  channel.publish(
    "",
    "priority-queue",
    Buffer.from(`Message with priority 5 - ${randomUUID()}`),
    {
      priority: 5, // Set the priority level for this message
    },
  );

  await channel.close();
  await connection.close();
}

main();
