/* ============================================================
   DELETE /api/aspirasi/:id  -> hapus aspirasi (khusus admin)
   (Vercel Serverless Function)
   ============================================================ */

const { getPool } = require("../../../lib/db");
const { cekAdmin } = require("../../../lib/admin");

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "Metode tidak diizinkan." });
  }

  const admin = cekAdmin(req);
  if (!admin.ok) return res.status(admin.status).json({ error: admin.error });

  try {
    const pool = getPool();
    const { rowCount } = await pool.query("delete from aspirasi where id = $1", [req.query.id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: "Aspirasi tidak ditemukan." });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[api/aspirasi/:id DELETE]", err);
    return res.status(500).json({ error: "Terjadi kesalahan di server." });
  }
};
