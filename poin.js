// ============================================================
// GELETEK — Data Rata-rata Poin Siswa (dari aplikasi Jurnal Mengajar)
// ============================================================
// File ini SENGAJA dipisah dari data.js supaya gampang diupdate manual
// tanpa harus menyentuh data.js (yang tampaknya di-generate ulang dari
// sumber lain).
//
// CARA UPDATE:
// 1. Buka aplikasi Jurnal Mengajar → tab "Rekap" → pilih kelas & bulan.
// 2. Lihat kolom "Rata² Poin" di tabelnya.
// 3. Salin angkanya ke sini, sesuai nama kelas & nama siswa PERSIS SAMA
//    dengan yang ada di data.js (huruf besar/kecil tidak masalah, tapi
//    ejaan harus sama).
// 4. Siswa yang belum diisi di sini otomatis tampil sebagai "–" di GELETEK
//    (tidak perlu isi semua sekaligus, boleh bertahap per kelas).
//
// Format nilai: angka 0–7 (boleh desimal, misal 4.3), sesuai skala poin
// di Jurnal Mengajar (default 3, minimum 0, maksimum 7 per pertemuan).
// ============================================================

const GELETEK_POIN = {
  "XI - 7": {
    // "AINI FAKHIRA GHASSANI": 3.4,
  },
  "XI - 8": {
    // "ADINDA NASYWA SALSABILA": 3.4,
  },
  "XII - 5": {
    // "AFFAN CAHYA WILDANDHIKA": 3.4,
  },
  "XII - 6": {
    // "ADITYA ARSHA SAPUTRA": 3.4,
  },
  "XII - 7": {
    // "ABIZAR AJI PAMUNGKAS": 3.4,
  }
};
