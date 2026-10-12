import { CronJob } from "cron";
import CertifyDocumentModel from "../models/CertifyDocumentModel.ts";
import { connect } from "../configs/rabbitmq/RabbitMQConfig.ts";
import { certifyDocument } from "../usecases/CertifyDocumentUseCase.ts";

class CertifyDocumentConsumerCronJob {
  private isCronRunning: boolean = false;
  async start() {
    const channel = await connect.createChannel();
    await channel.prefetch(5);

    new CronJob(
      "*/5 * * * * *",
      async () => {
        if (this.isCronRunning) {
          return;
        }

        this.isCronRunning = true;

        channel.consume(
          "certify_document_queue",
          async (msg) => {
            if (msg) {
              const messageContent = JSON.parse(msg.content.toString());
              console.log(
                `Received message from queue: ${JSON.stringify(messageContent)}`,
              );

              const certify = await CertifyDocumentModel.getById(
                messageContent.documentId,
              );
              if (!certify) {
                console.log(
                  `Document with ID ${messageContent.documentId} not found.`,
                );
                channel.nack(msg, false, false);
                return;
              }

              try {
                await certifyDocument(Buffer.from(certify.file, "base64"));
                await CertifyDocumentModel.setProcessed(certify.id);
                console.log(`Document ${certify.id} processed successfully.`);
              } catch (err: any) {
                const message =
                  err instanceof Error ? err.message : "Unknown error";
                console.log(message);
                await CertifyDocumentModel.setErrored(certify.id, message);
              }
            }
          },
          { noAck: false },
        );

        this.isCronRunning = false;
      },
      null,
      true,
      "America/Sao_Paulo",
    );
  }
}

export default new CertifyDocumentConsumerCronJob();
