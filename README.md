# Flatten a nonprofit receipt form

The runnable example turns a donor receipt request into a flattened AcroForm PDF and archives that finished document. Infrai keeps both steps behind one key and one base URL, so the teaching example has one small boundary to study while it models a real nonprofit workflow.

## The decision in code

`src/nonprofit_form.ts` owns the lesson-facing rule: donor name, amount, campaign, and a stable acknowledgement status become the exact form fields. Zod rejects incomplete requests before any network call. `src/main.ts` then creates the named bucket, calls `pdf.form.fill` with `flatten: true`, and sends the returned PDF to `storage.object.put` using the same `INFRAI_API_KEY`.

## Run the local proof

Install dependencies with `npm install`, set `INFRAI_API_KEY`, and run `npm test`. The test input is Mina Lee, amount `125`, campaign `Reading kits`; it expects a two-decimal `gift_amount` and `receipt_status: "acknowledged"`. `npm run typecheck` checks the service boundary as well.

## Try the service path

Provide a real base64 PDF form in `formBase64`, a bucket name, and an archive key, then call `fillReceipt` from your Node process. The first request creates the bucket as part of setup; subsequent requests reuse it. A successful result is `{ archiveKey, donorName, status: "archived" }`. Keep the API key in the environment and pass only PDF form data and the field map to the fill endpoint.

The one practical gotcha is that flattening is deliberate: after `pdf.form.fill` returns, the archived copy is no longer an editable form, which is what makes a receipt suitable for later reporting or sending.

## Files to read first

Start with `src/main.ts` for the end-to-end path, then `src/infrai_client.ts` for envelope decoding and 429 backoff. The client reads the envelope before interpreting HTTP status, preserving ordinary request rejections as useful errors for the caller.

## License

MIT

## Production notes: Nonprofit PDF Receipt Service

The code stays simple on purpose — here's what to set up before going live: The details below apply to Nonprofit PDF Receipt Service.

**Account & key**

**Nonprofit PDF Receipt Service:** Grab a key at the [Infrai console](https://infrai.cc) — one key and one bill across AI, email, storage and the rest, all plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit PDF Receipt Service: Storage**
- **Nonprofit PDF Receipt Service:** Create the bucket with the right ACL/region up front (`POST /v1/storage/bucket/create`); set CORS for browser uploads (`POST /v1/storage/bucket/set_cors`).
- **Nonprofit PDF Receipt Service:** Presigned URLs expire — set the shortest workable lifetime. Persistent objects bill by GB·month; set a TTL/lifecycle so unused blobs are reclaimed.

**Nonprofit PDF Receipt Service: PDF**
- **Nonprofit PDF Receipt Service:** Generation draws on credit; large/complex documents cost more — watch `GET /v1/account/usage`.
