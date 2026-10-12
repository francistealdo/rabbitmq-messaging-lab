import amqp from "amqplib";

export const connect = await amqp.connect({
  hostname: process.env.RABBITMQ_HOST ?? "localhost",
  port: Number(process.env.RABBITMQ_PORT ?? 5672),
  username: process.env.RABBITMQ_DEFAULT_USER,
  password: process.env.RABBITMQ_DEFAULT_PASS,
});
