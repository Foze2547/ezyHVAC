// api/proxy.js
export default async function handler(req, res) {
  const baseUrl = process.env.EXTERNAL_API_BASE || 'https://api.ezyhvac.com';

  const { path = '' } = req.query; // เช่น /v1/xxx
  const targetUrl = baseUrl + path;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        // ดึง header ที่สำคัญไปต่อให้
        'Content-Type': req.headers['content-type'] || 'application/json',
        // ถ้ามี key แบบ Bearer ก็ใส่ใน env ชื่อ EXTERNAL_API_KEY ได้
        ...(process.env.EXTERNAL_API_KEY
          ? { Authorization: `Bearer ${process.env.EXTERNAL_API_KEY}` }
          : {}),
      },
      body:
        req.method === 'GET' || req.method === 'HEAD'
          ? undefined
          : JSON.stringify(req.body),
    });

    const text = await response.text();

    res.status(response.status);
    res.setHeader(
      'Content-Type',
      response.headers.get('content-type') || 'application/json'
    );
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Proxy request failed' });
  }
}
