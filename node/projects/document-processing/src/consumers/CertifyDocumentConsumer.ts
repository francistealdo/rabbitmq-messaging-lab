import CertifyDocumentModel from "../models/CertifyDocumentModel.ts";
import { connect } from "../configs/rabbitmq/RabbitMQConfig.ts";
import { certifyDocument } from "../usecases/CertifyDocumentUseCase.ts";

class CertifyDocumentConsumer {
  async start() {
    const channel = await connect.createChannel();

    await channel.assertQueue("certify_document_queue", {
      durable: true,
    });

    await channel.prefetch(5);

    await channel.consume(
      "certify_document_queue",
      async (msg) => {
        if (!msg) return;

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

          channel.ack(msg);

          console.log(`Document ${certify.id} processed successfully.`);
        } catch (err: any) {
          const message = err instanceof Error ? err.message : "Unknown error";

          console.log(message);

          await CertifyDocumentModel.setErrored(certify.id, message);

          channel.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }
}

export default new CertifyDocumentConsumer();
