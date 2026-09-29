import { strict as assert } from "node:assert";
import { receiptFields, receiptRequest } from "./nonprofit_form.js";

const input = { donorName: "Mina Lee", amount: 125, campaign: "Reading kits", formBase64: "cGRm", bucket: "school-aid", archiveKey: "receipts/mina-lee.pdf" };
const parsed = receiptRequest.parse(input);
assert.deepEqual(receiptFields(parsed), { donor_name: "Mina Lee", gift_amount: "125.00", campaign_name: "Reading kits", receipt_status: "acknowledged" });
console.log("receipt decision test passed");
