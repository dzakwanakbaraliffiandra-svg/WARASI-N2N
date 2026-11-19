/* ============================================================
   Pemeriksaan admin: header  X-Admin-Token  harus sama dengan
   variabel lingkungan ADMIN_TOKEN (diatur di Vercel).
   ============================================================ */

const crypto = require("crypto");

function cekAdmin(req) {
  const rahasia = process.env.ADMIN_TOKEN;
  if (!rahasia) return { ok: false, status: 503, error: "ADMIN_TOKEN belum diatur di server." };

  const token = String(req.headers["x-admin-token"] || "");
  /* hash dulu supaya panjangnya sama, lalu bandingkan tanpa bocor waktu */
  const a = crypto.createHash("sha256").update(token).digest();
  const b = crypto.createHash("sha256").update(rahasia).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    return { ok: false, status: 401, error: "Password admin salah." };
  }
  return { ok: true };
}

module.exports = { cekAdmin };
