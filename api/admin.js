/* ============================================================
   POST /api/admin  -> cek password admin (dipakai form login)
   (Vercel Serverless Function)
   ============================================================ */

const { cekAdmin } = require("../lib/admin");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metode tidak diizinkan." });
  }

  const hasil = cekAdmin(req);
  if (!hasil.ok) return res.status(hasil.status).json({ error: hasil.error });
  return res.status(200).json({ ok: true });
};
