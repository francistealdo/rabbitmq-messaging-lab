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

  await channel.assertExchange("notifications", "headers");

  // Declare three queues for the headers exchange
  await channel.assertQueue("email-notifications");
  await channel.assertQueue("sms-notifications");
  await channel.assertQueue("push-notifications");

  // Bind the queues to the headers exchange with specific header values
  await channel.bindQueue("email-notifications", "notifications", "", {
    notification_type: "email",
  });
  await channel.bindQueue("sms-notifications", "notifications", "", {
    notification_type: "sms",
  });
  await channel.bindQueue("push-notifications", "notifications", "", {
    notification_type: "push",
  });

  // Publish messages to the headers exchange with specific header values
  channel.publish(
    "notifications",
    "",
    Buffer.from(
      `Email Message: Your account has been updated successfully! - ${randomUUID()}`,
    ),
    {
      headers: {
        notification_type: "email",
      },
    },
  );

  channel.publish(
    "notifications",
    "",
    Buffer.from(
      `SMS Message: Your account has been updated successfully! - ${randomUUID()}`,
    ),
    {
      headers: {
        notification_type: "sms",
      },
    },
  );

  channel.publish(
    "notifications",
    "",
    Buffer.from(
      `Push Message: Your account has been updated successfully! - ${randomUUID()}`,
    ),
    {
      headers: {
        notification_type: "push",
      },
    },
  );

  await channel.close();
  await connection.close();
}

main();
