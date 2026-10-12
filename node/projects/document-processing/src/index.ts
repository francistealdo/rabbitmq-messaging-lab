import CertifyDocumentCronJob from "./jobs/CertifyDocumentCronJob.ts";
import CertifyDocumentProducerCronJob from "./jobs/CertifyDocumentProducerCronJob.ts";
import CertifyDocumentConsumerCronJob from "./jobs/CertifyDocumentConsumerCronJob.ts";

const mode = process.argv[2];

switch (mode) {
  case "producer":
    CertifyDocumentProducerCronJob.start();
    break;

  case "consumer":
    CertifyDocumentConsumerCronJob.start();
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
