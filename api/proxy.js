// api/proxy.js  (Vercel Serverless Function - Node.js)

const EXTERNAL_API_BASE =
  process.env.EXTERNAL_API_BASE || "https://api.ezyhvac.com";

export default async function handler(req, res) {
  try {
    // ดึงค่า ?path=/api/measure-image จาก URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.searchParams.get("path") || "";

    if (!path.startsWith("/")) {
      res.status(400).json({ error: "missing ?path=/api/..." });
      return;
    }

    const target = EXTERNAL_API_BASE.replace(/\/$/, "") + path;

    // อ่าน body จาก browser เป็น buffer ดิบ ๆ (รวม multipart/form-data ทั้งก้อน)
    let bodyBuffer = undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      bodyBuffer = Buffer.concat(chunks);
    }

    // forward header ที่จำเป็น (โดยเฉพาะ content-type)
    const headers = {};
    if (req.headers["content-type"]) {
      headers["content-type"] = req.headers["content-type"];
    }
    if (req.headers.authorization) {
      headers["authorization"] = req.headers.authorization;
    }

    // ยิงต่อไปที่ api.ezyhvac.com
    const upstream = await fetch(target, {
      method: req.method,
      headers,
      body: bodyBuffer,
    });

    // ส่ง status + header กลับไปที่ browser
    res.status(upstream.status);
    upstream.headers.forEach((value, key) => {
      if (key.toLowerCase() === "content-encoding") return;
      res.setHeader(key, value);
    });

    const buf = Buffer.from(await upstream.arrayBuffer());
    res.end(buf);
  } catch (err) {
    console.error("Proxy error:", err);
    res
      .status(500)
      .json({ error: "proxy_failed", detail: String(err ?? "unknown") });
  }
}
