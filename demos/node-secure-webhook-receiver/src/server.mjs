import http from "node:http";
import { IdempotencyStore, validateEvent, verifySignature } from "./webhook.mjs";

const PORT = Number(process.env.PORT || 3000);
const SECRET = process.env.WEBHOOK_SECRET;
const MAX_BODY_BYTES = 256 * 1024;
const ids = new IdempotencyStore();

if (!SECRET) throw new Error("WEBHOOK_SECRET is required");

function send(res, status, body) {
  const json = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json",
    "content-length": Buffer.byteLength(json),
  });
  res.end(json);
}

const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/webhook") {
    send(res, 404, { error: "not_found" });
    return;
  }

  let raw = "";
  req.setEncoding("utf8");
  req.on("data", (chunk) => {
    raw += chunk;
    if (Buffer.byteLength(raw) > MAX_BODY_BYTES) req.destroy();
  });

  req.on("end", () => {
    const eventId = String(req.headers["x-event-id"] || "").trim();
    const signature = req.headers["x-signature"];

    if (!eventId) return send(res, 400, { error: "missing_event_id" });
    if (!verifySignature(SECRET, raw, signature)) return send(res, 401, { error: "invalid_signature" });
    if (!ids.claim(eventId)) return send(res, 200, { ok: true, duplicate: true });

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return send(res, 400, { error: "invalid_json" });
    }

    const checked = validateEvent(parsed);
    if (!checked.ok) return send(res, 400, { error: checked.error });

    console.log(JSON.stringify({ eventId, type: checked.event.type }));
    return send(res, 202, { ok: true });
  });
});

server.listen(PORT, () => console.log(`Webhook receiver listening on :${PORT}`));
