import amqp from "amqplib";
import { randomUUID } from "crypto";

async function main() {
  const connection = await amqp.connect({
    hostname: process.env.RABBITMQ_HOST ?? "localhost",
    port: Number(process.env.RABBITMQ_PORT ?? 5672),
    username: process.env.RABBITMQ_DEFAULT_USER,
    password: process.env.RABBITMQ_DEFAULT_PASS,
    vhost: "fanout-example", // Specify the virtual host for the fanout exchange
  });

  const channel = await connection.createChannel();

  await channel.assertExchange("notifications", "fanout");

  // Declare three queues for the fanout exchange
  await channel.assertQueue("email-notifications");
  await channel.assertQueue("sms-notifications");
  await channel.assertQueue("push-notifications");

  // Bind the queues to the fanout exchange
  await channel.bindQueue("email-notifications", "notifications", "");
  await channel.bindQueue("sms-notifications", "notifications", "");
  await channel.bindQueue("push-notifications", "notifications", "");

  // Publish a message to the fanout exchange
  channel.publish(
    "notifications",
    "",
    Buffer.from(
      `Message: Your account has been updated successfully! - ${randomUUID()}`,
    ),
  );

  await channel.close();
  await connection.close();
}

main();
