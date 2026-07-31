# GELETEK — GEnerasi MeLEk TEKnologi

Direktori data kelas ampuan untuk mata pelajaran **Informatika** serta
**Koding dan Kecerdasan Artifisial (KKA)** — SMA Negeri 1 Baturetno,
Tahun Ajaran 2026/2027.

Dibangun oleh **Dimas Bagus Nurdiansyah**.

## Isi proyek

```
geletek/
├── index.html      # struktur halaman
├── style.css       # tema visual (dark, futuristik)
├── script.js       # logika interaktif (grid kelas, jaringan SVG, pencarian, modal)
├── data.js         # data siswa per kelas (sumber: file Excel yang diunggah)
└── vercel.json     # konfigurasi ringan untuk deploy Vercel
```

Situs ini **statis murni** (HTML/CSS/JS biasa) — tidak butuh proses build,
server, atau database. Semua data dimuat langsung dari `data.js`.

## PWA (Progressive Web App)

GELETEK bisa dipasang seperti aplikasi biasa ke HP atau laptop.

**File-file terkait:**
```
manifest.json    # identitas & ikon aplikasi
sw.js            # service worker — bikin situs bisa dibuka offline
pwa.js           # registrasi service worker + pop-up ajakan instalasi
icons/           # ikon aplikasi (192px, 512px, maskable, apple-touch-icon)
```

**Cara kerja pop-up instalasi:**
- **Android / Chrome & Edge desktop** — begitu browser mendeteksi situs ini
  memenuhi syarat PWA, muncul banner "Pasang GELETEK di perangkat ini" di
  bagian bawah layar dengan tombol **Instal** dan **Nanti Saja**.
- **iPhone/iPad (Safari)** — karena iOS tidak mendukung pop-up instalasi
  otomatis, muncul banner berisi instruksi manual: *"Ketuk tombol Bagikan,
  lalu pilih Tambah ke Layar Utama"*.
- Kalau ditekan **Nanti Saja**, banner tidak akan muncul lagi selama 7 hari
  (disimpan di penyimpanan lokal perangkat, bukan di server).
- Banner tidak akan muncul sama sekali jika situs sudah terpasang sebagai
  aplikasi (terdeteksi otomatis).

**Offline:** setelah dibuka sekali secara online, `service worker` menyimpan
salinan halaman dan data siswa di perangkat, sehingga GELETEK tetap bisa
dibuka meski tidak ada koneksi internet (menampilkan data hasil sinkronisasi
terakhir).

**Catatan saat deploy:** semua file di atas (`manifest.json`, `sw.js`, `pwa.js`,
folder `icons/`) harus ikut ter-upload ke Vercel di root folder yang sama
dengan `index.html` — jangan dipisah ke folder lain, karena path di dalam
`index.html` dan `manifest.json` bersifat relatif.

## Cara deploy ke Vercel (domain geletek.vercel.app)

**Opsi A — lewat Vercel CLI (paling cepat)**
```bash
npm install -g vercel
cd geletek
vercel login
vercel --prod
```
Saat ditanya nama proyek, isi `geletek` agar domain default menjadi
`geletek.vercel.app` (jika nama tersebut masih tersedia).

**Opsi B — lewat GitHub + dashboard Vercel**
1. Unggah folder ini ke sebuah repository GitHub.
2. Buka [vercel.com/new](https://vercel.com/new), pilih repo tersebut.
3. Framework Preset: pilih **Other** (situs statis, tanpa build command).
4. Klik **Deploy**.
5. Di **Settings → Domains**, atur/pastikan domain `geletek.vercel.app`.

## Cara memperbarui data siswa

Buka `data.js`, cari kelas dan nama siswa yang ingin diubah, lalu sunting
langsung objek JSON di dalamnya (format `{ "no": 1, "nama": "..." }`).
Setelah disimpan, deploy ulang (`vercel --prod` atau push ke GitHub) —
tidak perlu mengubah `index.html`, `style.css`, maupun `script.js`.

## Fitur

- Ringkasan 5 kelas ampuan dalam bentuk kartu "simpul" interaktif
- Diagram jaringan animasi (berputar halus, searah jarum jam) menghubungkan
  kelima kelas ke inti GELETEK — tidak ada satu kelas yang menetap di posisi atas
- Detail siswa per kelas (nomor presensi + nama) dalam modal, lengkap
  dengan kotak pencarian di dalam kelas tersebut
- **Salin data** — salin daftar siswa (atau hasil pencarian) satu kelas ke clipboard sekali klik
- **Pengacak nama** — tab khusus di dalam tiap modal kelas untuk memilih siswa
  secara acak (misalnya untuk sesi tanya jawab). Bisa diatur "tanpa pengulangan"
  sampai direset, dan menyimpan riwayat siapa saja yang sudah terpilih
- **Mode cetak / PDF** — tombol "Cetak / PDF" di setiap modal kelas (satu kelas),
  dan tombol "Cetak Semua Kelas" di halaman utama (kelima kelas sekaligus, satu
  kelas per halaman). Memakai dialog cetak bawaan browser — pilih "Save as PDF"
  di sana untuk mengunduh sebagai file PDF, atau kirim langsung ke printer
- **PWA (Progressive Web App)** — bisa dipasang ke layar utama HP/desktop seperti
  aplikasi native, tetap bisa dibuka saat offline (memakai data terakhir yang
  tersimpan), dan muncul pop-up ajakan pasang otomatis (lihat bagian PWA di bawah)
- Pencarian nama lintas seluruh kelas dari satu kotak pencarian
- Sepenuhnya responsif (desktop, tablet, mobile) dan mendukung
  `prefers-reduced-motion`
