const { getPool } = require("../../lib/db");

const KOLOM = `id, judul, deskripsi, nama, kategori, dukungan, target, komentar,
               rekomendasi, extract(epoch from created_at) * 1000 as "createdAt"`;

function rapikan(row) {
  return { ...row, createdAt: Number(row.createdAt) };
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");

  try {
    const pool = getPool();

    if (req.method === "GET") {
      const { rows } = await pool.query(
        `select ${KOLOM} from aspirasi order by created_at desc`
      );
      return res.status(200).json(rows.map(rapikan));
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});

      const judul = String(body.judul || "").trim().slice(0, 90);
      const deskripsi = String(body.deskripsi || "").trim().slice(0, 400);
      const nama = String(body.nama || "").trim().slice(0, 60);
      const kategori = String(body.kategori || "kritik").trim().slice(0, 40);

      if (!judul || !deskripsi) {
        return res.status(400).json({ error: "Judul dan isi kritik/saran wajib diisi." });
      }

      const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
      const { rows } = await pool.query(
        `insert into aspirasi (id, judul, deskripsi, nama, kategori)
         values ($1, $2, $3, $4, $5)
         returning ${KOLOM}`,
        [id, judul, deskripsi, nama, kategori]
      );
      return res.status(201).json(rapikan(rows[0]));
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Metode tidak diizinkan." });
  } catch (err) {
    console.error("[api/aspirasi]", err);
    return res.status(500).json({ error: "Terjadi kesalahan di server." });
  }
};
