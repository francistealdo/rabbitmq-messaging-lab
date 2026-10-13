import CertifyDocumentCronJob from "./jobs/CertifyDocumentCronJob.ts";
import CertifyDocumentProducerCronJob from "./jobs/CertifyDocumentProducerCronJob.ts";
import CertifyDocumentConsumer from "./consumers/CertifyDocumentConsumer.ts";

const mode = process.argv[2];

switch (mode) {
  case "producer":
    CertifyDocumentProducerCronJob.start();
    break;

  case "consumer":
    CertifyDocumentConsumer.start();
    break;

  case "legacy":
    CertifyDocumentCronJob.start();
    break;

  default:
    console.log("Usage:");
    console.log("  npm run document-processing:producer");
    console.log("  npm run document-processing:consumer");
    console.log("  npm run document-processing:legacy");
}
