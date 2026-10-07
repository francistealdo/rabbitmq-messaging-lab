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

  channel.prefetch(5);

  channel.consume(
    "01-basic-queue",
    (data) => {
      console.log(data.content.toString());

      setTimeout(() => {
        channel.ack(data);
      }, 5000);
    },
    {
      noAck: false,
    },
  );
}

main();
