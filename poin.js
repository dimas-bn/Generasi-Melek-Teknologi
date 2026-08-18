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
        suntikkanBadgeKelas(namaKelas);
      })
      .catch(err => {
        console.warn('Gagal memuat poin live untuk kelas ' + namaKelas + ':', err.message);
      });
  });

  // Kartu kelas di halaman utama (class-grid) menghitung rata-rata poin SEKALI saat
  // halaman pertama dimuat (lewat script.js) — saat itu data live dari sini belum
  // tentu selesai di-fetch, jadi bintangnya kosong. Fungsi ini menyuntikkan bintang
  // itu langsung ke kartu yang bersangkutan begitu datanya siap, tanpa mengubah script.js.
  function suntikkanBadgeKelas(namaKelas) {
    const card = document.querySelector('.class-card[data-kelas="' + CSS.escape(namaKelas) + '"]');
    if (!card) return; // kartu belum ada di DOM (belum dirender) — coba lagi sebentar lagi
    const footSpan = card.querySelector('.class-card__foot > span:first-child');
    if (!footSpan || footSpan.querySelector('.class-card__poin')) return; // sudah ada / elemen tidak ditemukan

    const nilaiPoin = Object.values(GELETEK_POIN[namaKelas] || {}).filter(v => typeof v === 'number' && !isNaN(v));
    if (!nilaiPoin.length) return;
    const rata = nilaiPoin.reduce((a, b) => a + b, 0) / nilaiPoin.length;
    const formatRata = Number.isInteger(rata) ? String(rata) : rata.toFixed(1);

    const badge = document.createElement('span');
    badge.className = 'class-card__poin';
    badge.title = 'Rata-rata poin kelas (Jurnal Mengajar)';
    badge.innerHTML = '&#9733; ' + formatRata;
    footSpan.appendChild(document.createTextNode(' \u00b7 '));
    footSpan.appendChild(badge);
  }

  // Kartu kelas dirender oleh script.js sesaat setelah DOMContentLoaded, kadang lebih
  // lambat dari fetch pertama di atas — coba suntik ulang beberapa kali di awal untuk jaga-jaga.
  let percobaan = 0;
  const timer = setInterval(() => {
    percobaan++;
    Object.keys(TOKEN_KELAS).forEach(suntikkanBadgeKelas);
    if (percobaan >= 10) clearInterval(timer);
  }, 500);
})();
