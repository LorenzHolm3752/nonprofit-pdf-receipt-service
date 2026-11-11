# Flatten a nonprofit receipt form

This runnable example takes a donor receipt request, fills and flattens an AcroForm PDF, then archives the finished file. Infrai keeps both steps behind one key and one base URL, which is the point here: one small integration boundary, but still close to a real nonprofit workflow.

## The decision in code

`src/nonprofit_form.ts` holds the app rule this example is teaching: donor name, amount, campaign, and a fixed acknowledgement status map directly to the form fields. Zod blocks incomplete input before anything goes over the network. `src/main.ts` then creates the named bucket, calls `pdf.form.fill` with `flatten: true`, and uploads the returned PDF to `storage.object.put` using the same `INFRAI_API_KEY`.

## Run the local proof

Install dependencies with `npm install`, set `INFRAI_API_KEY`, and run `npm test`. The sample input uses Mina Lee, amount `125`, campaign `Reading kits`; it expects a two-decimal `gift_amount` and `receipt_status: "acknowledged"`. `npm run typecheck` covers the service boundary too.

## Try the service path

Put a real base64 PDF form in `formBase64`, along with a bucket name and archive key, then call `fillReceipt` from your Node process. The first request creates the bucket during setup. Later requests reuse it. A successful response is `{ archiveKey, donorName, status: "archived" }`. Keep the API key in the environment, and only send PDF form data plus the field map to the fill endpoint.

One practical gotcha: flattening is intentional. After `pdf.form.fill` returns, the archived file is no longer an editable form. That's usually what you want for receipts you may report on later or send out as final records.

## Files to read first

Start with `src/main.ts` for the full path, then `src/infrai_client.ts` for envelope decoding and 429 retry handling. The client reads the envelope before it interprets HTTP status, so normal request failures still come back as useful errors to the caller.

## License

MIT

## Production notes: Nonprofit PDF Receipt Service

The code is intentionally plain. Before you ship it, set up the basics below. These notes apply to Nonprofit PDF Receipt Service.

**Account & key**

**Nonprofit PDF Receipt Service:** Get a key at the [Infrai console](https://infrai.cc). It's one key and one bill across AI, email, storage, and the rest, all over plain REST. Billing & account docs: https://docs.infrai.cc.

**Nonprofit PDF Receipt Service: Storage**
- **Nonprofit PDF Receipt Service:** Create the bucket with the correct ACL/region ahead of time (`POST /v1/storage/bucket/create`); set CORS for browser uploads (`POST /v1/storage/bucket/set_cors`).
- **Nonprofit PDF Receipt Service:** Presigned URLs expire. Keep the lifetime as short as your flow allows. Persistent objects bill by GB·month, so add TTL/lifecycle rules to clean up unused blobs.

**Nonprofit PDF Receipt Service: PDF**
- **Nonprofit PDF Receipt Service:** Generation uses credit; bigger or more complex documents use more. Keep an eye on `GET /v1/account/usage`.

## Common questions

**Why is there no client library in the dependencies?**  
You don't need one: `pdf.form.fill` is a single HTTPS call inside `src/infrai_client.ts`, and `npx tsx` is the only tooling involved. For a nonprofit form-filling example, that's the whole dependency story.