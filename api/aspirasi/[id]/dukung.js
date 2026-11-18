const { getPool } = require("../../../lib/db");

const KOLOM = `id, judul, deskripsi, nama, kategori, dukungan, target, komentar,
               rekomendasi, extract(epoch from created_at) * 1000 as "createdAt"`;

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Metode tidak diizinkan." });
  }

  try {
    const pool = getPool();
    const { rows } = await pool.query(
      `update aspirasi
       set dukungan = dukungan + 1
       where id = $1
       returning ${KOLOM}`,
      [req.query.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Aspirasi tidak ditemukan." });
    }
    return res.status(200).json({ ...rows[0], createdAt: Number(rows[0].createdAt) });
  } catch (err) {
    console.error("[api/aspirasi/dukung]", err);
    return res.status(500).json({ error: "Terjadi kesalahan di server." });
  }
};
