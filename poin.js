// ============================================================
// GELETEK — Data Rata-rata Poin Siswa (LIVE dari Jurnal Mengajar Online Berbayar)
// ============================================================
// Versi ini TIDAK LAGI diisi manual. Data poin diambil otomatis lewat
// koneksi publik (read-only) ke Supabase milik JMO Berbayar, memakai
// token_publik masing-masing kelas. Setiap kali guru mengisi jurnal &
// poin di JMO, angka di sini akan ikut ter-update otomatis begitu
// halaman GELETEK dibuka/dimuat ulang.
//
// TIDAK PERLU update manual lagi. Kalau ada kelas baru atau token
// berubah, cukup update objek TOKEN_KELAS di bawah ini.
// ============================================================

const SUPABASE_URL_GELETEK = "https://eziszpzxszxurvqcsikj.supabase.co";
const SUPABASE_ANON_KEY_GELETEK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6aXN6cHp4c3p4dXJ2cWNzaWtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNjMzNTYsImV4cCI6MjEwMTgzOTM1Nn0.q9YdOK9ph_WqDYhPfNVTqTVdKuMPLPFLicLBsOg5ivQ";

// Nama kelas (harus PERSIS SAMA dengan yang ada di data.js) -> token_publik dari JMO Berbayar
const TOKEN_KELAS = {
  "XI - 7": "caa20e62-16c6-49e4-b50e-7b4b3ec8962b",
  "XI - 8": "070a21c5-1bf3-40ae-bea1-3920afccd13d",
  "XII - 5": "12e02180-ceb1-468e-9e26-736a0303f239",
  "XII - 6": "86ebe232-8425-4ee8-8ac8-7cdfaa5089e9",
  "XII - 7": "cf8f92db-8e58-49f9-b87b-0465b603c3ed"
};

// Objek ini yang dibaca oleh script.js — mulai kosong, diisi otomatis oleh fetch di bawah.
// Karena ini OBJECT (bukan angka/teks), script.js yang sudah membaca referensinya
// akan otomatis "melihat" data begini terisi begitu fetch selesai (tidak perlu reload).
const GELETEK_POIN = {
  "XI - 7": {},
  "XI - 8": {},
  "XII - 5": {},
  "XII - 6": {},
  "XII - 7": {}
};

(function muatPoinLive() {
  // Supabase client dibuat manual (tanpa import module) supaya file ini tetap
  // bisa langsung dipakai sebagai <script src="poin.js"> biasa.
  function panggilRpc(namaFungsi, params) {
    return fetch(`${SUPABASE_URL_GELETEK}/rest/v1/rpc/${namaFungsi}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY_GELETEK,
        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY_GELETEK
      },
      body: JSON.stringify(params)
    }).then(res => {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  Object.entries(TOKEN_KELAS).forEach(([namaKelas, token]) => {
    panggilRpc('get_papan_poin_publik', { p_token: token })
      .then(daftar => {
        if (!Array.isArray(daftar)) return;
        daftar.forEach(s => {
          GELETEK_POIN[namaKelas][s.nama_siswa] = s.rata_poin;
        });
      })
      .catch(err => {
        console.warn('Gagal memuat poin live untuk kelas ' + namaKelas + ':', err.message);
      });
  });
})();
