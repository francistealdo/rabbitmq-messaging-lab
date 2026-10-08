import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect({
    hostname: process.env.RABBITMQ_HOST ?? "localhost",
    port: Number(process.env.RABBITMQ_PORT ?? 5672),
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
  });

  const channel = await connection.createChannel();

  await channel.assertExchange("topic-exchange", "topic");

  // Declare two queues for the topic exchange
  await channel.assertQueue("system-logs");
  await channel.assertQueue("system-errors");

  // Bind the system logs queue to the topic exchange with a routing key pattern logging all messages that start with "logs."
  await channel.bindQueue("system-logs", "topic-exchange", "logs.#");
  // Bind the system errors queue to the topic exchange with a routing key pattern logging all messages that end with ".error"
  await channel.bindQueue("system-errors", "topic-exchange", "#.error");

  // Publish messages to the topic exchange with different routing keys
  channel.publish(
    "topic-exchange",
    "logs.system.info",
    Buffer.from("My message from topic-exchange: logs.system.info"),
  );

  channel.publish(
    "topic-exchange",
    "logs.system.error",
    Buffer.from("My message from topic-exchange: logs.system.error"),
  );

  await channel.close();
  await connection.close();
}

main();
