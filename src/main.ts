import { InfraiClient } from "./infrai_client.js";
import { receiptFields, receiptRequest } from "./nonprofit_form.js";

const apiKey = process.env.INFRAI_API_KEY;
if (!apiKey) throw new Error("Set INFRAI_API_KEY before starting the service");
const client = new InfraiClient(apiKey);
const capability = "pdf.form.fill";

export async function fillReceipt(input: unknown) {
  const request = receiptRequest.parse(input);
  await client.request(`/v1/storage/bucket/create`, "POST", { name: request.bucket });
  const filled = await client.request<{ pdf_base64: string }>("/v1/pdf/form/fill", "POST", { pdf: request.formBase64, fields: receiptFields(request), flatten: true });
  await client.request(`/v1/storage/object/put/${encodeURIComponent(request.bucket)}/${encodeURIComponent(request.archiveKey)}`, "PUT", { data_base64: filled.pdf_base64 });
  return { archiveKey: request.archiveKey, donorName: request.donorName, status: "archived" as const };
}

if (process.argv[1]?.endsWith("main.ts")) {
  console.log("POST a validated receipt request to fillReceipt from your application.");
}
