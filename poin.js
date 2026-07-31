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
    "AINI FAKHIRA GHASSANI": 3,
    "ALAN AGSTAFA RAMADHAN": 3,
    "ALDHE MOHAMAD SHALFI": 3,
    "ANJAR NUR SAFITRI": 3,
    "AULIA PUTRI NURRAMADHANI": 3,
    "BINTANG SATRIA BHAKTI": 3.3,
    "DARA VICTORIA SESYA": 3.5,
    "DEWI NURCAHYANINGRUM": 3,
    "DZAKIYAH TALITA ANENTY": 3.7,
    "ESTHI SHINTA CHAERANI": 3.3,
    "FIRDHA FEBRIANA": 3,
    "GABRILLYA YULIANA WIBAWA": 3,
    "GINUBAH SURANTI": 3,
    "JELITA ANGELINA": 3.3,
    "KAILA AURA TRIDAMA": 3.7,
    "KAMANALU RAMADHAN ABHISEKA": 3.2,
    "KEISYA YUANITA RAHMAWATI": 3,
    "KEYSHA NANDITA PUTRI": 3,
    "KINTAN AYUMI PUTRI": 3,
    "LINTANG ASSYIFA ASRININGTYAS": 3,
    "LOVINA PRICELLYA NOVIANTIE": 3,
    "LUTFIYAH REGHINA ANDRIYANI": 3,
    "MAYZA RAHAYU NINGTYAS": 3.5,
    "MEYZILA PRATIWI UTOMO": 3.3,
    "NADIA KESYA LUNIKA": 4,
    "NOVIA ELDA AYU RAHMAH": 3,
    "NOVYAN RIZQY PUTRA PRATAMA": 3,
    "NYDIA SEKAR GARIZAH": 3.2,
    "REYHANUM ZELIYA NOVANTI": 3.3,
    "SEKAR AYUNINGTYAS": 3,
    "SEKAR NUGRAHANI DEWI TITISARI": 3,
    "SHINTIA AURA PUTRI": 3.3,
    "SITI MUSLIMAH": 3.5,
    "SYIFA RARA TUNGGA": 3.2,
    "YOGA WIRANATA": 3,
    "YUKHA IMAN UEIL": 3.2,
  },
  "XI - 8": {
    "ADINDA NASYWA SALSABILA": 3.2,
    "ADZKIA RIZKY AULIYAH": 3.2,
    "AIRA KHIRANIAVISTA RIZKY EKSHANANDA": 3.2,
    "ALIFAH HASNA HUWAIDAH": 3.5,
    "ANINDYA QUEENSHA MAHARDIKA": 3.2,
    "ARETA NUR CALLYSTA PUTRI": 3.5,
    "AZ ZAHRA BELLA OKTAVIANI": 3.2,
    "CORNELLIA JANICE REVANNITA": 3.2,
    "DANANG WISNU MURTI": 3.5,
    "DIMAS ADLI AIDAN": 3.2,
    "DIVANDA OKTAVIANNA": 3.2,
    "ELYSA NUR OKTAVIA": 3.2,
    "FADHIL ZAIDAN ARDIANSYAH": 3.3,
    "FEEBRYOLA PRATAMA": 3.2,
    "FRANSISKA DWI ARIYANTI": 3.3,
    "GATAYU DYAH DANASTRI": 3.3,
    "GIOVANNI DINDA RAISYA": 3.7,
    "HABIB BRIYAN PRASETYA": 3.3,
    "HAFIZHAH WIDYA RAHMAWATI": 3.2,
    "JENIFER KARTIKA SAPUTRI": 3.3,
    "KELVIN ERDIANTO": 3.2,
    "MISHEL SHAISTAMINATUS JULIANSHAH NOOR": 3.2,
    "NABILLA NUR AVIFA SETIONINGSIH": 3.5,
    "NATASYA ABELLA SYAFITRI MAHARANI": 3.2,
    "NEISKA AURELIASYAFA JUNATRIA": 3.3,
    "NESYA LISTIYANTO PUTRI": 3.3,
    "NIDYA ELSAVANIA": 3.3,
    "NONIK KINANTI": 3.2,
    "RAFA DWI NUGROHO": 3.2,
    "RAFASYA NAURA AQILLA": 3.3,
    "RANGGA DWI APRIYANTO PUTRA": 3.3,
    "SELLANIA PUTRI RAMADHANI": 3.7,
    "SHEPTIA FITRI ASTUTI": 3.2,
    "SYAHFA FRESTY SALSABILA": 3.2,
    "VINSENSIUS KAROL RIVALDI": 3.3,
    "ZIDANE ANDYA DARMAWAN": 3.2,
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
