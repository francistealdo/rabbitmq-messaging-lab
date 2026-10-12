import { CronJob } from "cron";
import CertifyDocumentModel from "../models/CertifyDocumentModel.ts";
import { certifyDocument } from "../usecases/CertifyDocumentUseCase.ts";

class CertifyDocumentCronJob {
  private isCronRunning: boolean = false;
  public start() {
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

        this.isCronRunning = false;
      },
      null,
      true,
      "America/Sao_Paulo",
    );
  }
}

export default new CertifyDocumentCronJob();
