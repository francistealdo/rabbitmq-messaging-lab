import amqp from "amqplib";

async function main() {
  const connection = await amqp.connect({
    hostname: process.env.RABBITMQ_HOST ?? "localhost",
    port: Number(process.env.RABBITMQ_PORT ?? 5672),
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
  });

  const channel = await connection.createChannel();

  await channel.assertQueue("01-basic-queue", {
    durable: true,
  });

  channel.publish("", "01-basic-queue", Buffer.from("My message from publish"));

  channel.sendToQueue(
    "01-basic-queue",
    Buffer.from("My message from sendToQueue"),
  );

  await channel.close();
  await connection.close();
}

main();
