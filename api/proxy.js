export default async function handler(req, res) {
  const API_BASE = process.env.EXTERNAL_API_BASE || 'https://api.ezyhvac.com';
  // remove the /api/proxy prefix to forward the rest path/qs
  const path = req.url.replace(/^\/api\/proxy/, '') || '/';
  const target = `${API_BASE}${path}`;

  // read raw body for non-GET
  const getRawBody = () =>
    new Promise((resolve, reject) => {
      let data = '';
      req.on('data', chunk => (data += chunk));
      req.on('end', () => resolve(data));
      req.on('error', reject);
    });

  try {
    const headers = { ...req.headers };
    delete headers.host;
    delete headers.origin; // avoid sending original origin to upstream

    // inject API key if needed
    if (process.env.EXTERNAL_API_KEY) {
      headers['authorization'] = `Bearer ${process.env.EXTERNAL_API_KEY}`;
    }

    const response = await fetch(target, {
      method: req.method,
      headers,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : await getRawBody()
    });

    // copy response headers (except hop-by-hop)
    response.headers.forEach((v, k) => {
      if (!['transfer-encoding', 'connection'].includes(k.toLowerCase())) {
        res.setHeader(k, v);
      }
    });

    const text = await response.text();
    res.status(response.status).send(text);
  } catch (err) {
    res.status(500).json({ error: 'proxy_error', message: String(err) });
  }
}
