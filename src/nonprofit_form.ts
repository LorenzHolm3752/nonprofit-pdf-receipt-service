import { z } from "zod";

export const receiptRequest = z.object({
  donorName: z.string().min(1),
  amount: z.number().positive(),
  campaign: z.string().min(1),
  formBase64: z.string().min(1),
  bucket: z.string().min(1),
  archiveKey: z.string().min(1)
});
export type ReceiptRequest = z.infer<typeof receiptRequest>;

export function receiptFields(input: ReceiptRequest): Record<string, string> {
  return { donor_name: input.donorName, gift_amount: input.amount.toFixed(2), campaign_name: input.campaign, receipt_status: "acknowledged" };
}
