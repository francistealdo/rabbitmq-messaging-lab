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

  await channel.assertExchange("notify_headers", "headers");

  // Declare three queues for the headers exchange
  await channel.assertQueue("email-notifications");
  await channel.assertQueue("sms-notifications");
  await channel.assertQueue("push-notifications");

  // Bind the queues to the headers exchange with specific header values
  await channel.bindQueue("email-notifications", "notify_headers", "", {
    notification_type: "email",
  });
  await channel.bindQueue("sms-notifications", "notify_headers", "", {
    notification_type: "sms",
  });
  await channel.bindQueue("push-notifications", "notify_headers", "", {
    notification_type: "push",
  });

  await channel.assertExchange("notify_fanout", "fanout");

  // Bind the queues to the fanout exchange
  await channel.bindQueue("email-notifications", "notify_fanout");
  await channel.bindQueue("sms-notifications", "notify_fanout");
  await channel.bindQueue("push-notifications", "notify_fanout");

  // Bind the fanout exchange to the headers exchange with a specific header value
  await channel.bindExchange("notify_fanout", "notify_headers", "", {
    notification_type: "all",
  });

  // Publish messages to the headers exchange with specific header values
  channel.publish(
    "notify_headers",
    "",
    Buffer.from(
      `Message - All: Your account has been updated successfully! - ${randomUUID()}`,
    ),
    {
      headers: {
        notification_type: "all",
      },
    },
  );

  await channel.close();
  await connection.close();
}

main();
