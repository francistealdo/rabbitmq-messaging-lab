import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect({
    hostname: process.env.RABBITMQ_HOST ?? "localhost",
    port: Number(process.env.RABBITMQ_PORT ?? 5672),
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
  });

  const channel = await connection.createChannel();

  await channel.assertExchange("direct-exchange", "direct", {
    durable: true,
  });

  await channel.assertQueue("direct-exchange-queue-01", {
    durable: true,
  });

  await channel.assertQueue("direct-exchange-queue-02", {
    durable: true,
  });

  await channel.bindQueue(
    "direct-exchange-queue-01",
    "direct-exchange",
    "bind-key-for-queues",
  );

  await channel.bindQueue(
    "direct-exchange-queue-02",
    "direct-exchange",
    "bind-key-for-queues",
  );

  await channel.bindQueue(
    "direct-exchange-queue-01",
    "direct-exchange",
    "bind-key-only-for-queue-01",
  );

  // Publish a message to the exchange with the routing key for both queues
  channel.publish(
    "direct-exchange",
    "bind-key-for-queues",
    Buffer.from("My message from direct-exchange: bind-key-for-queues"),
  );

  // Publish a message to the exchange with the routing key for only queue 1
  channel.publish(
    "direct-exchange",
    "bind-key-only-for-queue-01",
    Buffer.from("My message from direct-exchange: bind-key-only-for-queue-01"),
  );

  await channel.close();
  await connection.close();
}

main();
