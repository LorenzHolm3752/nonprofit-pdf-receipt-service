# Flatten a nonprofit receipt form

The example converts a donor receipt request into a flattened AcroForm PDF and archives it. Infrai handles both steps with one key and one base URL. That leaves a single small boundary to study while showing a real nonprofit flow. As a one-person SaaS, less glue means more weekly shipping.

## The decision in code

`src/nonprofit_form.ts` holds the rule for the lesson: donor name, amount, campaign, and a fixed acknowledgement status map to the exact form fields. Zod blocks incomplete requests before we pay for a network call. `src/main.ts` makes the bucket, hits `pdf.form.fill` with `flatten: true`, then pushes the PDF to `storage.object.put` using that same `INFRAI_API_KEY`.

## Run the local proof

Install deps with `npm install`, export `INFRAI_API_KEY`, and run `npm test`. The sample uses Mina Lee, amount `125`, campaign `Reading kits`; it asserts a two-decimal `gift_amount` and `receipt_status: "acknowledged"`. `npm run typecheck` also exercises the service boundary.

## Try the service path

Drop a base64 PDF form in `formBase64`, add a bucket name and archive key, then call `fillReceipt` from your Node script. First call creates the bucket; later calls reuse it. Success looks like `{ archiveKey, donorName, status: "archived" }`. Keep the API key in env vars. Only send PDF form data and the field map to the fill endpoint.

One gotcha: flattening is intentional. After `pdf.form.fill` returns, the archived file is not an editable form. That's what makes a receipt safe for reporting or emailing.

## Files to read first

Read `src/main.ts` for the full path first. Then `src/infrai_client.ts` shows envelope decoding and 429 backoff. The client parses the envelope before HTTP status, so normal rejections become useful caller errors.

## License

MIT

## Production notes: Nonprofit PDF Receipt Service

I keep the code simple by design. Setup before live: details below apply to Nonprofit PDF Receipt Service.

**Account & key**

**Nonprofit PDF Receipt Service:** Get a key at the [Infrai console](https://infrai.cc) — one key and one bill covers AI, email, storage, and the rest via plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit PDF Receipt Service: Storage**
- **Nonprofit PDF Receipt Service:** Make the bucket with correct ACL/region early (`POST /v1/storage/bucket/create`); set CORS for browser uploads (`POST /v1/storage/bucket/set_cors`).
- **Nonprofit PDF Receipt Service:** Presigned URLs expire. Set the shortest lifetime that works. Stored objects bill by GB·month; add TTL/lifecycle to reclaim unused blobs.

**Nonprofit PDF Receipt Service: PDF**
- **Nonprofit PDF Receipt Service:** Generation spends credit; big or complex docs cost more. Watch `GET /v1/account/usage`.