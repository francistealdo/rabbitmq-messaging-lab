import { CronJob } from "cron";
import CertifyDocumentModel from "../models/CertifyDocumentModel.ts";
import { connect } from "../configs/rabbitmq/RabbitMQConfig.ts";

class CertifyDocumentProducerCronJob {
  private isCronRunning: boolean = false;
  async start() {
    const channel = await connect.createChannel();
    await channel.assertQueue("certify_document_queue", { durable: true });

    new CronJob(
      "*/5 * * * * *",
      async () => {
        if (this.isCronRunning) {
          return;
        }

        this.isCronRunning = true;

        const certifyPendings = await CertifyDocumentModel.getPendings(10);
        for (const certify of certifyPendings) {
          try {
            const rabbitMQMessage = {
              documentId: certify.id,
            };

            const send = await channel.publish(
              "",
              "certify_document_queue",
              Buffer.from(JSON.stringify(rabbitMQMessage)),
            );

            if (send) {
              await CertifyDocumentModel.setSendToQueue(certify.id);
              console.log(`Document ${certify.id} sent to queue successfully.`);
            }
          } catch (error) {
            console.error(
              `Error occurred while sending document ${certify.id} to queue:`,
              error,
            );
          }
        }

        this.isCronRunning = false;
      },
      null,
      true,
      "America/Sao_Paulo",
    );
  }
}

export default new CertifyDocumentProducerCronJob();
