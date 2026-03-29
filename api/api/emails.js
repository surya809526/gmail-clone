export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const UNIPILE = 'https://api20.unipile.com:15002/api/v1';
  const KEY = process.env.UNIPILE_API_KEY;
  try {
    if (req.method === 'POST') {
      const { account_id, to, subject, body } = req.body;
      const r = await fetch(`${UNIPILE}/emails`, {
        method: 'POST',
        headers: { 'X-API-KEY': KEY, 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({ account_id, to, subject, body })
      });
      return res.status(r.ok ? 200 : 400).json(await r.json());
    }
    const { account_id, folder = 'INBOX', limit = 30 } = req.query;
    const r = await fetch(`${UNIPILE}/emails?account_id=${account_id}&folder=${folder}&limit=${limit}`, {
      headers: { 'X-API-KEY': KEY, accept: 'application/json' }
    });
    res.status(200).json(await r.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
      }
